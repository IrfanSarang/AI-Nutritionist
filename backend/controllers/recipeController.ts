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

export const generateRecipe = async (req: Request, res: Response) => {
  const { ingredients, dietType, allergies } = req.body;

  if (!ingredients) {
    return res.status(400).json({ reply: "Ingredients are required" });
  }

  const sanitizedIngredients = ingredients.replace(/<[^>]*>/g, "").substring(0, 500);
  const sanitizedDietType = (dietType || "").replace(/<[^>]*>/g, "").substring(0, 100);
  const sanitizedAllergies = (allergies || "").replace(/<[^>]*>/g, "").substring(0, 200);

  const prompt = `You are a professional chef and nutritionist. Generate exactly 2 detailed recipes using these available ingredients: ${sanitizedIngredients}.
${sanitizedDietType ? `Diet type: ${sanitizedDietType}.` : ""}
${sanitizedAllergies ? `Strictly avoid these allergens: ${sanitizedAllergies}.` : ""}

For each recipe provide:
- Recipe name
- Ingredients with quantities
- Step-by-step instructions
- Approximate calories and macros
- Prep + cook time

Keep it practical, healthy, and use Indian cooking styles where appropriate. Format clearly with numbered recipes.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY_1}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", response.status);
      return res.status(502).json({ reply: "AI service temporarily unavailable." });
    }

    const data: GeminiResponse = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, could not generate recipes. Please try again.";

    return res.json({ reply });
  } catch (error) {
    console.error("Recipe generation error:", error);
    return res.status(500).json({ reply: "Internal server error" });
  }
};