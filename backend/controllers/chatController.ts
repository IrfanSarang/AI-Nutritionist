import { Request, Response } from "express";

export const chatWithAI = async (req: Request, res: Response) => {
  const { message, conversationHistory } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message is required" });
  }

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
                    userMessage: message,
                    conversationHistory,
                  }),
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I could not understand.";

    res.json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ reply: "Internal server error" });
  }
};
