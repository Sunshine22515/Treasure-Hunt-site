/// <reference types="leaflet" />

// ==================== MAPA ====================

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
    attribution: "© OpenStreetMap"
}).addTo(map);

// ==================== PONTOS DE PARAGEM ====================

interface Waypoint {
    id: string;
    name: string;
    lat: number;
    lng: number;
    clue: string;
}

const waypoints: Waypoint[] = [
    {
        id: "wp1",
        name: "Lent",
        lat: 46.557584,
        lng: 15.645282,
        clue: "Onde o rio abraça a cidade mais velha..."
    },
    {
        id: "wp2",
        name: "Praça Principal",
        lat: 46.5583,
        lng: 15.6467,
        clue: "No coração de Maribor, onde tudo se encontra."
    },
    {
        id: "wp3",
        name: "Castelo de Maribor",
        lat: 46.5563,
        lng: 15.6459,
        clue: "Paredes antigas guardam segredos de reis passados."
    }
    // Adiciona mais pontos aqui conforme precisares
];

// Ícone customizado para os pontos de paragem (opcional, mas fica melhor visualmente)
const waypointIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

waypoints.forEach((wp) => {
    L.marker([wp.lat, wp.lng], { icon: waypointIcon })
        .addTo(map)
        .bindPopup(`<b>${wp.name}</b><br>${wp.clue}`);
})

// ==================== GPS ====================

let userMarker: L.Marker | null = null;
let userCircle: L.Circle | null = null;

map.locate({ watch: true, setView: false, enableHighAccuracy: true });

map.on("locationfound", (e: L.LocationEvent) => {
    if (userMarker) {
        userMarker.setLatLng(e.latlng);
        userCircle?.setLatLng(e.latlng).setRadius(e.accuracy);
    } else {
        userMarker = L.marker(e.latlng).addTo(map).bindPopup("You're here!");
        userCircle = L.circle(e.latlng, { radius: e.accuracy }).addTo(map);
    }
});

map.on("locationerror", (e: L.ErrorEvent) => {
    console.error("Location Error:", e.message);
});

// ==================== NAVEGAÇÃO ====================

document.querySelector<HTMLButtonElement>(".login")
    ?.addEventListener("click", () => window.location.href = "login.html");

document.querySelector<HTMLButtonElement>(".sign-in")
    ?.addEventListener("click", () => window.location.href = "sign-in.html");

document.querySelector<HTMLButtonElement>(".quest")
    ?.addEventListener("click", () => window.location.href = "quest.html");

document.querySelector<HTMLButtonElement>(".achievements")
    ?.addEventListener("click", () => window.location.href = "achievements.html");

document.querySelector<HTMLButtonElement>(".extra-points")
    ?.addEventListener("click", () => window.location.href = "extra-points.html");

// ==================== ATUALIZAR DISPLAY DE COINS ====================

const coinsDisplay = document.getElementById("coins-display");
if (coinsDisplay) {
    const savedCoins = localStorage.getItem("coins") ?? "0";
    coinsDisplay.textContent = `Coins: ${savedCoins}`;
}