/// <reference types="leaflet" />

// Coordenadas centrais de Maribor
const maribor = L.latLng(46.5547, 15.6459);

// Limites da área permitida (sudoeste e nordeste)
const bounds = L.latLngBounds(
    L.latLng(46.54641, 15.61363),
    L.latLng(46.56535, 15.66341)
);

// Cria o mapa, restrito à área de Maribor
const map = L.map("map", {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
}).setView(maribor, 14);

// Calcula e aplica o zoom mínimo baseado no tamanho da área
const minZoom = map.getBoundsZoom(bounds);
map.setMinZoom(minZoom);

// Camada de tiles do OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
}).addTo(map);

// --- Localização do jogador em tempo real (GPS) ---

let userMarker: L.Marker | null = null;
let userCircle: L.Circle | null = null;

map.locate({ watch: true, setView: false, enableHighAccuracy: true });

map.on("locationfound", (e: L.LocationEvent) => {
    if (userMarker) {
        userMarker.setLatLng(e.latlng);
        userCircle?.setLatLng(e.latlng).setRadius(e.accuracy);
    } else {
        userMarker = L.marker(e.latlng)
            .addTo(map)
            .bindPopup("Estás aqui!");
        userCircle = L.circle(e.latlng, { radius: e.accuracy }).addTo(map);
    }
});

map.on("locationerror", (e: L.ErrorEvent) => {
    console.error("Erro de localização:", e.message);
});
 //mapa ^^^npx tsc


function handleLogin(): void {
  // Placeholder — mais tarde isto vai chamar um backend/API real.
  const name = prompt("Nome de utilizador:");
  if (!name) return;

  player.name = name;
  player.loggedIn = true;
  alert(`Bem-vindo, ${player.name}!`);
}

function handleSignIn(): void {
  // Placeholder para registo de nova conta.
  const name = prompt("Escolhe um nome para a tua conta:");
  if (!name) return;

  player.name = name;
  player.loggedIn = true;
  alert(`Conta criada! Bem-vindo, ${player.name}!`);
}

interface Player {
  name: string;
  coins: number;
  loggedIn: boolean;
  achievements: String [];
}

interface Shop {
    id: String;
    name: String;
    price: number;
}

let player: Player = {
  name: "Guest",
  coins: 0,
  loggedIn: false,
  achievements: [],
};

const shopItems: Shop[] = [
    {id: "compass", name: "compass", price: 50},
    {id: "TresureDetector", name: "Tresure Detector", price: 50},
    {id: "SkipRidlle", name: "Skip Ridlle", price: 70},
];

function unlockAchievement(name: string): void {
  if (player.achievements.includes(name)) return;

  player.achievements.push(name);
  alert(`Achievement desbloqueado: ${name}`);
}

function openAchievements(): void {
  if (player.achievements.length === 0) {
    alert("Ainda não tens achievements. Continua a explorar!");
    return;
  }
  alert(`Achievements:\n${player.achievements.join("\n")}`);
}