let userMessages = [];
let assistantMessages = [];

async function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const userMessage = messageInput.value.trim();

  if (userMessage) {
    userMessages.push(userMessage);
    createMessageBubble(userMessage, "user");
    messageInput.value = "";

    // ローディングメッセージ追加
    const loadingMessageContainer = createLoadingMessage();

    try {
      const response = await fetch("http://localhost:3000/fortuneTell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessages: userMessages,
          assistantMessages: assistantMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }

      const data = await response.json();
      assistantMessages.push(data.assistant);

      // ローディングメッセージ削除・botチャット追加
      document.getElementById("messages").removeChild(loadingMessageContainer);
      createMessageBubble(data.assistant, "bot");
    } catch (error) {
      console.error("Error:", error);
      //ローディングメッセージ追加削除・エラーメッセージ
      document.getElementById("messages").removeChild(loadingMessageContainer);
      createMessageBubble("サーバーエラー", "bot");
    }
  }
}

function createMessageBubble(message, sender) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}-bubble`;
  bubble.textContent = message;

  const container = document.createElement("div");
  container.className = `${sender}-message-container message-container`;
  container.appendChild(bubble);

  document.getElementById("messages").appendChild(container);
}

function createLoadingMessage() {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble bot-bubble";
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    dot.textContent = ".";
    dot.className = "loading-dot";
    bubble.appendChild(dot);
  }

  const container = document.createElement("div");
  container.className = "bot-message-container message-container";
  container.appendChild(bubble);

  document.getElementById("messages").appendChild(container);

  return container;
}
