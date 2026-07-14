const form = document.getElementById("login-form");
const message = document.getElementById("form-message");
function showMessage(text, type = "error") {
    message.textContent = text;
    message.classList.toggle("success", type === "success");
}
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || !password) {
        showMessage("Enter your username and password.");
        return;
    }
    showMessage("");
    try {
        const response = await fetch("api/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (!response.ok || !data.player) {
            throw new Error(data.error ?? "Could not log in.");
        }
        localStorage.setItem("player", JSON.stringify(data.player));
        localStorage.setItem("coins", String(data.player.coins));
        showMessage("Logged in. Redirecting...", "success");
        window.location.href = "index.html";
    }
    catch (err) {
        showMessage(err instanceof Error ? err.message : "Could not log in.");
    }
});
export {};
//# sourceMappingURL=login.js.map