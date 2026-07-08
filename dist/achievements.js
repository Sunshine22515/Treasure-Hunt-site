"use strict";
const raw = localStorage.getItem("player");
const player = raw
    ? JSON.parse(raw)
    : { name: "Guest", coins: 0, loggedIn: false, achievements: [] };
const lista = document.getElementById("achievements-list");
if (player.achievements.length === 0) {
    lista.innerHTML = "<li>Ainda não tens conquistas. Continua a explorar!</li>";
}
else {
    lista.innerHTML = player.achievements
        .map(a => `<li>${a}</li>`)
        .join("");
}
//# sourceMappingURL=achievements.js.map