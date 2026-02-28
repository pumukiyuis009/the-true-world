// PARTICLES
const canvas=document.getElementById("particles");
if(canvas){
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let particles=[];
class Particle{
constructor(){
this.x=Math.random()*canvas.width;
this.y=Math.random()*canvas.height;
this.size=Math.random()*2;
this.speedX=(Math.random()-0.5)*0.3;
this.speedY=(Math.random()-0.5)*0.3;
}
update(){
this.x+=this.speedX;
this.y+=this.speedY;
}
draw(){
ctx.fillStyle="#00d4ff";
ctx.beginPath();
ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
ctx.fill();
}}
function init(){for(let i=0;i<120;i++)particles.push(new Particle());}
function animate(){
ctx.clearRect(0,0,canvas.width,canvas.height);
particles.forEach(p=>{p.update();p.draw();});
requestAnimationFrame(animate);}
init();animate();}

// STORAGE
let theories=JSON.parse(localStorage.getItem("theories"))||[];
let users=JSON.parse(localStorage.getItem("users"))||{};
function save(){localStorage.setItem("theories",JSON.stringify(theories));
localStorage.setItem("users",JSON.stringify(users));}

// LOGIN
function login(){
const user=document.getElementById("username").value;
if(!users[user]) users[user]={followers:0,following:0,likes:0};
localStorage.setItem("currentUser",user);
save();
window.location="profile.html";
}

// PUBLISH
const form=document.getElementById("theoryForm");
if(form){
form.addEventListener("submit",e=>{
e.preventDefault();
const newTheory={
id:Date.now(),
title:title.value,
category:category.value,
content:content.value,
author:author.value||"Anonymous",
votes:0,
comments:[],
date:new Date().toISOString()
};
theories.unshift(newTheory);
save();
window.location="explore.html";
});
}

// TRENDING
function score(t){
const age=(Date.now()-new Date(t.date))/(1000*60*60);
return t.votes*2+t.comments.length*3+Math.max(0,48-age);
}

// RENDER
function render(id){
const container=document.getElementById(id);
if(!container)return;
container.innerHTML="";
theories.sort((a,b)=>score(b)-score(a));
theories.forEach((t,i)=>{
container.innerHTML+=`
<div class="card">
<h3>${t.title}</h3>
<p>${t.content.substring(0,120)}...</p>
<small>By ${t.author}</small><br>
<button onclick="vote(${i})">Support (${t.votes})</button>
<div>
${t.comments.map(c=>`<p><b>${c.user}:</b> ${c.text}</p>`).join("")}
<input placeholder="Add comment..."
onkeydown="if(event.key==='Enter')comment(${i},this.value)">
</div>
</div>`;
});
}
function vote(i){
theories[i].votes++;
if(users[theories[i].author]) users[theories[i].author].likes++;
save();render("theoryFeed");render("featuredContainer");
}
function comment(i,text){
if(!text)return;
const user=localStorage.getItem("currentUser")||"Anonymous";
theories[i].comments.push({user,text});
save();render("theoryFeed");render("featuredContainer");
}

render("theoryFeed");
render("featuredContainer");

// PROFILE
const current=localStorage.getItem("currentUser");
if(current&&document.getElementById("profileName")){
document.getElementById("profileName").innerText=current;
document.getElementById("followers").innerText=users[current]?.followers||0;
document.getElementById("following").innerText=users[current]?.following||0;
document.getElementById("likes").innerText=users[current]?.likes||0;
document.getElementById("theoryCount").innerText=
theories.filter(t=>t.author===current).length;
}

// DAILY AI THEORY
function generateDaily(){
const subjects=["dreams","black holes","parallel universes","ancient civilizations","consciousness","time loops"];
const twists=["are simulations","are memories from the future","are experiments by higher beings","are glitches in reality","are echoes of another dimension"];
const s=subjects[Math.floor(Math.random()*subjects.length)];
const t=twists[Math.floor(Math.random()*twists.length)];
return `What if ${s} ${t}? Evidence suggests hidden anomalies and unexplained patterns across human history.`;
}
if(document.getElementById("dailyAI")){
const today=new Date().toDateString();
let saved=JSON.parse(localStorage.getItem("dailyTheory"));
if(!saved||saved.date!==today){
saved={date:today,text:generateDaily()};
localStorage.setItem("dailyTheory",JSON.stringify(saved));
}
document.getElementById("dailyAI").innerText=saved.text;
}
