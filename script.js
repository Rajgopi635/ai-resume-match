async function match(){

const jd=document.getElementById("jd").value;

const prompt=`Compare resume and job description. Give match percentage and skills.\n${jd}`;

const response=await fetch("/api",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({prompt})
});

const data=await response.json();

document.getElementById("result").innerText=data.reply;

}
