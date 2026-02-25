const bubble = document.getElementById("chat-bubble");
const windowEl = document.getElementById("chat-window");
const input = document.getElementById("user-input");
const messages = document.getElementById("chat-messages");

bubble.onclick = () => {
  windowEl.classList.toggle("hidden");
};

input.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    const userText = input.value;
    messages.innerHTML += `<div><b>You:</b> ${userText}</div>`;
    input.value = "";

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    messages.innerHTML += `<div><b>Bot:</b> ${data.reply}</div>`;
  }
});