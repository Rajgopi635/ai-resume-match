async function match() {

const file = document.getElementById("resume").files[0];
const jd = document.getElementById("jd").value;

if (!file || !jd) {
alert("Upload resume and paste JD");
return;
}

document.getElementById("matchBox").innerHTML = "Reading resume...";

const reader = new FileReader();

reader.onload = async function () {

const typedarray = new Uint8Array(this.result);
const pdf = await pdfjsLib.getDocument(typedarray).promise;

let resumeText = "";

for (let i = 1; i <= pdf.numPages; i++) {
const page = await pdf.getPage(i);
const content = await page.getTextContent();
content.items.forEach(item => resumeText += item.str + " ");
}

document.getElementById("matchBox").innerHTML = "Matching with AI...";

const response = await fetch("/api", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
resume: resumeText,
jd: jd
})
});

const data = await response.json();

const txt = data.reply || "";

// Extract values
const overall = txt.match(/OVERALL_MATCH:\s*(.*)/)?.[1] || "";
const skills = txt.match(/SKILL_MATCH:([\s\S]*?)MISSING_SKILLS:/)?.[1] || "";
const missing = txt.match(/MISSING_SKILLS:([\s\S]*?)CANDIDATE_SUMMARY:/)?.[1] || "";
const summary = txt.match(/CANDIDATE_SUMMARY:([\s\S]*?)CLIENT_EMAIL:/)?.[1] || "";
const email = txt.match(/CLIENT_EMAIL:([\s\S]*)/)?.[1] || "";

// UI render
document.getElementById("matchBox").innerHTML = `
<div class="card">
<h2>Overall Match ${overall}</h2>
</div>

<div class="card">
<h3>Skill Ratings</h3>
<pre>${skills}</pre>
</div>

<div class="card">
<h3 style="color:red">Missing Skills</h3>
<pre>${missing}</pre>
</div>

<div class="card">
<h3>Candidate Summary</h3>
<p>${summary}</p>
</div>

<div class="card">
<h3>Client Email</h3>
<pre>${email}</pre>
</div>
`;

};

reader.readAsArrayBuffer(file);

}
