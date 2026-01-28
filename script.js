async function match() {

const file = document.getElementById("resume").files[0];
const jd = document.getElementById("jd").value;

if (!file || !jd) {
alert("Upload resume and paste JD");
return;
}

document.getElementById("matchBox").innerHTML="Reading resume...";

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

document.getElementById("matchBox").innerHTML="Matching...";

const response = await fetch("/api", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
prompt: `Resume:\n${resumeText}\n\nJob Description:\n${jd}`
})
});

const data = await response.json();

const text = data.reply;

const match = text.match(/MATCH:\s*(.*)/)?.[1] || "";
const summary = text.match(/SUMMARY:\s*([\s\S]*?)KEY_SKILLS:/)?.[1] || "";
const skills = text.match(/KEY_SKILLS:\s*([\s\S]*?)MISSING_SKILLS:/)?.[1] || "";
const missing = text.match(/MISSING_SKILLS:\s*([\s\S]*)/)?.[1] || "";

document.getElementById("matchBox").innerHTML = `<h2>Match Score: ${match}</h2>`;
document.getElementById("summaryBox").innerHTML = `<p>${summary}</p>`;

document.getElementById("skillsBox").innerHTML =
"<h4>Key Skills</h4><ul>" +
skills.split("-").filter(x=>x.trim()).map(s=>`<li>${s}</li>`).join("") +
"</ul>";

document.getElementById("missingBox").innerHTML =
"<h4 style='color:red'>Missing Skills</h4><ul>" +
missing.split("-").filter(x=>x.trim()).map(s=>`<li>${s}</li>`).join("") +
"</ul>";

};

reader.readAsArrayBuffer(file);

}
