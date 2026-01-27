export async function onRequest(context) {

try {

if (context.request.method !== "POST") {
  return new Response("Method not allowed", { status: 405 });
}

const body = await context.request.json();
const prompt = body.prompt;

const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions",{
method:"POST",
headers:{
"Authorization":`Bearer ${context.env.GROQ_KEY}`,
"Content-Type":"application/json"
},
body:JSON.stringify({
model:"llama3-70b-8192",
messages:[
{role:"user",content:prompt}
]
})
});

const groqData = await groqRes.text();

return new Response(
JSON.stringify({ reply: groqData }),
{ headers: { "Content-Type": "application/json" } }
);

} catch(err){

return new Response(
JSON.stringify({ error: err.toString() }),
{ headers: { "Content-Type": "application/json" }, status:500 }
);

}

}
