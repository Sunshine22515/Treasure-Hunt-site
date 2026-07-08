const form = document.getElementById("signin-form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("username");
    const name = nameInput.value.trim();
    if (!name)
        return;
    // TODO: substituir por chamada real ao backend (POST /register)
    const player = { name, coins: 0, loggedIn: true, achievements: [] };
    localStorage.setItem("player", JSON.stringify(player));
    window.location.href = "index.html";
});
export {};
//# sourceMappingURL=sign-in.js.map