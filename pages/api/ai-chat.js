import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo', // hoặc 'mistralai/mistral-7b'
      messages,
    });

    const reply = chatResponse.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error('OpenAI API error:', err);
    res.status(500).json({ error: 'Lỗi kết nối đến AI. Vui lòng kiểm tra API hoặc quota.' });
  }
}
