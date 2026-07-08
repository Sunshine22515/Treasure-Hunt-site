const form = document.getElementById("login-form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("username");
    const name = nameInput.value.trim();
    if (!name)
        return;
    // TODO: substituir por chamada real ao backend (POST /login)
    const existing = localStorage.getItem("player");
    const player = existing
        ? JSON.parse(existing)
        : { name: "", coins: 0, loggedIn: false, achievements: [] };
    player.name = name;
    player.loggedIn = true;
    localStorage.setItem("player", JSON.stringify(player));
    window.location.href = "index.html";
});
export {};
//# sourceMappingURL=login.js.map