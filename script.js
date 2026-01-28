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
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
resume: resumeText,
jd: jd
})
});

const data = await response.json();

document.getElementById("matchBox").innerText =
data.choices[0].message.content;

};

reader.readAsArrayBuffer(file);

}
