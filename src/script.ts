/// <reference types="leaflet" />

// ==================== MAP ====================

const maribor = L.latLng(46.5547, 15.6459);

const bounds = L.latLngBounds(
    L.latLng(46.54641, 15.61363),
    L.latLng(46.56535, 15.66341)
);

const map = L.map("map", {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
}).setView(maribor, 14);

const minZoom = map.getBoundsZoom(bounds);
map.setMinZoom(minZoom);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "(c) OpenStreetMap"
}).addTo(map);

// ==================== WAYPOINTS ====================

interface Waypoint {
    id: string;
    name: string;
    lat: number;
    lng: number;
    clue: string;
}

const WAYPOINT_RADIUS_METERS = 5000;
const waypoints: Waypoint[] = [
    {
        id: "wp1",
        name: "Lent",
        lat: 46.557584,
        lng: 15.645282,
        clue: "Where the river embraces the oldest part of the city..."
    },
    {
        id: "wp2",
        name: "Main Square",
        lat: 46.5583,
        lng: 15.6467,
        clue: "In the heart of Maribor, where everything meets."
    },
    {
        id: "wp3",
        name: "Maribor Castle",
        lat: 46.5563,
        lng: 15.6459,
        clue: "Ancient walls keep the secrets of kings long gone."
    }
    // Add more points here as needed.
];

// Custom icons using the site palette.
const waypointIcon = L.divIcon({
    className: "map-pin waypoint-pin",
    html: '<span></span>',
    iconSize: [34, 42],
    iconAnchor: [17, 40],
    popupAnchor: [0, -38]
});

const userLocationIcon = L.divIcon({
    className: "map-pin user-pin",
    html: '<span></span>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
});

waypoints.forEach((wp) => {
    L.marker([wp.lat, wp.lng], { icon: waypointIcon })
        .addTo(map)
        .bindPopup(`<b>${wp.name}</b><br>${wp.clue}`);

    L.circle([wp.lat, wp.lng], {
        radius: WAYPOINT_RADIUS_METERS,
        color: "#0BAB9E",
        fillColor: "#9DD8D5",
        fillOpacity: 0.28,
        weight: 2
    }).addTo(map);
});

// ==================== GPS ====================

let userMarker: L.Marker | null = null;
let userCircle: L.Circle | null = null;
const reachedWaypointIds = new Set<string>();

function sendWaypointSignal(wp: Waypoint) {
    window.dispatchEvent(new CustomEvent("waypoint-entered", {
        detail: {
            waypoint: wp
        }
    }));

    console.log(`Waypoint reached: ${wp.name}`);
}

function checkWaypointProximity(playerPosition: L.LatLng) {
    waypoints.forEach((wp) => {
        if (reachedWaypointIds.has(wp.id)) {
            return;
        }

        const waypointPosition = L.latLng(wp.lat, wp.lng);
        const distance = playerPosition.distanceTo(waypointPosition);

        if (distance <= WAYPOINT_RADIUS_METERS) {
            reachedWaypointIds.add(wp.id);
            sendWaypointSignal(wp);
        }
    });
}

map.locate({ watch: true, setView: false, enableHighAccuracy: true });

map.on("locationfound", (e: L.LocationEvent) => {
    if (userMarker) {
        userMarker.setLatLng(e.latlng);
        userCircle?.setLatLng(e.latlng).setRadius(e.accuracy);
    } else {
        userMarker = L.marker(e.latlng, { icon: userLocationIcon }).addTo(map).bindPopup("You're here!");
        userCircle = L.circle(e.latlng, {
            radius: e.accuracy,
            color: "#0BAB9E",
            fillColor: "#E6F4F4",
            fillOpacity: 0.24,
            weight: 2
        }).addTo(map);
    }

    checkWaypointProximity(e.latlng);
});

map.on("locationerror", (e: L.ErrorEvent) => {
    console.error("Location Error:", e.message);
});

// ==================== NAVIGATION ====================

const loginButton = document.querySelector<HTMLButtonElement>(".login");
const signInButton = document.querySelector<HTMLButtonElement>(".sign-in");
const logoutButton = document.querySelector<HTMLButtonElement>(".logout");

function syncAuthButtons(): void {
    const isLoggedIn = localStorage.getItem("player") !== null;

    loginButton?.classList.toggle("is-hidden", isLoggedIn);
    signInButton?.classList.toggle("is-hidden", isLoggedIn);
    logoutButton?.classList.toggle("is-hidden", !isLoggedIn);
}

loginButton
    ?.addEventListener("click", () => window.location.href = "login.html");

signInButton
    ?.addEventListener("click", () => window.location.href = "sign-in.html");

logoutButton
    ?.addEventListener("click", () => {
        localStorage.removeItem("player");
        localStorage.removeItem("coins");
        sessionStorage.clear();
        syncAuthButtons();
        window.location.href = "index.html";
    });

syncAuthButtons();

document.querySelector<HTMLButtonElement>(".quest")
    ?.addEventListener("click", () => window.location.href = "quest.html");

document.querySelector<HTMLButtonElement>(".achievements")
    ?.addEventListener("click", () => window.location.href = "achievements.html");

document.querySelector<HTMLButtonElement>(".extra-points")
    ?.addEventListener("click", () => window.location.href = "extra-points.html");

// ==================== UPDATE COINS DISPLAY ====================

const coinsDisplay = document.getElementById("coins-display");
if (coinsDisplay) {
    const savedCoins = localStorage.getItem("coins") ?? "0";
    coinsDisplay.textContent = `Coins: ${savedCoins}`;
}

// ==================== LEADERBOARD ====================

interface LeaderboardPlayer {
    name: string;
    coins: number;
}

async function loadLeaderboard(): Promise<void> {
    const leaderboardBody = document.getElementById("leaderboard-body") as HTMLTableSectionElement | null;
    if (!leaderboardBody) return;

    try {
        const response = await fetch("api/leaderboard.php");
        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data: { players: LeaderboardPlayer[] } = await response.json();

        if (data.players.length === 0) {
            leaderboardBody.innerHTML = '<tr><td colspan="3">No players yet.</td></tr>';
            return;
        }

        leaderboardBody.innerHTML = data.players
            .map((player, index) => `
                <tr class="${index === 0 ? "top1" : ""}">
                    <td>${index + 1}</td>
                    <td>${player.name}</td>
                    <td>${player.coins}</td>
                </tr>
            `)
            .join("");
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
        leaderboardBody.innerHTML = '<tr><td colspan="3">Could not load leaderboard.</td></tr>';
    }
}

loadLeaderboard();

// ==================== SISTEMA DE QUESTS (detecção de proximidade) ====================

declare const gameData: {
    quests: {
        id: string;
        title: string;
        description: string;
        lat: number;
        lng: number;
        radius: number;
        points: number;
    }[];
    getPlayer: () => any;
    savePlayer: (p: any) => void;
};

let questMarker: L.Marker | null = null;
let questCircle: L.Circle | null = null;
let questFoundPopupOpen = false;

function renderCurrentQuestMarker(): void {
    const player = gameData.getPlayer();
    const quest = gameData.quests[player.currentQuestIndex];

    if (questMarker) map.removeLayer(questMarker);
    if (questCircle) map.removeLayer(questCircle);

    if (!quest) return;

    questMarker = L.marker([quest.lat, quest.lng])
        .addTo(map)
        .bindPopup(`<b>${quest.title}</b><br>${quest.description}`);

    questCircle = L.circle([quest.lat, quest.lng], {
        radius: quest.radius,
        color: "#f5a623",
        fillOpacity: 0.15
    }).addTo(map);
}

function checkQuestProximity(userLatLng: L.LatLng): void {
    const player = gameData.getPlayer();
    const quest = gameData.quests[player.currentQuestIndex];
    if (!quest) return;

    const questLatLng = L.latLng(quest.lat, quest.lng);
    const distance = userLatLng.distanceTo(questLatLng);

    if (distance <= quest.radius && !questFoundPopupOpen) {
        questFoundPopupOpen = true;
        showQuestFoundPrompt(quest);
    }
}

function showQuestFoundPrompt(quest: { id: string; title: string; points: number }): void {
    const confirmar = confirm(`Chegaste a "${quest.title}"! Completar esta quest?`);

    if (confirmar) {
        const player = gameData.getPlayer();
        player.completedQuests.push(quest.id);
        player.coins += quest.points;
        player.currentQuestIndex += 1;
        gameData.savePlayer(player);

        alert(`Quest completa! +${quest.points} pontos.`);
        renderCurrentQuestMarker();

        const coinsDisplay = document.getElementById("coins-display");
        if (coinsDisplay) coinsDisplay.textContent = `Coins: ${player.coins}`;
    }

    questFoundPopupOpen = false;
}

renderCurrentQuestMarker();

map.on("locationfound", (e: L.LocationEvent) => {
    checkQuestProximity(e.latlng);
});
