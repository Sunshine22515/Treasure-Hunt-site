export {};

interface Player {
    name: string;
    coins: number;
    loggedIn: boolean;
    achievements: string[];
}

const form = document.getElementById("login-form") as HTMLFormElement;

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("username") as HTMLInputElement;
    const name = nameInput.value.trim();
    if (!name) return;

    // TODO: substituir por chamada real ao backend (POST /login)
    const existing = localStorage.getItem("player");
    const player: Player = existing
        ? JSON.parse(existing)
        : { name: "", coins: 0, loggedIn: false, achievements: [] };

    player.name = name;
    player.loggedIn = true;

    localStorage.setItem("player", JSON.stringify(player));
    window.location.href = "index.html";
});