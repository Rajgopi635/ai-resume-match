async function match() {

const file = document.getElementById("resume").files[0];
const jd = document.getElementById("jd").value;

if (!file || !jd) {
alert("Upload resume and paste JD");
return;
}

document.getElementById("result").innerText = "Reading resume...";

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

document.getElementById("result").innerText = "Matching...";

const response = await fetch("/api", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
prompt: `Resume:\n${resumeText}\n\nJob Description:\n${jd}\n\nGive match percentage and skills.`
})
});

const data = await response.json();

document.getElementById("result").innerText = data.reply;

};

reader.readAsArrayBuffer(file);

}
