export {};

interface Player {
    name: string;
    coins: number;
    loggedIn: boolean;
    achievements: string[];
}

const form = document.getElementById("signin-form") as HTMLFormElement;

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("username") as HTMLInputElement;
    const name = nameInput.value.trim();
    if (!name) return;

    // TODO: substituir por chamada real ao backend (POST /register)
    const player: Player = { name, coins: 0, loggedIn: true, achievements: [] };

    localStorage.setItem("player", JSON.stringify(player));
    window.location.href = "index.html";
});