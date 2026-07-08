"use strict";
/// <reference types="leaflet" />
const maribor = L.latLng(46.5547, 15.6459);
const bounds = L.latLngBounds(L.latLng(46.54641, 15.61363), L.latLng(46.56535, 15.66341));
const map = L.map("map", {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
}).setView(maribor, 14);
// Calcula o zoom mínimo baseado no tamanho real da área
const minZoom = map.getBoundsZoom(bounds);
map.setMinZoom(minZoom);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
}).addTo(map);
//mapa ^^^npx tsc
function handleLogin() {
    // Placeholder — mais tarde isto vai chamar um backend/API real.
    const name = prompt("Nome de utilizador:");
    if (!name)
        return;
    player.name = name;
    player.loggedIn = true;
    alert(`Bem-vindo, ${player.name}!`);
}
function handleSignIn() {
    // Placeholder para registo de nova conta.
    const name = prompt("Escolhe um nome para a tua conta:");
    if (!name)
        return;
    player.name = name;
    player.loggedIn = true;
    alert(`Conta criada! Bem-vindo, ${player.name}!`);
}
let player = {
    name: "Guest",
    coins: 0,
    loggedIn: false,
    achievements: [],
};
const shopItems = [
    { id: "compass", name: "compass", price: 50 },
    { id: "TresureDetector", name: "Tresure Detector", price: 50 },
    { id: "SkipRidlle", name: "Skip Ridlle", price: 70 },
];
function unlockAchievement(name) {
    if (player.achievements.includes(name))
        return;
    player.achievements.push(name);
    alert(`Achievement desbloqueado: ${name}`);
}
function openAchievements() {
    if (player.achievements.length === 0) {
        alert("Ainda não tens achievements. Continua a explorar!");
        return;
    }
    alert(`Achievements:\n${player.achievements.join("\n")}`);
}
//# sourceMappingURL=script.js.map