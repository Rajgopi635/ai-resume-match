async function match() {

const file = document.getElementById("resume").files[0];
const jd = document.getElementById("jd").value;

if (!file || !jd) {
alert("Upload resume and paste JD");
return;
}

document.getElementById("matchBox").innerText = "Reading resume...";

const reader = new FileReader();

reader.onload = async function () {

try {

const typedarray = new Uint8Array(this.result);
const pdf = await pdfjsLib.getDocument(typedarray).promise;

let resumeText = "";

for (let i = 1; i <= pdf.numPages; i++) {
const page = await pdf.getPage(i);
const content = await page.getTextContent();
content.items.forEach(item => resumeText += item.str + " ");
}

document.getElementById("matchBox").innerText = "Matching with AI...";

const response = await fetch("/api", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
resume: resumeText,
jd: jd
})
});

// 🔴 HTTP failure
if (!response.ok) {
const err = await response.text();
document.getElementById("matchBox").innerText =
"API Error:\n" + err;
return;
}

const data = await response.json();

console.log("API Response:", data);

// 🔴 Empty response
if (!data.reply) {
document.getElementById("matchBox").innerText =
"Empty AI response:\n" + JSON.stringify(data);
return;
}

// ✅ SUCCESS
document.getElementById("matchBox").innerText = data.reply;

} catch (e) {

document.getElementById("matchBox").innerText =
"Frontend Error:\n" + e.message;

console.error(e);
}

};

reader.readAsArrayBuffer(file);

}
