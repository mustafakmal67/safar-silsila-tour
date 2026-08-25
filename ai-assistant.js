/**
 * Safar Silsila - AI Travel Assistant
 * Client-Side Smart Conversational Assistant with Dynamic Injector,
 * Custom Inline Style Injection, and Contextual Chat Memory.
 */

(function() {
  // Session memory for the chat
  const chatHistory = [];

  // Initialize AI assistant on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIAssistant);
  } else {
    initAIAssistant();
  }

  function initAIAssistant() {
    // Check if assistant elements already exist to prevent double initialization
    if (document.getElementById('ai-assistant-toggle')) return;

    // 1. Inject CSS styles dynamically to bypass browser stylesheet caching
    injectStyles();

    // 2. Dynamically load tour-data.js if not already present on the page
    if (!window.TOUR_DATA) {
      const tourScript = document.createElement('script');
      tourScript.src = 'tour-data.js';
      tourScript.onload = () => {
        // Continue with UI injection and initialization
        injectUI();
        setupEventListeners();
        showWelcomeMessage();
      };
      document.body.appendChild(tourScript);
    } else {
      injectUI();
      setupEventListeners();
      showWelcomeMessage();
    }
  }

  // Inject styles dynamically into <head>
  function injectStyles() {
    if (document.getElementById('ai-assistant-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'ai-assistant-styles';
    styleEl.innerHTML = `
      /* Toggle Floating Button */
      .ai-assistant-toggle-btn {
        position: fixed;
        bottom: 92px; /* Placed exactly above WhatsApp button which is at 24px */
        right: 24px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        z-index: 1001;
        background: linear-gradient(135deg, #142211, #233e1c);
        border: 1px solid #A3B87B;
        color: #F5F6F2;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        box-shadow: 0 4px 20px rgba(116, 135, 78, 0.4), 0 0 10px rgba(163, 184, 123, 0.2);
        cursor: pointer;
        outline: none;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      .ai-assistant-toggle-btn i {
        transition: transform 0.4s ease;
        color: #A3B87B;
      }
      .ai-assistant-toggle-btn:hover {
        transform: scale(1.08) translateY(-2px);
        box-shadow: 0 6px 24px rgba(116, 135, 78, 0.5), 0 0 15px rgba(163, 184, 123, 0.4);
        border-color: #B9D191;
      }
      .ai-assistant-toggle-btn:hover i {
        transform: rotate(45deg) scale(1.1);
        color: #B9D191;
      }
      .ai-assistant-toggle-btn.active i {
        transform: rotate(135deg);
        color: #F5F6F2;
      }

      /* Hover text badge */
      .ai-btn-badge {
        position: absolute;
        right: 68px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(9, 15, 6, 0.95);
        border: 1px solid rgba(116, 135, 78, 0.18);
        color: #A3B87B;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 4px 10px;
        border-radius: 4px;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.55);
      }
      .ai-assistant-toggle-btn:hover .ai-btn-badge {
        opacity: 1;
        transform: translateY(-50%) translateX(-4px);
      }

      /* Ripple background pulses */
      .ai-btn-ripple {
        position: absolute;
        top: -2px; left: -2px; right: -2px; bottom: -2px;
        border-radius: 50%;
        border: 1px solid rgba(163, 184, 123, 0.5);
        animation: ai-pulse-ripple 3s infinite;
        pointer-events: none;
      }
      @keyframes ai-pulse-ripple {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.2); opacity: 0; }
        100% { transform: scale(1); opacity: 0; }
      }

      .ai-btn-glow {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(163, 184, 123, 0.4) 0%, transparent 70%);
        animation: ai-breathing-glow 4s infinite ease-in-out;
        pointer-events: none;
      }
      @keyframes ai-breathing-glow {
        0%, 100% { opacity: 0.3; transform: scale(0.95); }
        50% { opacity: 0.7; transform: scale(1.05); }
      }

      /* Chat Window Box */
      .ai-chat-window {
        position: fixed;
        bottom: 160px;
        right: 24px;
        width: 380px;
        height: 520px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border-radius: 1rem;
        background: rgba(14, 22, 10, 0.94);
        border: 1px solid rgba(116, 135, 78, 0.18);
        box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.55), 0 0 40px 0 rgba(116, 135, 78, 0.15), 0 10px 30px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        transform-origin: bottom right;
      }
      .ai-chat-window.hidden {
        opacity: 0;
        pointer-events: none;
        transform: translateY(30px) scale(0.92);
      }

      /* Header Styling */
      .ai-chat-header {
        padding: 16px 20px;
        background: linear-gradient(to bottom, rgba(9, 15, 6, 0.8), rgba(14, 22, 10, 0));
        border-bottom: 1px solid rgba(116, 135, 78, 0.15);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .ai-header-profile { display: flex; align-items: center; gap: 12px; }
      .ai-avatar {
        position: relative;
        width: 36px; height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #74874E, #142211);
        border: 1px solid #A3B87B;
        display: flex; align-items: center; justify-content: center;
        color: #A3B87B; font-size: 16px;
      }
      .ai-status-indicator {
        position: absolute; bottom: 0; right: 0;
        width: 9px; height: 9px; border-radius: 50%;
        background: #39d353; border: 1.5px solid #090F06;
        box-shadow: 0 0 6px #39d353;
      }
      .ai-header-info { display: flex; flex-direction: column; }
      .ai-title { margin: 0; font-size: 14px; font-weight: 600; color: #F5F6F2; }
      .ai-subtitle { font-size: 10px; color: rgba(245, 246, 242, 0.5); }
      .ai-close-btn {
        background: transparent; border: none; color: rgba(245, 246, 242, 0.5);
        font-size: 18px; cursor: pointer; padding: 4px; border-radius: 4px;
        display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;
      }
      .ai-close-btn:hover { color: #F5F6F2; background: rgba(255, 255, 255, 0.05); }

      /* Messages Area */
      .ai-messages-area {
        flex: 1; padding: 20px; overflow-y: auto;
        display: flex; flex-direction: column; gap: 16px;
        scroll-behavior: smooth;
      }
      .ai-messages-area::-webkit-scrollbar { width: 4px; }
      .ai-messages-area::-webkit-scrollbar-track { background: transparent; }
      .ai-messages-area::-webkit-scrollbar-thumb { background: rgba(116, 135, 78, 0.25); border-radius: 999px; }
      .ai-messages-area::-webkit-scrollbar-thumb:hover { background: rgba(116, 135, 78, 0.5); }

      /* Message Bubbles */
      .ai-message-wrapper { display: flex; width: 100%; animation: ai-msg-slide-up 0.35s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
      @keyframes ai-msg-slide-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      .ai-message-wrapper.ai-agent { justify-content: flex-start; }
      .ai-message-wrapper.ai-user { justify-content: flex-end; }

      .ai-msg-bubble { max-width: 82%; padding: 12px 16px; border-radius: 0.5rem; font-size: 13.5px; line-height: 1.5; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); }
      .ai-agent .ai-msg-bubble { background: rgba(245, 246, 242, 0.04); border: 1px solid rgba(245, 246, 242, 0.07); color: rgba(245, 246, 242, 0.9); border-top-left-radius: 4px; }
      .ai-user .ai-msg-bubble { background: #74874E; color: #F5F6F2; border-top-right-radius: 4px; box-shadow: 0 4px 12px rgba(116, 135, 78, 0.25); }
      .ai-msg-content { word-break: break-word; }
      .ai-msg-time { font-size: 9px; margin-top: 5px; text-align: right; opacity: 0.4; letter-spacing: 0.05em; }

      /* Custom Bullet points and Links */
      .ai-chat-bullet { display: flex; align-items: flex-start; gap: 8px; margin-top: 6px; margin-bottom: 6px; line-height: 1.4; }
      .ai-chat-bullet i { color: #A3B87B; margin-top: 3px; font-size: 13px; flex-shrink: 0; }
      .ai-chat-bullet span { flex: 1; }
      .ai-chat-link { color: #A3B87B !important; font-weight: 600; text-decoration: underline; transition: color 0.2s ease; }
      .ai-chat-link:hover { color: #B9D191 !important; }
      .ai-chat-space { height: 12px; }

      /* Typing indicator */
      .ai-typing-bubble { background: rgba(245, 246, 242, 0.03) !important; border-color: rgba(245, 246, 242, 0.05) !important; padding: 12px 20px !important; }
      .ai-typing-dots { display: flex; align-items: center; gap: 5px; height: 10px; }
      .ai-typing-dots span { width: 6px; height: 6px; background: #A3B87B; border-radius: 50%; display: inline-block; opacity: 0.4; animation: ai-dots-bounce 1.4s infinite ease-in-out both; }
      .ai-typing-dots span:nth-child(1) { animation-delay: -0.32s; }
      .ai-typing-dots span:nth-child(2) { animation-delay: -0.16s; }
      @keyframes ai-dots-bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1.1); opacity: 1; } }

      /* Suggestion Chips */
      .ai-suggestions-wrapper { padding: 10px 16px; border-top: 1px solid rgba(255, 255, 255, 0.04); background: rgba(9, 15, 6, 0.2); overflow: hidden; }
      .ai-suggestions-wrapper.hidden { display: none; }
      .ai-suggestions-list { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scroll-snap-type: x mandatory; }
      .ai-suggestions-list::-webkit-scrollbar { height: 0px; }
      .ai-suggestion-chip { flex-shrink: 0; background: rgba(245, 246, 242, 0.04); border: 1px solid rgba(116, 135, 78, 0.2); color: #A3B87B; font-size: 11.5px; padding: 6px 12px; border-radius: 999px; cursor: pointer; transition: all 0.25s ease; scroll-snap-align: start; }
      .ai-suggestion-chip:hover { background: rgba(116, 135, 78, 0.12); border-color: #A3B87B; color: #F5F6F2; }

      /* Input Forms */
      .ai-input-form { padding: 14px 20px; display: flex; gap: 8px; background: rgba(9, 15, 6, 0.4); border-top: 1px solid rgba(116, 135, 78, 0.1); align-items: center; }
      .ai-input-field { flex: 1; background: rgba(245, 246, 242, 0.03); border: 1px solid rgba(245, 246, 242, 0.08); border-radius: 0.5rem; padding: 10px 14px; color: #F5F6F2; font-size: 13px; outline: none; transition: all 0.3s ease; }
      .ai-input-field:focus { background: rgba(245, 246, 242, 0.05); border-color: #A3B87B; box-shadow: 0 0 8px rgba(163, 184, 123, 0.15); }
      .ai-input-field::placeholder { color: rgba(245, 246, 242, 0.3); }
      .ai-send-btn { background: #74874E; border: none; width: 36px; height: 36px; border-radius: 0.5rem; color: #F5F6F2; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      .ai-send-btn:hover { background: #A3B87B; transform: scale(1.05); }
      .ai-send-btn i { font-size: 15px; }

      .ai-chat-footer { padding: 6px 16px; text-align: center; font-size: 9.5px; color: rgba(245, 246, 242, 0.3); background: rgba(9, 15, 6, 0.7); letter-spacing: 0.04em; border-top: 1px solid rgba(255, 255, 255, 0.02); }

      /* Mobile styling */
      @media (max-width: 576px) {
        .ai-assistant-toggle-btn { bottom: 88px; right: 24px; width: 48px; height: 48px; font-size: 22px; }
        .ai-btn-badge { right: 58px; font-size: 10px; padding: 3px 8px; }
        .ai-chat-window { bottom: 148px; right: 16px; left: 16px; width: auto; height: 60vh; max-height: 480px; border-radius: 0.5rem; }
      }
      @media (max-height: 650px) and (min-width: 577px) {
        .ai-chat-window { height: 420px; }
      }
    `;
    document.head.appendChild(styleEl);
  }

  // Inject UI elements dynamically
  function injectUI() {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'ai-assistant-toggle';
    toggleBtn.className = 'ai-assistant-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Open AI Travel Guide');
    toggleBtn.innerHTML = `
      <div class="ai-btn-glow"></div>
      <div class="ai-btn-ripple"></div>
      <i class="ph ph-sparkle"></i>
      <span class="ai-btn-badge">AI Guide</span>
    `;

    const chatWindow = document.createElement('div');
    chatWindow.id = 'ai-assistant-window';
    chatWindow.className = 'ai-chat-window hidden';
    chatWindow.innerHTML = `
      <!-- Header -->
      <div class="ai-chat-header">
        <div class="ai-header-profile">
          <div class="ai-avatar">
            <i class="ph ph-sparkle"></i>
            <span class="ai-status-indicator"></span>
          </div>
          <div class="ai-header-info">
            <h3 class="ai-title">Safar Silsila AI Guide</h3>
            <span class="ai-subtitle">Virtual Travel Planner • Active</span>
          </div>
        </div>
        <button id="ai-assistant-close" class="ai-close-btn" aria-label="Close Chat">
          <i class="ph ph-x"></i>
        </button>
      </div>

      <!-- Messages Area -->
      <div id="ai-messages" class="ai-messages-area"></div>

      <!-- Suggestions Area -->
      <div class="ai-suggestions-wrapper">
        <div id="ai-suggestions" class="ai-suggestions-list"></div>
      </div>

      <!-- Input Form -->
      <form id="ai-input-form" class="ai-input-form">
        <input type="text" id="ai-input" class="ai-input-field" placeholder="Ask about Hunza, Skardu, custom tours..." required autocomplete="off" />
        <button type="submit" class="ai-send-btn" aria-label="Send Message">
          <i class="ph ph-paper-plane-right"></i>
        </button>
      </form>

      <!-- Footer -->
      <div class="ai-chat-footer">
        Powered by Safar Silsila • Instant Booking Assistance
      </div>
    `;

    document.body.appendChild(toggleBtn);
    document.body.appendChild(chatWindow);
  }

  // Set up click events and form submits
  function setupEventListeners() {
    const toggleBtn = document.getElementById('ai-assistant-toggle');
    const chatWindow = document.getElementById('ai-assistant-window');
    const closeBtn = document.getElementById('ai-assistant-close');
    const form = document.getElementById('ai-input-form');
    const input = document.getElementById('ai-input');

    // Toggle Chat Window
    toggleBtn.addEventListener('click', () => {
      chatWindow.classList.toggle('hidden');
      toggleBtn.classList.toggle('active');
      if (!chatWindow.classList.contains('hidden')) {
        input.focus();
        scrollToBottom();
      }
    });

    // Close Chat Window
    closeBtn.addEventListener('click', () => {
      chatWindow.classList.add('hidden');
      toggleBtn.classList.remove('active');
    });

    // Close on escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !chatWindow.classList.contains('hidden')) {
        chatWindow.classList.add('hidden');
        toggleBtn.classList.remove('active');
      }
    });

    // Form Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (!message) return;

      handleUserMessage(message);
      input.value = '';
    });
  }

  // Show welcome message and suggestions
  function showWelcomeMessage() {
    const welcomeText = "Assalam-o-Alaikum! 🏔️ I am your Safar Silsila AI Travel Guide. \n\nHow can I help you explore Northern Pakistan? You can ask me about tour packages, pricing, itineraries, custom planning, or car rentals. \n\nSelect one of the popular topics below or type your question!";
    
    appendMessage(welcomeText, 'ai');
    chatHistory.push({ role: 'assistant', text: welcomeText });

    const defaultSuggestions = [
      { text: "🌸 Hunza Valley Tour", query: "Tell me about Hunza tours" },
      { text: "❄️ Skardu Valley Tour", query: "Tell me about Skardu tours" },
      { text: "📅 Plan Custom Tour", query: "How to plan a custom trip" },
      { text: "🚗 Rent Transport", query: "Rent a car or coaster" },
      { text: "💳 How to Book?", query: "What is the booking process and payment method" }
    ];

    setSuggestions(defaultSuggestions);
  }

  // Handle a message sent by the user
  function handleUserMessage(message) {
    appendMessage(message, 'user');
    chatHistory.push({ role: 'user', text: message });
    scrollToBottom();
    showTypingIndicator();

    // Get matched response after simulated delay
    const responseData = generateAIResponse(message);
    const typingDelay = Math.min(2000, Math.max(800, message.length * 10));

    setTimeout(() => {
      hideTypingIndicator();
      appendMessage(responseData.text, 'ai');
      chatHistory.push({ role: 'assistant', text: responseData.text });
      setSuggestions(responseData.suggestions || []);
      scrollToBottom();
    }, typingDelay);
  }

  // Append a message bubble to the chat container
  function appendMessage(text, sender) {
    const container = document.getElementById('ai-messages');
    const wrapper = document.createElement('div');
    wrapper.className = `ai-message-wrapper ${sender === 'user' ? 'ai-user' : 'ai-agent'}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    wrapper.innerHTML = `
      <div class="ai-msg-bubble">
        <div class="ai-msg-content">${sender === 'user' ? escapeHtml(text) : parseChatMarkdown(text)}</div>
        <div class="ai-msg-time">${time}</div>
      </div>
    `;

    container.appendChild(wrapper);
  }

  // Show typing bouncing indicator
  function showTypingIndicator() {
    const container = document.getElementById('ai-messages');
    const wrapper = document.createElement('div');
    wrapper.id = 'ai-typing-indicator';
    wrapper.className = 'ai-message-wrapper ai-agent';
    wrapper.innerHTML = `
      <div class="ai-msg-bubble ai-typing-bubble">
        <div class="ai-typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    container.appendChild(wrapper);
    scrollToBottom();
  }

  // Hide typing indicator
  function hideTypingIndicator() {
    const indicator = document.getElementById('ai-typing-indicator');
    if (indicator) indicator.remove();
  }

  // Update suggestions chips below the messages
  function setSuggestions(suggestions) {
    const list = document.getElementById('ai-suggestions');
    list.innerHTML = '';
    
    if (suggestions.length === 0) {
      list.parentElement.classList.add('hidden');
      return;
    } else {
      list.parentElement.classList.remove('hidden');
    }

    suggestions.forEach(item => {
      const chip = document.createElement('button');
      chip.className = 'ai-suggestion-chip';
      chip.innerText = item.text;
      chip.addEventListener('click', () => {
        handleUserMessage(item.query || item.text);
      });
      list.appendChild(chip);
    });
  }

  // Scroll messages panel to bottom
  function scrollToBottom() {
    const container = document.getElementById('ai-messages');
    container.scrollTop = container.scrollHeight;
  }

  // Escape raw HTML characters to prevent XSS from user input
  function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }

  // Parse custom simplified markdown
  function parseChatMarkdown(text) {
    let html = text;

    // Convert double line breaks to spacing block
    html = html.replace(/\n\n/g, '<div class="ai-chat-space"></div>');

    // Convert bullet lists: - bullet
    html = html.replace(/(?:^|\n)-\s+([^\n]+)/g, (match, p1) => {
      return `<div class="ai-chat-bullet"><i class="ph ph-circle-wavy-check"></i> <span>${p1}</span></div>`;
    });

    // Convert links [label](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="ai-chat-link" target="_blank">$1</a>');

    // Convert bold **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Convert remaining single line breaks
    html = html.replace(/\n/g, '<br>');

    return html;
  }

  // AI Smart Dynamic Matching System across ALL 180+ Tours with Context Memory
  function generateAIResponse(message) {
    const normalized = message.toLowerCase().trim();
    const tourData = window.TOUR_DATA || {};

    const fallbackSuggestions = [
      { text: "⛰️ Swat & Kalam Packages", query: "Show me Swat tour packages" },
      { text: "🌸 Hunza Valley Tours", query: "Tell me about Hunza packages" },
      { text: "❄️ Skardu Valley Tours", query: "What are your Skardu tours" },
      { text: "🍁 Kashmir Tours", query: "Kashmir tour options" },
      { text: "📅 Plan Custom Tour", query: "How to plan a custom trip" },
      { text: "🚗 Rent Transport", query: "Rent a car or coaster" }
    ];

    const getTourLink = (id) => `tour-details.html?tour=${id}`;

    // -----------------------------------------------------------------
    // STEP 1: General High-Priority Intent Matches (Greetings, Booking, Offices, Custom, Transport, etc.)
    // -----------------------------------------------------------------

    // 1A. Greetings
    if (normalized.match(/^(hello|hi|hey|assalam|salam|helo|greetings|good morning|good evening|aoa)/i)) {
      return {
        text: "Assalam-o-Alaikum! 🏔️ Welcome to **Safar Silsila Travel & Tours**. I am your smart AI travel assistant, ready to give you 100% accurate details on all our 180+ tour packages and travel services!\n\nWhich destination or service can I help you explore today?\n- **Group Tour Destinations**: Swat & Kalam, Hunza & Naltar, Skardu & Deosai, Kashmir & Taobat, Minimarg & Astore, Fairy Meadows, Kumrat & Jahaz Banda.\n- **Travel Services**: Custom Honeymoon & Family Trips, Luxury Vehicle Rentals, and Foreigner Expeditions.",
        suggestions: [
          { text: "⛰️ Swat & Kalam Packages", query: "Swat tour packages" },
          { text: "🌸 Hunza Valley Packages", query: "Hunza package details" },
          { text: "❄️ Skardu Valley Packages", query: "Skardu package details" },
          { text: "📅 Plan Custom Tour", query: "How can I plan a custom trip?" },
          { text: "💳 How to Book?", query: "How do I book a tour?" }
        ]
      };
    }

    // 1B. Booking & Payment Process
    if (normalized.includes("book") || normalized.includes("payment") || normalized.includes("pay") || normalized.includes("advance") || normalized.includes("deposit") || normalized.includes("bank account") || normalized.includes("account number") || normalized.includes("how to reserve")) {
      return {
        text: "Booking a tour with Safar Silsila is simple and 100% secure:\n\n" +
              "1. **Select Your Tour**: Pick your preferred group package, custom itinerary, or transport rental.\n" +
              "2. **50% Advance Deposit**: Transfer 50% advance to lock your seats/booking.\n" +
              "3. **Remaining Balance**: Pay the remaining 50% balance at the time of departure or check-in.\n\n" +
              "💳 **Accepted Payment Methods**:\n" +
              "- **Bank Transfer**: HBL, Meezan Bank, Bank Alfalah\n" +
              "- **Mobile Wallets**: EasyPaisa & JazzCash\n" +
              "- **Cash**: Payment at our Islamabad or Karachi offices.\n\n" +
              "After transferring, send your transaction receipt to our WhatsApp team, and we will immediately issue your official **Booking Confirmation Voucher**!",
        suggestions: [
          { text: "📞 Contact via WhatsApp", query: "Give me your WhatsApp number for payment receipt" },
          { text: "📍 Where is your office?", query: "Where is your office address" },
          { text: "📋 View Group Tours", query: "Show me group tour packages" }
        ]
      };
    }

    // 1C. Custom Tour Planning & Honeymoon
    if (normalized.includes("custom") || normalized.includes("tailor") || normalized.includes("honeymoon") || normalized.includes("family tour") || normalized.includes("private trip") || normalized.includes("private tour") || normalized.includes("corporate")) {
      return {
        text: "Looking for a **Private / Customized / Honeymoon Tour**? Safar Silsila is a logistics expert in personal travel planning!\n\n" +
              "✨ **What We Provide**:\n" +
              "- Dedicated luxury AC vehicle (Prado, Land Cruiser V8, Grand Cabin, Coaster, or 4x4 Jeep)\n" +
              "- Handpicked hotel accommodations (Standard, Deluxe, or 5-Star Luxury Resorts)\n" +
              "- Customized day-by-day sightseeing itinerary based on your preferred dates\n" +
              "- Professional local mountain drivers & tour guides\n\n" +
              "👉 [Click here to open our Custom Tour Builder](custom-tour.html) to request a customized quote instantly!",
        suggestions: [
          { text: "📅 Fill Custom Form", query: "I want to fill custom tour form" },
          { text: "🚗 Rent Transport", query: "What vehicles do you rent?" },
          { text: "📞 Contact via WhatsApp", query: "WhatsApp contact" }
        ]
      };
    }

    // 1D. Transport Rentals
    if (normalized.includes("transport") || normalized.includes("car rent") || normalized.includes("rent vehicle") || normalized.includes("prado") || normalized.includes("coaster") || normalized.includes("grand cabin") || normalized.includes("hiace") || normalized.includes("jeep rent")) {
      return {
        text: "Safar Silsila offers premium **Vehicle Rental Services** across Pakistan with expert mountain drivers:\n\n" +
              "- **Toyota HiAce Grand Cabin** (AC, 11-13 Seats): Ideal for families and small groups.\n" +
              "- **Saloon Coaster** (AC, 20-22 Seats): Best for corporate and large group trips.\n" +
              "- **Toyota Prado / Land Cruiser V8** (4x4, 4-6 Seats): Ultimate luxury & comfort for mountain tracks.\n" +
              "- **Local Mountain 4x4 Jeeps**: For off-roading to Deosai, Fairy Meadows, Minimarg, Kumrat, etc.\n\n" +
              "👉 [View All Vehicles and Request Quote](transport.html)",
        suggestions: [
          { text: "🚗 Transport Page", query: "Show transport rental details" },
          { text: "📞 WhatsApp Quote", query: "Give WhatsApp for vehicle rental" }
        ]
      };
    }

    // 1E. Office Address & Contacts
    if (normalized.includes("address") || normalized.includes("office") || normalized.includes("location") || normalized.includes("where are you") || normalized.includes("contact") || normalized.includes("phone") || normalized.includes("whatsapp") || normalized.includes("number")) {
      return {
        text: "You are welcome to visit our offices or reach out directly:\n\n" +
              "📍 **Islamabad Office**:\n" +
              "Office # 9, First Floor, Aslam Business Square, FECHS E-11/2, Islamabad, Pakistan.\n\n" +
              "📍 **Karachi Office**:\n" +
              "Building #7c Street-3, Office No 2, Badar Commercial, DHA Phase-V, Karachi, Pakistan.\n\n" +
              "📞 **Phone / WhatsApp**: [+92 311 1145456](https://wa.me/923111145456)\n" +
              "✉️ **Email**: info@safarsilsila.com\n" +
              "🕒 **Timings**: Monday to Saturday, 10:00 AM – 6:00 PM\n\n" +
              "Weekly group departures leave from **Lahore** (Daewoo Terminal) and **Islamabad** (G-11 Metro / Highway points).",
        suggestions: [
          { text: "💬 Open WhatsApp Chat", query: "Open WhatsApp chat" },
          { text: "📋 View Group Tours", query: "Show me all tour packages" }
        ]
      };
    }

    // 1F. Weather & Best Season
    if (normalized.includes("weather") || normalized.includes("season") || normalized.includes("best time") || normalized.includes("month") || normalized.includes("clothes") || normalized.includes("snow")) {
      return {
        text: "🌤️ **Northern Pakistan Weather & Travel Guide**:\n\n" +
              "- **Peak Season (May – October)**: Pleasant day weather (15°C – 25°C). All main passes (Babusar Pass, Deosai, Shandur) are open.\n" +
              "- **Spring / Autumn (April - May & Sep - Oct)**: Crisp clear skies, spring cherry blossoms, and golden autumn foliage. Evening temperatures drop near 0°C—warm jackets recommended.\n" +
              "- **Winter (Nov – March)**: Snowfall season in Hunza, Skardu, Swat, and Malam Jabba. Ideal for snow sports and winter festivals!",
        suggestions: [
          { text: "📋 View All Tour Packages", query: "Show me group tour packages" },
          { text: "📅 Plan Custom Tour", query: "How to plan custom trip" }
        ]
      };
    }

    // 1G. Foreigners & Visas
    if (normalized.includes("visa") || normalized.includes("passport") || normalized.includes("foreigner") || normalized.includes("international")) {
      return {
        text: "🛂 **International Travelers & Visa Services**:\n\n" +
              "- Pakistan offers online **eVisa** for citizens of 170+ countries.\n" +
              "- **Safar Silsila LOI Letter**: Upon booking, we issue official **Letters of Invitation (LOI)** and hotel vouchers for your visa approval.\n" +
              "- **Dedicated Foreigner Services**: Private 4x4 vehicles, English-speaking licensed guides, and curated security protocol.\n\n" +
              "👉 [Explore Foreigner Group Trips](foreign-group-trips.html) or [View Visa Assistance](visa-help.html)",
        suggestions: [
          { text: "🌍 Foreigner Group Trips", query: "Show foreigner group trips" },
          { text: "📄 Visa Help Page", query: "Tell me about visa assistance" }
        ]
      };
    }

    // -----------------------------------------------------------------
    // STEP 2: Dynamic Search Across ALL 180+ Tours in window.TOUR_DATA
    // -----------------------------------------------------------------

    // Extract search query keywords (removing common stop words)
    const stopWords = ['the', 'a', 'an', 'in', 'on', 'at', 'for', 'of', 'to', 'is', 'are', 'was', 'were', 'tours', 'tour', 'trip', 'trips', 'package', 'packages', 'group', 'groups', 'show', 'tell', 'me', 'about', 'what', 'your', 'any', 'some', 'list', 'please', 'details', 'give', 'can', 'find', 'which', 'available'];
    const queryTokens = normalized.split(/[^a-z0-9]+/).filter(w => w.length > 2 && !stopWords.includes(w));

    let matchedTours = [];

    for (const key in tourData) {
      const tour = tourData[key];
      const searchTarget = (tour.id + ' ' + tour.title + ' ' + tour.location + ' ' + tour.duration + ' ' + (tour.highlights || []).join(' ')).toLowerCase();
      
      let matchScore = 0;
      queryTokens.forEach(token => {
        if (searchTarget.includes(token)) {
          matchScore += 2;
          if (tour.title.toLowerCase().includes(token) || tour.location.toLowerCase().includes(token)) {
            matchScore += 3; // Bonus for title/location match
          }
        }
      });

      if (matchScore > 0) {
        matchedTours.push({ tour, score: matchScore });
      }
    }

    matchedTours.sort((a, b) => b.score - a.score);

    // -----------------------------------------------------------------
    // STEP 3: Handle Specific Tour Inquiry vs Multi-Tour Search Results
    // -----------------------------------------------------------------

    const isPriceQuery = normalized.includes("price") || normalized.includes("cost") || normalized.includes("how much") || normalized.includes("fee") || normalized.includes("charges") || normalized.includes("rate");
    const isItineraryQuery = normalized.includes("itinerary") || normalized.includes("schedule") || normalized.includes("day 1") || normalized.includes("days detail") || normalized.includes("route") || normalized.includes("plan");
    const isInclusionQuery = normalized.includes("include") || normalized.includes("exclude") || normalized.includes("breakfast") || normalized.includes("dinner") || normalized.includes("hotel") || normalized.includes("service");
    const isFaqQuery = normalized.includes("faq") || normalized.includes("question") || normalized.includes("trek") || normalized.includes("difficult") || normalized.includes("walking");

    const topMatch = matchedTours.length > 0 ? matchedTours[0].tour : null;

    // Case 3A: Specific Tour Feature Inquiry (Price, Itinerary, Inclusions, FAQs)
    if (topMatch && (isPriceQuery || isItineraryQuery || isInclusionQuery || isFaqQuery || matchedTours.length === 1)) {
      // 3A1. Specific Price Response
      if (isPriceQuery) {
        let text = `The pricing details for **${topMatch.title}** are:\n\n`;
        text += `- 🏷️ **Standard Quad Sharing Package**: **PKR ${topMatch.price}** per person\n`;
        
        if (topMatch.packages && topMatch.packages.length > 0) {
          text += `\n**Other Accommodation Tiers**:\n`;
          topMatch.packages.forEach(pkg => {
            if (pkg.price && pkg.price !== 'N/A') {
              text += `- **${pkg.name}**: PKR ${pkg.price} / head\n`;
            }
          });
        }
        
        if (topMatch.jeepCharges) {
          text += `- 🚙 **Jeep Excursion Note**: ${topMatch.jeepCharges}\n`;
        }

        text += `\n👉 [Click here to view complete hotel & itinerary details](${getTourLink(topMatch.id)})\n\nWould you like to read the itinerary or inclusions?`;

        return {
          text: text,
          suggestions: [
            { text: `📋 ${topMatch.duration} Itinerary`, query: `Show me the itinerary of ${topMatch.title}` },
            { text: `🏕️ What's included?`, query: `What is included in ${topMatch.title}` },
            { text: "💳 How to Book?", query: "How to book" }
          ]
        };
      }

      // 3A2. Specific Itinerary Response
      if (isItineraryQuery) {
        let text = `Here is the day-by-day itinerary for **${topMatch.title}** (${topMatch.duration}):\n\n`;
        if (topMatch.itinerary && topMatch.itinerary.length > 0) {
          topMatch.itinerary.forEach(day => {
            text += `**${day.day} - ${day.title}**\n${day.desc}\n\n`;
          });
        } else {
          text += `This tour features sightseeing across ${topMatch.location}.\n\n`;
        }
        text += `👉 [View Full Hotel & Route Details Online](${getTourLink(topMatch.id)})`;

        return {
          text: text,
          suggestions: [
            { text: `💵 Check Price`, query: `What is the price of ${topMatch.title}` },
            { text: `🏕️ Check inclusions`, query: `What is included in ${topMatch.title}` },
            { text: "💳 How to Book?", query: "How to book" }
          ]
        };
      }

      // 3A3. Specific Inclusions/Exclusions Response
      if (isInclusionQuery) {
        let text = `For **${topMatch.title}**, the package includes:\n\n`;
        if (topMatch.inclusions && topMatch.inclusions.length > 0) {
          topMatch.inclusions.forEach(inc => { text += `- ✅ ${inc}\n`; });
        }
        
        if (topMatch.exclusions && topMatch.exclusions.length > 0) {
          text += `\n**What's Excluded**:\n`;
          topMatch.exclusions.forEach(exc => { text += `- ❌ ${exc}\n`; });
        }

        text += `\n👉 [View Complete Tour Voucher & Booking Details](${getTourLink(topMatch.id)})`;

        return {
          text: text,
          suggestions: [
            { text: `💵 Check Price`, query: `What is the price of ${topMatch.title}` },
            { text: `📋 View Itinerary`, query: `Show me the itinerary of ${topMatch.title}` },
            { text: "💳 How to Book?", query: "How to book" }
          ]
        };
      }

      // 3A4. Single Match Summary
      if (matchedTours.length === 1 || topMatch.score >= 5) {
        let text = `Here are the details for **${topMatch.title}**:\n\n`;
        text += `- ⏱️ **Duration**: ${topMatch.duration}\n`;
        text += `- 📍 **Location**: ${topMatch.location}\n`;
        text += `- 💰 **Starting Price**: **PKR ${topMatch.price} / head**\n`;
        if (topMatch.highlights && topMatch.highlights.length > 0) {
          text += `- ⭐ **Highlights**: ${topMatch.highlights.slice(0, 4).join(", ")}\n`;
        }
        text += `\n👉 [Click here for full itinerary & online booking](${getTourLink(topMatch.id)})`;

        return {
          text: text,
          suggestions: [
            { text: `📋 View Itinerary`, query: `Show me the itinerary of ${topMatch.title}` },
            { text: `💵 Price Tiers`, query: `What is the price of ${topMatch.title}` },
            { text: "💳 How to Book?", query: "How to book" }
          ]
        };
      }
    }

    // Case 3B: Multiple Tour Matches (e.g. user searched "Hunza tours", "Swat packages", "Skardu", "group tours", "3-day tours", etc.)
    if (matchedTours.length > 0) {
      const topResults = matchedTours.slice(0, 5);
      let text = `Here are the top matching tour packages found for your search:\n\n`;

      const nextSuggestions = [];

      topResults.forEach(({ tour }, index) => {
        text += `**${index + 1}. ${tour.title}**\n`;
        text += `- ⏱️ **Duration**: ${tour.duration} | 📍 **Location**: ${tour.location}\n`;
        text += `- 💰 **Starting Price**: **PKR ${tour.price}** per person\n`;
        if (tour.highlights && tour.highlights.length > 0) {
          text += `- ⭐ **Highlights**: ${tour.highlights.slice(0, 3).join(", ")}\n`;
        }
        text += `- 👉 [View Package Details & Itinerary](${getTourLink(tour.id)})\n\n`;

        if (index < 3) {
          nextSuggestions.push({
            text: `📋 ${tour.title.slice(0, 22)}...`,
            query: `Tell me more about ${tour.title}`
          });
        }
      });

      text += `Would you like to view the day-by-day itinerary or pricing breakdown for any of these tours?`;

      return {
        text: text,
        suggestions: nextSuggestions.length > 0 ? nextSuggestions : fallbackSuggestions
      };
    }

    // -----------------------------------------------------------------
    // STEP 4: Comprehensive Fallback (When Query Is Broad or Unrecognized)
    // -----------------------------------------------------------------
    return {
      text: "I am here to give you 100% accurate information on all our tour packages and services! \n\n" +
            "You can ask me about:\n" +
            "- ⛰️ **Group Tours**: Swat & Kalam (3 Days), Hunza & Naltar (5 Days), Skardu & Deosai (6 Days), Kashmir & Taobat (4/5 Days), Minimarg & Astore (6 Days), Fairy Meadows (5 Days), Kumrat & Jahaz Banda (5 Days).\n" +
            "- 📅 **Custom Tours & Honeymoons**: Tailored private trips with luxury vehicle & hotel options.\n" +
            "- 🚗 **Transport Rentals**: Land Cruisers, Prados, Grand Cabins, Coasters, and 4x4 Jeeps.\n" +
            "- 🛂 **Foreigner Tours & Visa Help**: eVisa invitation letters and private expeditions.\n\n" +
            "Which destination or package would you like to explore?",
      suggestions: fallbackSuggestions
    };
  }

})();
