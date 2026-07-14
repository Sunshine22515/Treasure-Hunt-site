"use strict";
const raw = localStorage.getItem("player");
const player = raw
    ? JSON.parse(raw)
    : { name: "Guest", coins: 0, loggedIn: false, achievements: [] };
const list = document.getElementById("achievements-list");
async function loadAchievements() {
    if (!player.id) {
        list.innerHTML = "<li>Log in to see your achievements.</li>";
        return;
    }
    try {
        const response = await fetch(`api/achievements.php?userId=${player.id}`);
        if (!response.ok)
            throw new Error(`Error ${response.status}`);
        const data = await response.json();
        if (data.achievements.length === 0) {
            list.innerHTML = "<li>You do not have any achievements yet. Keep exploring!</li>";
            return;
        }
        list.innerHTML = data.achievements
            .map((achievement) => `<li><strong>${achievement.title}</strong> - ${achievement.description}</li>`)
            .join("");
    }
    catch (err) {
        console.error("Error fetching achievements:", err);
        list.innerHTML = "<li>Could not load achievements.</li>";
    }
}
loadAchievements();
//# sourceMappingURL=achievements.js.map