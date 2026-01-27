async function match(){

const jd = document.getElementById("jd").value;

if(!jd){
alert("Please paste Job Description");
return;
}

document.getElementById("result").innerHTML="Matching...";

const response = await fetch("/api",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
prompt:`Compare this job description and resume. Give match percentage and skills:\n${jd}`
})
});

const data = await response.json();

document.getElementById("result").innerText = data.reply;

}
