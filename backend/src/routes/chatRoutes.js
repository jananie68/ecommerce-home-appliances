import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import Groq from "groq-sdk";
import { Product } from "../models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const router = express.Router();
const SUPPORTED_HISTORY_ROLES = new Set(["user", "assistant"]);

let groqClient;

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }

  return groqClient;
}

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value = "") {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length >= 2);
}

function formatPrice(product) {
  return product.discountPrice || product.price;
}

function buildProductText(product = {}) {
  const specificationText = (product.specifications || [])
    .map((specification) => `${specification.label} ${specification.value}`)
    .join(" ");

  return normalizeText(
    [
      product.name,
      product.brand,
      product.category,
      product.shortDescription,
      product.description,
      product.warranty,
      ...(product.tags || []),
      specificationText
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function scoreProduct(product, questionTokens, normalizedQuestion, currentProductId) {
  const productText = buildProductText(product);
  const productTokens = new Set(productText.split(" "));
  let score = 0;

  if (currentProductId && String(product._id) === String(currentProductId)) {
    score += 120;
  }

  for (const token of questionTokens) {
    if (productTokens.has(token)) {
      score += token.length > 4 ? 10 : 6;
    } else if (productText.includes(token)) {
      score += 4;
    }
  }

  const budgetMatch =
    normalizedQuestion.match(/under\s*(?:rs|inr)?\s*(\d{4,6})/i) ||
    normalizedQuestion.match(/below\s*(?:rs|inr)?\s*(\d{4,6})/i) ||
    normalizedQuestion.match(/around\s*(?:rs|inr)?\s*(\d{4,6})/i);
  const budget = budgetMatch ? Number(budgetMatch[1]) : null;
  const price = formatPrice(product);

  if (budget && price > 0) {
    if (price <= budget) {
      score += 18;
    } else if (price <= budget * 1.15) {
      score += 8;
    }
  }

  if (normalizedQuestion.includes("warranty") && product.warranty) {
    score += 6;
  }

  if (normalizedQuestion.includes("power") || normalizedQuestion.includes("energy")) {
    if (["energy", "star", "inverter", "eco"].some((token) => productText.includes(token))) {
      score += 6;
    }
  }

  if (normalizedQuestion.includes("family") && /(\bkg\b|\bl\b|\blitre\b|\bliter\b)/.test(productText)) {
    score += 4;
  }

  score += Math.min(product.popularityScore || 0, 20);
  score += Math.min((product.ratingAverage || 0) * 2, 10);

  return score;
}

function selectRelevantProducts(question, products, currentProduct) {
  const normalizedQuestion = normalizeText(question);
  const questionTokens = tokenize(question);

  const sortedProducts = products
    .map((product) => ({
      product,
      score: scoreProduct(product, questionTokens, normalizedQuestion, currentProduct?._id)
    }))
    .sort(
      (left, right) =>
        right.score - left.score ||
        (right.product.popularityScore || 0) - (left.product.popularityScore || 0) ||
        (right.product.ratingAverage || 0) - (left.product.ratingAverage || 0)
    )
    .map((entry) => entry.product);

  const orderedProducts = currentProduct
    ? [currentProduct, ...sortedProducts.filter((product) => String(product._id) !== String(currentProduct._id))]
    : sortedProducts;

  return orderedProducts.slice(0, 6);
}

function formatProductForPrompt(product) {
  const specificationText = (product.specifications || [])
    .slice(0, 6)
    .map((specification) => `${specification.label}: ${specification.value}`)
    .join(", ");

  return [
    `Name: ${product.name}`,
    `Brand: ${product.brand}`,
    `Category: ${product.category}`,
    `Price: INR ${formatPrice(product)}`,
    `Warranty: ${product.warranty}`,
    `Stock quantity: ${product.stockQuantity}`,
    product.shortDescription ? `Short description: ${product.shortDescription}` : null,
    product.description ? `Description: ${product.description}` : null,
    specificationText ? `Specifications: ${specificationText}` : null
  ]
    .filter(Boolean)
    .join("\n");
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (message) =>
        message &&
        SUPPORTED_HISTORY_ROLES.has(message.role) &&
        typeof message.content === "string" &&
        message.content.trim()
    )
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: message.content.trim()
    }));
}

function buildFallbackReply(question, products) {
  const normalizedQuestion = question.toLowerCase();
  const budgetMatch = normalizedQuestion.match(/under\s*(?:₹|rs|inr)?\s*(\d+)/i);
  const budget = budgetMatch ? Number(budgetMatch[1]) : null;

  let recommendedProducts = products;

  if (budget) {
    recommendedProducts = products.filter((product) => formatPrice(product) <= budget);
  }

  const topMatches = recommendedProducts.slice(0, 3);

  if (!topMatches.length) {
    return "I could not find an exact match in the current catalog. Tell me the appliance type, budget, and any must-have features, and I will narrow it down.";
  }

  const intro = normalizedQuestion.includes("warranty")
    ? "Here are the warranty details from our current catalog:"
    : "Here are a few relevant options from Sri Palani Andavan Electronics:";

  const summary = topMatches
    .map((product) => `${product.name} by ${product.brand} at INR ${formatPrice(product)} with ${product.warranty}.`)
    .join(" ");

  return `${intro} ${summary}`;
}

router.post("/", async (req, res, next) => {
  try {
    const { question = "", currentProductId, history = [] } = req.body;
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      res.status(400).json({ message: "Please send a question for the shopping assistant." });
      return;
    }

    const products = await Product.find()
      .sort({ isFeatured: -1, popularityScore: -1, ratingAverage: -1 })
      .limit(36)
      .lean();
    const currentProduct = currentProductId ? await Product.findById(currentProductId).lean() : null;
    const relevantProducts = selectRelevantProducts(trimmedQuestion, products, currentProduct);
    const conversationHistory = sanitizeHistory(history);
    const groq = getGroqClient();

    if (!groq) {
      res.json({
        answer: buildFallbackReply(trimmedQuestion, relevantProducts)
      });
      return;
    }

    const currentProductSummary = currentProduct
      ? `Current product context:\n${formatProductForPrompt(currentProduct)}`
      : "Current product context: none";
    const catalogSummary = relevantProducts.map((product) => formatProductForPrompt(product)).join("\n\n---\n\n");

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: [
            "You are the shopping assistant for Sri Palani Andavan Electronics, a home-appliance store.",
            "Be accurate, helpful, and responsible.",
            "Use only the provided catalog context.",
            "Do not invent products, prices, warranty terms, ratings, or specifications.",
            "Do not recommend products outside this catalog or tell the customer to check the wider market.",
            "If the answer depends on missing info like budget, family size, room size, capacity, or preferred brand, ask one short follow-up question.",
            "If the catalog does not contain a strong match, say that clearly and suggest the nearest available options.",
            "Keep replies practical and concise.",
            "Mention exact catalog price and warranty when relevant.",
            "Do not use pushy sales phrasing like asking the customer to proceed with purchase unless they explicitly ask to buy."
          ].join(" ")
        },
        ...conversationHistory,
        {
          role: "user",
          content: `${currentProductSummary}\n\nRelevant catalog products:\n${catalogSummary}\n\nCustomer question: ${trimmedQuestion}`
        }
      ],
      temperature: 0.3,
      max_completion_tokens: 400
    });

    res.json({
      answer: completion.choices?.[0]?.message?.content?.trim() || buildFallbackReply(trimmedQuestion, relevantProducts)
    });
  } catch (error) {
    console.error("Chatbot route failed:", error);

    try {
      const fallbackProducts = await Product.find().sort({ isFeatured: -1, popularityScore: -1 }).limit(6).lean();
      res.json({
        answer: buildFallbackReply(req.body?.question || "", fallbackProducts)
      });
    } catch (fallbackError) {
      next(fallbackError);
    }
  }
});

export default router;
