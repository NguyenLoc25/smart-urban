export const dynamic = "force-dynamic";

export async function POST(req) {
  const { message } = await req.json();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Bạn là trợ lý khu vườn thông minh, nói tiếng Việt ngắn gọn và thân thiện." },
        { role: "user", content: message },
      ],
    }),
  });

  const data = await response.json();

  return new Response(JSON.stringify({ reply: data.choices[0].message.content }), {
    headers: { "Content-Type": "application/json" },
  });
}
