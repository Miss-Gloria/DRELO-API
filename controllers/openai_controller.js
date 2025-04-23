import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const systemPrompt = `
You are a friendly and knowledgeable Ghana Travel Assistant.
Your role is to:
1. Recommend tourist attractions (popular and hidden) based on user interests.
2. Always recognize any of Ghana’s 16 regions (like Bono, Ahafo, Northern, etc.) and towns within them — and suggest 3 to 5 unique or hidden places to explore in each one mentioned.
3. Share cultural dos and don'ts relevant to specific regions or events.
4. Help users build a travel wish list.
5. Generate smart packing lists depending on trip type (e.g., hiking, beach, city and many more).
6. Answer travel questions related to Ghana (currency, weather, local foods, safety).

Examples of places users may mention: Bono Region, Techiman, Tamale, Cape Coast, Amedzofe, Aburi, Ada Foah, Akosombo, Nandom.

Always be conversational and helpful. Include local insights, Ghanaian slangs, and make it fun and Gen-Z friendly.
`;

export const aiChat = async (req, res) => {
  const userInput = req.body.message;

  console.log("User input to AI:", userInput);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: String(userInput) },
      ],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'AI response failed' });
  }
};
