export {};

interface Player {
    id: number;
    name: string;
    coins: number;
    loggedIn: boolean;
    achievements: string[];
}

const form = document.getElementById("signin-form") as HTMLFormElement;
const message = document.getElementById("form-message") as HTMLParagraphElement;

function showMessage(text: string, type: "error" | "success" = "error"): void {
    message.textContent = text;
    message.classList.toggle("success", type === "success");
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById("username") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const confirmPasswordInput = document.getElementById("confirm-password") as HTMLInputElement;
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!username || !password || !confirmPassword) {
        showMessage("Fill in all fields.");
        return;
    }

    if (password.length < 6) {
        showMessage("Password must have at least 6 characters.");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords do not match.");
        return;
    }

    showMessage("");

    try {
        const response = await fetch("api/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data: { player?: Player; error?: string } = await response.json();

        if (!response.ok || !data.player) {
            throw new Error(data.error ?? "Could not create account.");
        }

        localStorage.setItem("player", JSON.stringify(data.player));
        localStorage.setItem("coins", String(data.player.coins));
        showMessage("Account created. Redirecting...", "success");
        window.location.href = "index.html";
    } catch (err) {
        showMessage(err instanceof Error ? err.message : "Could not create account.");
    }
});
