(function () {
  const widget = document.createElement('div');
  widget.className = 'chat-widget';
  widget.innerHTML = `
    <div class="chat-container" id="chat-box"></div>
    <div class="input-area">
      <input type="text" id="chat-input" placeholder="Ask us anything..." />
      <button id="chat-send">Send</button>
    </div>
  `;

  const container = document.getElementById('wavefx-chat');
  if (container) {
    container.appendChild(widget);
  } else {
    console.error('No element with id="wavefx-chat" found on page.');
    return;
  }

  const chat = widget.querySelector('#chat-box');
  const input = widget.querySelector('#chat-input');
  const button = widget.querySelector('#chat-send');

  function appendMessage(content, role) {
    const msg = document.createElement('div');
    msg.className = `message ${role}`;
    msg.textContent = content;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
  }

  appendMessage("Welcome to WaveFX! How can I help you today?", "bot");

  async function sendMessage() {
    const userInput = input.value.trim();
    if (!userInput) return;

    appendMessage(userInput, 'user');
    input.value = '';

    const loading = document.createElement('div');
    loading.className = 'message bot';
    loading.textContent = '...';
    chat.appendChild(loading);
    chat.scrollTop = chat.scrollHeight;

    try {
      const response = await fetch('https://wavefx.app.n8n.cloud/webhook/acf500b5-33dc-4727-b55d-373660e42a38/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });

      const data = await response.json();
      chat.removeChild(loading);
      appendMessage(data.reply || "Sorry, I didn’t get that. Please try again.", 'bot');
    } catch (err) {
      chat.removeChild(loading);
      appendMessage("Error contacting support. Please try again later.", 'bot');
    }
  }

  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });

  button.addEventListener('click', sendMessage);
})();
