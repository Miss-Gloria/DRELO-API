import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const aIChat = async (req, res) => {
  const userInput = req.body.message;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent({
      contents: [{ parts: [{ text: userInput }] }],
    });

    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Error generating Gemini AI response:", error);
    res.status(500).json({ error: "Gemini AI response failed" });
  }
};
