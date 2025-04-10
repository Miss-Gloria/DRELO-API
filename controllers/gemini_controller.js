import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const systemPrompt = `
You are a friendly and knowledgeable Ghana Travel Assistant.
Your role is to:
1. Recommend tourist attractions (popular and hidden) based on user interests.
2. Share cultural dos and don'ts relevant to specific regions or events.
3. Help users build a travel wish list.
4. Generate smart packing lists depending on trip type (e.g., hiking, beach, city and many more).
5. Answer travel questions related to Ghana (currency, weather, local foods, safety).

Always be conversational and helpful. Include local insights, Ghanaian slangs, and make it fun and Gen-Z friendly.
`;

export const aIChat = async (req, res) => {
  const userInput = req.body.message;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: userInput }],
        },
        {
          role: "model",
          parts: [{ text: systemPrompt }],
        },
      ],
    });

    const result = await chat.sendMessage(userInput); // or { text: userInput }
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ error: "AI response failed" });
  }
};
