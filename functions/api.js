export async function onRequestPost({ request, env }) {

try {

const body = await request.json();
const resume = body.resume;
const jd = body.jd;

if (!resume || !jd) {
return new Response(JSON.stringify({ reply: "Missing resume or JD" }), {
headers: { "Content-Type": "application/json" }
});
}

const prompt = `
You are an expert technical recruiter.

Compare the following resume with the job description.

Return ONLY plain text with these sections:

SKILL WISE MATCH:
Frontend:
Backend:
Databases:
Cloud:
Security:
Ownership:

OVERALL MATCH:

MINOR GAPS:

CANDIDATE LEAD SUMMARY (4–5 lines):

CLIENT SUBMISSION EMAIL:

No markdown.
No JSON.
No bullets.
Professional recruiter tone.

Job Description:
${jd}

Resume:
${resume}
`;

const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
method: "POST",
headers: {
"Authorization": `Bearer ${env.GROQ_API_KEY}`,
"Content-Type": "application/json"
},
body: JSON.stringify({
model: "llama-3.1-8b-instant",
messages: [{ role: "user", content: prompt }],
temperature: 0.2
})
});

const groqData = await groqRes.json();

const reply =
groqData.choices?.[0]?.message?.content || "No AI output";

return new Response(JSON.stringify({ reply }), {
headers: { "Content-Type": "application/json" }
});

} catch (e) {

return new Response(JSON.stringify({
reply: "Worker error: " + e.message
}), {
headers: { "Content-Type": "application/json" }
});

}

}
