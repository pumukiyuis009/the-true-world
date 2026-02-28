// STORAGE
let theories=JSON.parse(localStorage.getItem("theories"))||[];
let users=JSON.parse(localStorage.getItem("users"))||{};
let current=localStorage.getItem("currentUser");

function save(){
localStorage.setItem("users",JSON.stringify(users));
localStorage.setItem("theories",JSON.stringify(theories));
}

// LOGIN / REGISTER
function login(){
const username=document.getElementById("username").value.trim();
if(!username){
alert("Enter a username");
return;
}

if(!users[username]){
users[username]={
followers:0,
following:0,
likes:0,
avatar:""
};
}

localStorage.setItem("currentUser",username);
save();
window.location.href="profile.html";
}

// HEADER PROFILE REPLACEMENT
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
avatar.style.border="2px solid #00d4ff";
avatar.onclick=()=>window.location="profile.html";

nav.appendChild(avatar);
}
}
});

// PROFILE PAGE LOAD
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

const avatarImg=document.getElementById("avatarPreview");
avatarImg.src=users[current].avatar || "https://via.placeholder.com/200";

const avatarContainer=document.querySelector(".avatar-container");
const avatarInput=document.getElementById("avatarInput");

avatarContainer.addEventListener("click",()=>{
avatarInput.click();
});

avatarInput.addEventListener("change",(e)=>{
const file=e.target.files[0];
if(!file) return;
if(file.size>2*1024*1024){
alert("Image must be under 2MB");
return;
}

const reader=new FileReader();
reader.onload=(event)=>{
users[current].avatar=event.target.result;
avatarImg.src=event.target.result;
save();
};
reader.readAsDataURL(file);
});
}
