import express from "express";
import Groq from "groq-sdk";
import { Product } from "../models/Product.js";

const router = express.Router();

function buildFallbackReply(question, products) {
  const normalizedQuestion = question.toLowerCase();
  const budgetMatch = normalizedQuestion.match(/under\s*₹?\s*(\d+)/i);
  const budget = budgetMatch ? Number(budgetMatch[1]) : null;

  let recommendedProducts = products;

  if (budget) {
    recommendedProducts = products.filter((product) => (product.discountPrice || product.price) <= budget);
  }

  const topMatches = recommendedProducts.slice(0, 3);

  if (!topMatches.length) {
    return "I could not find an exact match in the current catalog, but I can help compare energy ratings, capacity, warranty, and smart features if you tell me your budget and appliance type.";
  }

  const intro = normalizedQuestion.includes("warranty")
    ? "Here are the warranty details from our current catalog:"
    : "Here are a few strong options from Sri Palani Andavan Electronics:";

  const summary = topMatches
    .map((product) => {
      const price = product.discountPrice || product.price;
      return `${product.name} by ${product.brand} at ₹${price} with ${product.warranty}.`;
    })
    .join(" ");

  return `${intro} ${summary}`;
}

router.post("/", async (req, res, next) => {
  try {
    const { question = "", currentProductId } = req.body;

    if (!question.trim()) {
      res.status(400).json({ message: "Please send a question for the shopping assistant." });
      return;
    }

    const products = await Product.find().sort({ isFeatured: -1, popularityScore: -1 }).limit(12);
    const currentProduct = currentProductId ? await Product.findById(currentProductId) : null;

    if (!process.env.GROQ_API_KEY) {
      res.json({
        answer: buildFallbackReply(question, currentProduct ? [currentProduct, ...products] : products)
      });
      return;
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const catalogSummary = products
      .slice(0, 8)
      .map(
        (product) =>
          `${product.name} | ${product.category} | ${product.brand} | ₹${product.discountPrice || product.price} | Warranty: ${product.warranty}`
      )
      .join("\n");

    const currentProductSummary = currentProduct
      ? `Current product context: ${currentProduct.name}, ${currentProduct.description}, warranty ${currentProduct.warranty}.`
      : "";

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful sales assistant for Sri Palani Andavan Electronics, a home appliances store. Give concise buying advice, mention warranty and price where relevant, and never invent products outside the provided catalog."
        },
        {
          role: "user",
          content: `${currentProductSummary}\nCatalog snapshot:\n${catalogSummary}\n\nCustomer question: ${question}`
        }
      ],
      temperature: 0.4,
      max_completion_tokens: 300
    });

    res.json({
      answer: completion.choices?.[0]?.message?.content || buildFallbackReply(question, products)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
