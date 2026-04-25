import { Request, Response } from "express";

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
};

// 🔴 Validate a single history item
const isValidHistoryItem = (item: any) => {
  return (
    item &&
    typeof item === "object" &&
    typeof item.sender === "string" &&
    typeof item.text === "string"
  );
};

export const chatWithAI = async (req: Request, res: Response) => {
  let { message, conversationHistory } = req.body;

  // =========================
  // INPUT SANITIZATION
  // =========================
  const sanitizedMessage =
    typeof message === "string"
      ? message.replace(/<[^>]*>/g, "").substring(0, 1000)
      : "";

  if (!sanitizedMessage) {
    return res.status(400).json({ reply: "Message is required" });
  }

  // =========================
  // SAFE CONVERSATION HISTORY
  // =========================
  const safeHistory = Array.isArray(conversationHistory)
    ? conversationHistory.filter(isValidHistoryItem).slice(-10) // 🔴 LIMIT TO LAST 10 MESSAGES ONLY
    : [];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY_1}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: JSON.stringify({
                    assistantProfile: {
                      name: "Nova",
                      role: "AI Nutritionist",
                      description:
                        "Hi! I am Nova, your AI Nutritionist. I first understand the user problem, explain it simply, ask clarifying questions, and only give meal plans when requested. Meals use Indian foods, balanced macros, and healthy cooking. Responses are under 100 words.",
                    },
                    userMessage: sanitizedMessage,
                    conversationHistory: safeHistory, // 🔴 FIXED
                  }),
                },
              ],
            },
          ],
        }),
      },
    );

    // =========================
    // API ERROR HANDLING
    // =========================
    if (!response.ok) {
      console.error("Gemini API error:", response.status);
      return res.status(502).json({
        reply: "AI service temporarily unavailable.",
      });
    }

    const data: GeminiResponse = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I could not understand.";

    return res.json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      reply: "Internal server error",
    });
  }
};
