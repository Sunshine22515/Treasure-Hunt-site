interface Player {
    name: string;
    coins: number;
    loggedIn: boolean;
    achievements: string[];
}

const raw = localStorage.getItem("player");
const player: Player = raw
    ? JSON.parse(raw)
    : { name: "Guest", coins: 0, loggedIn: false, achievements: [] };

const lista = document.getElementById("achievements-list") as HTMLUListElement;

if (player.achievements.length === 0) {
    lista.innerHTML = "<li>Ainda não tens conquistas. Continua a explorar!</li>";
} else {
    lista.innerHTML = player.achievements
        .map(a => `<li>${a}</li>`)
        .join("");
}