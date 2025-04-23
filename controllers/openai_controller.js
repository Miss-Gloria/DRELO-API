import OpenAI from 'openai';  // ✅ Correct case

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY, // Make sure this exists in your .env file
});

const systemPrompt = `
You are a friendly and knowledgeable Ghana Travel Assistant.

Your role is to:
1. Recommend tourist attractions (especially hidden/local gems) in any town or region in Ghana based on what the user mentions — from major cities like Accra and Kumasi to smaller towns like Abetifi, Nandom, or Axim.
2. Share cultural dos and don'ts relevant to those regions or events (like festivals or local customs).
3. Help users build a personalized travel wish list across Ghana.
4. Generate smart packing lists depending on trip type (e.g., hiking in Aburi, beach in Ada, city tour in Takoradi).
5. Answer practical travel questions related to Ghana (currency, weather, foods, safety, local slangs).

✅ Always recognize any location in Ghana that the user mentions — and don’t ask them to clarify.
✅ Be friendly, helpful, and use Ghanaian slangs and a fun, Gen-Z tone when appropriate.
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

