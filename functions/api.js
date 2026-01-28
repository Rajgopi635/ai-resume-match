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
You are an ATS resume matcher.

Return STRICTLY in this format:

OVERALL_MATCH: XX%

SKILL_MATCH:
Frontend: X/10
Backend: X/10
Databases: X/10
Cloud: X/10
Security: X/10
Ownership: X/10

MISSING_SKILLS:
- skill1
- skill2
- skill3

CANDIDATE_SUMMARY:
4 lines professional summary.

CLIENT_EMAIL:
Short client submission email.

Resume:
${resume}

Job Description:
${jd}
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
