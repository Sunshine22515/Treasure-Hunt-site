"use strict";
/// <reference types="leaflet" />
// ==================== MAPA ====================
const maribor = L.latLng(46.5547, 15.6459);
const bounds = L.latLngBounds(L.latLng(46.54641, 15.61363), L.latLng(46.56535, 15.66341));
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
// ==================== GPS ====================
let userMarker = null;
let userCircle = null;
map.locate({ watch: true, setView: false, enableHighAccuracy: true });
map.on("locationfound", (e) => {
    if (userMarker) {
        userMarker.setLatLng(e.latlng);
        userCircle?.setLatLng(e.latlng).setRadius(e.accuracy);
    }
    else {
        userMarker = L.marker(e.latlng).addTo(map).bindPopup("You're here!");
        userCircle = L.circle(e.latlng, { radius: e.accuracy }).addTo(map);
    }
});
map.on("locationerror", (e) => {
    console.error("Location Error:", e.message);
});
// ==================== NAVEGAÇÃO ====================
document.querySelector(".login")
    ?.addEventListener("click", () => window.location.href = "login.html");
document.querySelector(".sign-in")
    ?.addEventListener("click", () => window.location.href = "sign-in.html");
document.querySelector(".quest")
    ?.addEventListener("click", () => window.location.href = "quest.html");
document.querySelector(".achievements")
    ?.addEventListener("click", () => window.location.href = "achievements.html");
document.querySelector(".extra-points")
    ?.addEventListener("click", () => window.location.href = "extra-points.html");
// ==================== ATUALIZAR DISPLAY DE COINS ====================
const coinsDisplay = document.getElementById("coins-display");
if (coinsDisplay) {
    const savedCoins = localStorage.getItem("coins") ?? "0";
    coinsDisplay.textContent = `Coins: ${savedCoins}`;
}
//# sourceMappingURL=script.js.map