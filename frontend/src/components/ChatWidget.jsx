import { useState } from "react";
import { Bot, LoaderCircle, MessageSquare, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../lib/api";

const starterMessages = [
  {
    role: "assistant",
    content: "Hello from Sri Palani Andavan Electronics. Ask me about appliances, warranties, or the best product for your budget."
  }
];

function ChatWidget({ currentProductId }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(starterMessages);

  async function sendMessage(question) {
    if (!question.trim()) {
      return;
    }

    const userMessage = { role: "user", content: question };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/chatbot", {
        question,
        currentProductId
      });

      setMessages((current) => [...current, { role: "assistant", content: response.data.answer }]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Assistant is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-3 rounded-full bg-coral px-5 py-4 text-sm font-bold text-white shadow-glow transition hover:translate-y-[-2px]"
      >
        {open ? <X size={18} /> : <MessageSquare size={18} />}
        AI Appliance Guide
      </button>

      {open ? (
        <div className="fixed bottom-24 right-6 z-40 flex h-[32rem] w-[min(92vw,24rem)] flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_28px_100px_rgba(9,17,34,0.24)]">
          <div className="flex items-center justify-between bg-ink px-5 py-4 text-white">
            <div>
              <p className="font-display text-lg font-bold">Groq Shopping Assistant</p>
              <p className="text-xs text-slate-300">Fast product advice for every appliance category</p>
            </div>
            <Bot size={22} />
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                  message.role === "assistant"
                    ? "rounded-bl-md bg-white text-slate-700 shadow-sm"
                    : "ml-auto rounded-br-md bg-coral text-white"
                }`}
              >
                {message.content}
              </div>
            ))}

            {loading ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
                <LoaderCircle size={16} className="animate-spin" />
                Thinking...
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
            className="border-t border-slate-100 bg-white p-4"
          >
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="w-full border-none bg-transparent text-sm focus:ring-0"
                placeholder='Try "Best washing machine under 20000"'
              />
              <button type="submit" className="rounded-full bg-ink p-2 text-white transition hover:bg-coral">
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

export default ChatWidget;
