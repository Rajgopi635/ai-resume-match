export async function onRequestPost(context){

const body = await context.request.json();
const prompt = body.prompt;

const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{
method:"POST",
headers:{
"Authorization":`Bearer ${context.env.GROQ_KEY}`,
"Content-Type":"application/json"
},
body:JSON.stringify({
model:"llama3-8b-8192",
messages:[{role:"user",content:prompt}]
})
});

const data = await res.json();

return new Response(JSON.stringify({
reply:data.choices[0].message.content
}),{
headers:{"Content-Type":"application/json"}
});

}
