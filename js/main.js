// PARTICLES
const canvas=document.getElementById("particles");
if(canvas){
const ctx=canvas.getContext("2d");
function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}
resize();
window.addEventListener("resize",resize);

let particles=[];
class Particle{
constructor(){
this.x=Math.random()*canvas.width;
this.y=Math.random()*canvas.height;
this.size=Math.random()*2;
this.speedX=(Math.random()-0.5)*0.3;
this.speedY=(Math.random()-0.5)*0.3;
}
update(){this.x+=this.speedX;this.y+=this.speedY;}
draw(){
ctx.fillStyle="#00d4ff";
ctx.beginPath();
ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
ctx.fill();
}}
for(let i=0;i<120;i++)particles.push(new Particle());
function animate(){
ctx.clearRect(0,0,canvas.width,canvas.height);
particles.forEach(p=>{p.update();p.draw();});
requestAnimationFrame(animate);
}
animate();
}

// STORAGE
let theories=JSON.parse(localStorage.getItem("theories"))||[];
let users=JSON.parse(localStorage.getItem("users"))||{};
let current=localStorage.getItem("currentUser");

// SAVE
function save(){
localStorage.setItem("theories",JSON.stringify(theories));
localStorage.setItem("users",JSON.stringify(users));
}

// LOGIN
function login(){
const username=document.getElementById("username").value.trim();
if(!username) return alert("Enter username");

if(!users[username]){
users[username]={followers:0,following:0,likes:0,avatar:""};
}
localStorage.setItem("currentUser",username);
save();
window.location="profile.html";
}

// HEADER AVATAR REPLACEMENT
document.addEventListener("DOMContentLoaded",()=>{
current=localStorage.getItem("currentUser");
const nav=document.querySelector(".navbar nav");
if(current && nav){
const loginBtn=nav.querySelector(".void-btn");
if(loginBtn){
loginBtn.remove();
const avatar=document.createElement("img");
avatar.src=users[current]?.avatar || "https://via.placeholder.com/40";
avatar.style.width="40px";
avatar.style.height="40px";
avatar.style.borderRadius="50%";
avatar.style.cursor="pointer";
avatar.onclick=()=>window.location="profile.html";
nav.appendChild(avatar);
}
}
});

// AVATAR UPLOAD
const avatarInput=document.getElementById("avatarInput");
if(avatarInput){
avatarInput.addEventListener("change",function(){
const file=this.files[0];
if(!file) return;
if(file.size>2*1024*1024) return alert("Max 2MB");

const reader=new FileReader();
reader.onload=e=>{
users[current].avatar=e.target.result;
save();
document.getElementById("avatarPreview").src=e.target.result;
};
reader.readAsDataURL(file);
});
}

// PROFILE LOAD
if(current && document.getElementById("profileName")){
if(!users[current]){
users[current]={followers:0,following:0,likes:0,avatar:""};
save();
}
document.getElementById("profileName").innerText=current;
document.getElementById("followers").innerText=users[current].followers;
document.getElementById("following").innerText=users[current].following;
document.getElementById("likes").innerText=users[current].likes;

const userTheories=theories.filter(t=>t.author===current);
document.getElementById("theoryCount").innerText=userTheories.length;

if(users[current].avatar){
document.getElementById("avatarPreview").src=users[current].avatar;
}else{
document.getElementById("avatarPreview").src="https://via.placeholder.com/140";
}

const container=document.getElementById("userTheories");
if(container){
container.innerHTML="";
userTheories.forEach(t=>{
container.innerHTML+=`
<div class="card">
<h3>${t.title}</h3>
<p>${t.content.substring(0,120)}...</p>
</div>`;
});
}
}
