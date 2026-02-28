let theories = JSON.parse(localStorage.getItem("theories")) || [];

function saveTheories() {
    localStorage.setItem("theories", JSON.stringify(theories));
}

function renderTheories(containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;

    container.innerHTML = "";
    theories.forEach((theory, index) => {
        container.innerHTML += `
            <div class="card">
                <h3>${theory.title}</h3>
                <p>${theory.content.substring(0,120)}...</p>
                <small>By ${theory.author || "Anonymous"} | ${theory.category}</small>
                <br><br>
                <button onclick="vote(${index})">Support (${theory.votes})</button>
            </div>
        `;
    });
}

function vote(index){
    theories[index].votes++;
    saveTheories();
    renderTheories("theoryFeed");
    renderTheories("featuredContainer");
}

document.addEventListener("DOMContentLoaded", () => {
    renderTheories("theoryFeed");
    renderTheories("featuredContainer");
});

const form = document.getElementById("theoryForm");
if(form){
form.addEventListener("submit", e=>{
    e.preventDefault();
    const newTheory = {
        title: document.getElementById("title").value,
        category: document.getElementById("category").value,
        content: document.getElementById("content").value,
        author: document.getElementById("author").value,
        votes:0,
        date: new Date().toISOString()
    };
    theories.unshift(newTheory);
    saveTheories();
    window.location.href="explore.html";
});
}
