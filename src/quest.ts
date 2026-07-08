async function loadQuests(): Promise<void> {
    const container = document.getElementById("quest-list") as HTMLDivElement;

    try {
        // TODO: trocar pela URL real do teu backend
        const response = await fetch("/api/quests");

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        const quests: { title: string; description: string }[] = await response.json();

        container.innerHTML = quests
            .map(q => `<div class="quest-item"><h3>${q.title}</h3><p>${q.description}</p></div>`)
            .join("");
    } catch (err) {
        console.error("Erro ao buscar quests:", err);
        container.innerHTML = "<p>Não foi possível carregar as quests.</p>";
    }
}

loadQuests();