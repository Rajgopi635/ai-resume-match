async function match(){

console.log("clicked");

const jd=document.getElementById("jd").value;

if(!jd){
alert("Paste Job Description");
return;
}

document.getElementById("result").innerHTML="Matching...";

const response = await fetch("/api",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
prompt:jd
})
});

const data = await response.json();

document.getElementById("result").innerText=data.reply;

}
