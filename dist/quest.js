async function loadQuests() {
    const container = document.getElementById("quest-list");
    try {
        const response = await fetch("api/quests.php");
        if (!response.ok)
            throw new Error(`Error ${response.status}`);
        const data = await response.json();
        if (data.quests.length === 0) {
            container.innerHTML = "<p>No quests are available yet.</p>";
            return;
        }
        container.innerHTML = data.quests
            .map((quest) => `
                <div class="quest-item">
                    <h3>${quest.title}</h3>
                    <p>${quest.description}</p>
                    <strong>${quest.rewardCoins} coins</strong>
                </div>
            `)
            .join("");
    }
    catch (err) {
        console.error("Error fetching quests:", err);
        container.innerHTML = "<p>Could not load quests.</p>";
    }
}
loadQuests();
function renderQuestList() {
    const container = document.getElementById("quest-list");
    const player = gameData.getPlayer();
    container.innerHTML = gameData.quests
        .map((quest, index) => {
        const isCompleted = player.completedQuests.includes(quest.id);
        const isCurrent = index === player.currentQuestIndex;
        const isLocked = index > player.currentQuestIndex;
        let statusClass = "quest-locked";
        let statusLabel = "🔒 Bloqueada";
        if (isCompleted) {
            statusClass = "quest-completed";
            statusLabel = "✅ Completa";
        }
        else if (isCurrent) {
            statusClass = "quest-active";
            statusLabel = "📍 Ativa — vai até lá!";
        }
        return `
                <div class="quest-item ${statusClass}">
                    <h3>${quest.title}</h3>
                    ${!isLocked ? `<p>${quest.description}</p>` : `<p>???</p>`}
                    <span class="quest-status">${statusLabel}</span>
                    ${!isLocked ? `<span class="quest-points">+${quest.points} pts</span>` : ""}
                </div>
            `;
    })
        .join("");
}
renderQuestList();
export {};
//# sourceMappingURL=quest.js.map