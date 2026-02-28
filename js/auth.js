function login(){
    const user = document.getElementById("username").value;
    localStorage.setItem("currentUser", user);
    window.location.href="index.html";
}
