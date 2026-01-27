export async function onRequest(context) {

if (context.request.method !== "POST") {
  return new Response("Method not allowed", { status: 405 });
}

const body = await context.request.json();
const prompt = body.prompt;

const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
method: "POST",
headers: {
"Authorization": `Bearer ${context.env.GROQ_KEY}`,
"Content-Type": "application/json"
},
body: JSON.stringify({
model: "llama-3.1-8b-instant",
messages: [
{ role: "user", content: prompt }
]
})
});

const data = await groqRes.json();

return new Response(
JSON.stringify({
reply: data.choices[0].message.content
}),
{ headers: { "Content-Type": "application/json" } }
);

}
