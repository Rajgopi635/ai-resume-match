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
{
role: "user",
content: `
You are an expert technical recruiter.

I will provide:

1. Job Description
2. Candidate Resume

Your task:

Return ONLY the following sections in clean readable plain text (no JSON, no markdown symbols):

---------------------

SKILL WISE MATCH:

Frontend (React / Angular / TypeScript / UI): XX%
Backend & APIs (Python / FastAPI / REST / Microservices): XX%
Databases (RDBMS + NoSQL): XX%
Cloud & DevOps (AWS / CI/CD): XX%
Security / Compliance: XX%
Collaboration / Ownership: XX%
Healthcare / Regulated Domain: XX%

OVERALL MATCH: XX%

MINOR GAPS:
- gap 1
- gap 2
- gap 3

CANDIDATE SUMMARY (4–5 lines):

Write professional recruiter-style summary.

CLIENT SUBMISSION EMAIL:

Subject: Submission – Senior Full Stack Engineer | Candidate Name

Hi Adam,

(short professional email)

Thanks,
Raaj

---------------------

Rules:

• Use realistic percentages  
• Be concise  
• No emojis  
• No markdown  
• No bullet icons  
• Only clean recruiter formatting  
• Do NOT explain yourself  
• Do NOT add extra sections  

Job Description:
${jd}

Resume:
${resumeText}
`
}
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
