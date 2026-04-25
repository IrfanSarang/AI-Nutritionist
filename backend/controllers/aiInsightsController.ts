import { Request, Response } from "express";

/**
 * Safe Gemini API response type
 * prevents TS2339: candidates does not exist
 */
type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
    finishReason?: string;
  }[];
};

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY_2;

/**
 * Helper function (avoids duplicate fetch code)
 */
async function callGemini(prompt: string) {
  const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  return (await response.json()) as GeminiResponse;
}

/* ================================
   PRODUCT INSIGHT CONTROLLER
================================ */
export const getProductAIInsight = async (req: Request, res: Response) => {
  const { ingredients } = req.body;

  if (!ingredients) {
    return res.status(400).json({ reply: "Ingredients are required" });
  }

  const prompt = `
You are a friendly nutrition expert 🤗.
Analyze ingredients and give bullet points with verdict.
Ingredients:
${ingredients}
`;

  try {
    const data = await callGemini(prompt);

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No AI insights available.";

    return res.json({ reply });
  } catch (error) {
    console.error("Gemini Product AI Error:", error);
    return res.status(500).json({
      reply: "Internal server error",
    });
  }
};

/* ================================
   PROFILE DIAGNOSIS CONTROLLER
================================ */
export const getProfileAIDiagnosis = async (req: Request, res: Response) => {
  const { profile } = req.body;

  if (!profile) {
    return res.status(400).json({ reply: "Profile data is required" });
  }

  const prompt = `
You are a health assistant 🤗.
Give BMI + diet advice + allergies + activity tips.

Profile:
Name: ${profile.name}
Age: ${profile.age}
Gender: ${profile.gender}
Height: ${profile.height}
Weight: ${profile.weight}
Diet: ${profile.dietType}
Allergies: ${profile.allergies}
Goal: ${profile.healthGoal}
Activity: ${profile.activityLevel}
`;

  try {
    const data = await callGemini(prompt);

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No diagnosis available.";

    return res.json({ reply });
  } catch (error) {
    console.error("Profile AI Error:", error);
    return res.status(500).json({
      reply: "Internal server error",
    });
  }
};
