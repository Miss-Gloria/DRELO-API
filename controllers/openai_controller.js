import OpenAI from 'openai';  // ✅ Correct case

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY, // Make sure this exists in your .env file
});

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

export const aiChat = async (req, res) => {
  const userInput = String(req.body.message);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput },
      ],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'AI response failed' });
  }
};

