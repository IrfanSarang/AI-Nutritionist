import { Response, Request } from "express";

export const getProductAIInsight = async (req: Request, res: Response) => {
  const { ingredients } = req.body;

  if (!ingredients) {
    return res.status(400).json({ reply: "Ingredients are required" });
  }

  const prompt = `You are a friendly nutrition expert 🤗. Analyze the following ingredients of a packaged food product and provide health guidance in simple, clear bullet points.

Rules:
1️⃣ Ingredients are listed from highest to lowest quantity. Focus mainly on the first ingredient.
2️⃣ Clearly state if the product is recommended, not recommended, or can be consumed occasionally.
3️⃣ Explain if artificial additives or preservatives are present and their health impact.
4️⃣ Mention who should strictly avoid this product, only if directly relevant.
5️⃣ Give short, actionable consumption tips.
6️⃣ Simple language.
7️⃣ Each point on a new line with an emoji.
8️⃣ No markdown symbols.
9️⃣ 5–8 bullet points max.
🔟 End with ONE verdict only:
   ✅ Good For Health
   ⚠️ Better Avoid This Product
   ❌ Harmful For Health

Ingredients:
${ingredients}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY_2}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No AI insights available.";

    res.json({ reply });
  } catch (error) {
    console.error("Gemini Product AI Error:", error);
    res.status(500).json({ reply: "Internal server error" });
  }
};

//AI Profile Diagnosis
export const getProfileAIDiagnosis = async (req: Request, res: Response) => {
  const { profile } = req.body;

  if (!profile) {
    return res.status(400).json({ reply: "Profile data is required" });
  }

  const prompt = `You are a friendly health assistant 🤗. Based on the following profile details, provide short, clear, and actionable health advice in bullet points.

Rules:
1️⃣ Calculate BMI and tell if the user is overweight, underweight, or normal. Tell healthy weight range.
2️⃣ Give 1-line food advice based on diet type (veg / non-veg).
3️⃣ If allergies exist, explain triggers, foods to avoid, and safer options.
4️⃣ Based on activity level, suggest whether to increase or maintain it.
5️⃣ Based on health goal, explain how to achieve it simply.
6️⃣ Use emojis in every point.
7️⃣ Each point on a new line.
8️⃣ No markdown symbols or long paragraphs.

Profile Data:
- Name: ${profile.name}
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Diet Type: ${profile.dietType}
- Allergies: ${profile.allergies}
- Health Goal: ${profile.healthGoal}
- Activity Level: ${profile.activityLevel}

✨ How this AI-powered Nutritionist App Can Help You ✨
- Use the food scanner to instantly check food suitability.
- Get personalized meal plans from AI nutritionist.
- Track food choices and goals daily.
- Get allergy alerts and motivation.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY_2}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No diagnosis available.";

    res.json({ reply });
  } catch (error) {
    console.error("Profile AI Error:", error);
    res.status(500).json({ reply: "Internal server error" });
  }
};
