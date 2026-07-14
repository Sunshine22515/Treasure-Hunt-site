/// <reference types="leaflet" />

export {};

interface Quest {
    id: string;
    title: string;
    description: string;
    lat: number;
    lng: number;
    radius: number;
    points: number;
}

interface Player {
    name: string;
    coins: number;
    loggedIn: boolean;
    achievements: string[];
    currentQuestIndex: number;
    completedQuests: string[];
}

const quests: Quest[] = [
    {
        id: "q1",
        title: "O Rio Antigo",
        description: "Onde o rio abraça a cidade mais velha... procura o ponto de encontro junto à água.",
        lat: 46.5503,
        lng: 15.6410,
        radius: 30,
        points: 50
    },
    {
        id: "q2",
        title: "Praça Principal",
        description: "No coração de Maribor, onde tudo se encontra.",
        lat: 46.5583,
        lng: 15.6467,
        radius: 30,
        points: 75
    },
    {
        id: "q3",
        title: "O Castelo",
        description: "Paredes antigas guardam segredos de reis passados.",
        lat: 46.5563,
        lng: 15.6459,
        radius: 30,
        points: 100
    }
];

function getPlayer(): Player {
    const raw = localStorage.getItem("player");
    if (raw) return JSON.parse(raw);

    const fresh: Player = {
        name: "Guest",
        coins: 0,
        loggedIn: false,
        achievements: [],
        currentQuestIndex: 0,
        completedQuests: []
    };
    localStorage.setItem("player", JSON.stringify(fresh));
    return fresh;
}

function savePlayer(player: Player): void {
    localStorage.setItem("player", JSON.stringify(player));
}

(window as any).gameData = { quests, getPlayer, savePlayer };