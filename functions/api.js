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
You are a recruitment resume matching assistant.

FIRST extract:

Candidate Name from resume
Total Experience (approx if not exact)
Job Title from JD

Then return STRICTLY in this exact format:

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
<Name> – <Job Title> (<Experience>)

Write 3 short professional lines explaining candidate strengths aligned to JD. Keep concise recruiter tone.

CLIENT_EMAIL:
Hi Hiring Manager,

Please find below the profile of <Name> for the <Job Title> role.

<Name> brings strong hands-on experience across frontend, backend, cloud, and secure application development, with proven delivery of scalable enterprise platforms aligned to your requirements.

Overall match: XX%.

Please let me know if you’d like to proceed with interview scheduling or need any additional details.

Thanks,
Raaj

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
