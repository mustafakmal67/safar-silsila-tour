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

  // AI Rule-Based Natural Matching System with Session Context Memory
  function generateAIResponse(message) {
    const normalized = message.toLowerCase().trim();
    const tourData = window.TOUR_DATA || {};

    const fallbackSuggestions = [
      { text: "🌸 Hunza tours", query: "Tell me about Hunza packages" },
      { text: "❄️ Skardu tours", query: "What are your Skardu tours" },
      { text: "📅 Plan Custom Tour", query: "How to plan a custom trip" },
      { text: "🚗 Rent Transport", query: "Rent a car or coaster" }
    ];

    const getTourLink = (id) => `tour-details.html?tour=${id}`;

    // A. Resolve context/destination from chat history
    let contextDest = null;
    for (let i = chatHistory.length - 1; i >= 0; i--) {
      if (chatHistory[i].role === 'user') {
        const msg = chatHistory[i].text.toLowerCase();
        if (msg.includes('hunza') || msg.includes('naltar')) { contextDest = '5-days-hunza-naltar'; break; }
        if (msg.includes('skardu') || msg.includes('deosai')) { contextDest = '6-days-skardu-deosai'; break; }
        if (msg.includes('astore') || msg.includes('minimarg') || msg.includes('rainbow')) { contextDest = '6-days-astore-minimarg'; break; }
        if (msg.includes('fairy') || msg.includes('meadows') || msg.includes('nanga')) { contextDest = '5-days-fairy-meadows'; break; }
        if (msg.includes('ratti') || msg.includes('kashmir') || msg.includes('taobat')) { contextDest = '5-days-kashmir-ratti-gali'; break; }
        if (msg.includes('kumrat') || msg.includes('katora') || msg.includes('jahaz')) { contextDest = '5-days-kumrat-jahaz-banda'; break; }
      }
    }

    // Determine target tour based on current query or context fallback
    let targetTourId = null;
    if (normalized.includes("8-days-hunza") || (normalized.includes("hunza") && normalized.includes("8"))) {
      targetTourId = "8-days-hunza-skardu-deosai";
    } else if (normalized.includes("5-days-hunza") || (normalized.includes("hunza") && normalized.includes("5")) || (normalized.includes("hunza") && normalized.includes("naltar"))) {
      targetTourId = "5-days-hunza-naltar";
    } else if (normalized.includes("6-days-skardu") || (normalized.includes("skardu") && normalized.includes("6"))) {
      targetTourId = "6-days-skardu-deosai";
    } else if (normalized.includes("astore") || normalized.includes("minimarg") || normalized.includes("rainbow") || normalized.includes("domail")) {
      targetTourId = "6-days-astore-minimarg";
    } else if (normalized.includes("fairy") || normalized.includes("meadows") || normalized.includes("nanga")) {
      targetTourId = "5-days-fairy-meadows";
    } else if (normalized.includes("kumrat") || normalized.includes("katora") || normalized.includes("jahaz")) {
      targetTourId = "5-days-kumrat-jahaz-banda";
    } else if (normalized.includes("ratti") || (normalized.includes("kashmir") && normalized.includes("5"))) {
      targetTourId = "5-days-kashmir-ratti-gali";
    } else if (normalized.includes("taobat") && normalized.includes("4")) {
      targetTourId = "kashmir-taobat-4d";
    } else if (normalized.includes("kashmir") || normalized.includes("taobat") || normalized.includes("neelum")) {
      targetTourId = "5-days-kashmir-ratti-gali"; // Default Neelum valley package
    }

    // Use history context if no explicit destination is mentioned
    if (!targetTourId && contextDest) {
      targetTourId = contextDest;
    }

    const currentTour = targetTourId ? tourData[targetTourId] : null;

    // B. Contextual actions matching (if we have a resolved tour)
    if (currentTour) {
      // B1. Cost / Price match
      if (normalized.includes("price") || normalized.includes("cost") || normalized.includes("price") || normalized.includes("how much") || normalized.includes("charges") || normalized.includes("fee")) {
        let text = `The pricing details for **${currentTour.title}** are:\n\n`;
        text += `- **Standard Quad Sharing Package**: PKR ${currentTour.price} / head\n`;
        
        if (currentTour.packages && currentTour.packages.length > 0) {
          text += `\nOther package tiers for this tour:\n`;
          currentTour.packages.forEach(pkg => {
            if (pkg.price && pkg.price !== 'N/A') {
              text += `- **${pkg.name}**: PKR ${pkg.price} / head\n`;
            }
          });
        }
        
        if (currentTour.jeepCharges) {
          text += `- **Jeep Excursion Charges**: ${currentTour.jeepCharges}\n`;
        }

        text += `\nGroup tours depart weekly. Would you like to read the day-by-day itinerary or check inclusions?`;

        return {
          text: text,
          suggestions: [
            { text: `📋 Show ${currentTour.duration} itinerary`, query: `Show me the itinerary of ${currentTour.id}` },
            { text: "🏕️ Check inclusions", query: `What is included in ${currentTour.id}` },
            { text: "💳 How to Book?", query: "How to book" }
          ]
        };
      }

      // B2. Itinerary / Schedule match
      if (normalized.includes("itinerary") || normalized.includes("schedule") || normalized.includes("route") || normalized.includes("day 1") || normalized.includes("days detail") || normalized.includes("detail")) {
        let text = `Here is the day-by-day itinerary for **${currentTour.title}**:\n\n`;
        currentTour.itinerary.forEach(day => {
          text += `**${day.day} - ${day.title}**\n${day.desc}\n\n`;
        });
        text += `👉 [View Full Hotel and Route Details Online](${getTourLink(currentTour.id)})`;

        return {
          text: text,
          suggestions: [
            { text: "💵 Check Pricing", query: `What is the price of ${currentTour.id}` },
            { text: "🏕️ Check inclusions", query: `What is included in ${currentTour.id}` },
            { text: "💳 How to Book?", query: "How to book" }
          ]
        };
      }

      // B3. Inclusions / Exclusions match
      if (normalized.includes("include") || normalized.includes("exclude") || normalized.includes("breakfast") || normalized.includes("dinner") || normalized.includes("service") || normalized.includes("hotel")) {
        let text = `For the **${currentTour.title}**, the following are **included** in the tour fee:\n\n`;
        currentTour.inclusions.forEach(inc => {
          text += `- ${inc}\n`;
        });
        
        text += `\n**What's Excluded**:\n\n`;
        currentTour.exclusions.forEach(exc => {
          text += `- ${exc}\n`;
        });

        text += `\nWould you like to check the pricing options or read FAQs?`;

        return {
          text: text,
          suggestions: [
            { text: "💵 Check Pricing", query: `What is the price of ${currentTour.id}` },
            { text: "❓ View FAQs", query: `FAQs for ${currentTour.id}` },
            { text: "💳 How to Book?", query: "How to book" }
          ]
        };
      }

      // B4. FAQs match
      if (normalized.includes("faq") || normalized.includes("question") || normalized.includes("trek") || normalized.includes("walk") || normalized.includes("internet") || normalized.includes("electricity") || normalized.includes("difficult")) {
        let text = `Here are some frequently asked questions for **${currentTour.title}**:\n\n`;
        currentTour.faqs.forEach(faq => {
          text += `**Q: ${faq.q}**\nA: ${faq.a}\n\n`;
        });

        return {
          text: text,
          suggestions: [
            { text: "📋 View Itinerary", query: `Show me the itinerary of ${currentTour.id}` },
            { text: "💵 Check Pricing", query: `What is the price of ${currentTour.id}` },
            { text: "💳 How to Book?", query: "How to book" }
          ]
        };
      }
    }

    // C. General Matches (Website Knowledge Base)

    // C1. Greetings
    if (normalized.match(/^(hello|hi|hey|assalam|salam|helo|greetings|good morning|good evening)/i)) {
      return {
        text: "Assalam-o-Alaikum! 🏔️ Welcome. I am ready to help you plan your journey in Northern Pakistan. \n\nWhich destination are you thinking about visiting? (Hunza, Skardu, Fairy Meadows, Kashmir, Kumrat, or Astore?)",
        suggestions: [
          { text: "🌸 Hunza Valley Tour", query: "Hunza package details" },
          { text: "❄️ Skardu Valley Tour", query: "Skardu package details" },
          { text: "📅 Plan Custom Tour", query: "How can I plan a custom trip?" },
          { text: "💳 How to Book?", query: "How do I book a tour?" }
        ]
      };
    }

    // C2. Custom Tour Planning
    if (normalized.includes("custom") || normalized.includes("plan") || normalized.includes("tailor") || normalized.includes("honeymoon") || normalized.includes("family tour") || normalized.includes("private")) {
      return {
        text: "Looking for a **Private / Customized Tour**? Safar Silsila is a logistics expert in travel planning! We can design custom itineraries tailored to your dates, budget, and group size.\n\n" +
              "- **Services Include**: Dedicated AC transport (Prado, Land Cruiser, Grand Cabin, Coaster), hotel bookings (standard to 5-star luxury), jeep hires, and experienced tour guides.\n" +
              "- **Planning Process**: You fill out our brief custom planning form, and our travel planners will coordinate a direct plan sent via WhatsApp with complete pricing.\n\n" +
              "👉 [Go to Custom Tour Planner](custom-tour.html) to submit your details online, or ask me to prepare a booking inquiry!",
        suggestions: [
          { text: "📅 Go to Custom Planner", query: "I want to fill custom tour form" },
          { text: "🚗 View Transport Rates", query: "What vehicles do you rent?" },
          { text: "📞 Contact Agent via WhatsApp", query: "Give me your WhatsApp contact" }
        ]
      };
    }

    // C3. Transport Rental Services
    if (normalized.includes("transport") || normalized.includes("car") || normalized.includes("rent") || normalized.includes("vehicle") || normalized.includes("prado") || normalized.includes("coaster") || normalized.includes("grand cabin") || normalized.includes("hiace") || normalized.includes("jeep")) {
      return {
        text: "Safar Silsila provides premium **Transport Rental Services** across Pakistan, specializing in Northern Area travels. Our fleet includes:\n\n" +
              "- **Toyota HiAce Grand Cabin** (AC, 11-13 seats) - Ideal for families and small groups.\n" +
              "- **Saloon Coaster** (AC, 20-22 seats) - Best for large groups and office trips.\n" +
              "- **Toyota Prado / Land Cruiser V8** (4x4, 4-6 seats) - Ultimate comfort on mountain tracks.\n" +
              "- **Local Mountain Jeeps (Tz/4x4)** - For off-roading to Deosai, Fairy Meadows, Minimarg, etc.\n\n" +
              "Rentals include dedicated, professional drivers experienced in mountain driving (fuel charges vary based on itinerary).\n\n" +
              "👉 [View Vehicles and Request Quote](transport.html)",
        suggestions: [
          { text: "🚗 Request Transport Quote", query: "Book rental transport" },
          { text: "📅 Plan Custom Tour", query: "Plan custom itinerary with car" },
          { text: "📞 Contact via WhatsApp", query: "WhatsApp number" }
        ]
      };
    }

    // C4. Booking process & Payment Methods
    if (normalized.includes("book") || normalized.includes("payment") || normalized.includes("pay") || normalized.includes("advance") || normalized.includes("deposit") || normalized.includes("bank")) {
      return {
        text: "Booking a tour with Safar Silsila is simple and secure:\n\n" +
              "1. **Choose your package** (Group Tour, Custom Tour, or Transport Rental).\n" +
              "2. **Deposit 50% Advance** of the total tour fee to confirm your booking.\n" +
              "3. **Pay the remaining 50% balance** at the time of departure (or check-in).\n\n" +
              "**Accepted Payment Methods**:\n" +
              "- Bank Account Transfers (HBL, Meezan, Alfalah, etc.)\n" +
              "- Mobile Wallets (EasyPaisa / JazzCash)\n" +
              "- Cash payment at our Islamabad office.\n\n" +
              "Once you make the advance transfer, share the receipt with your designated travel representative, and we will issue your official Booking Confirmation Voucher via email and WhatsApp.",
        suggestions: [
          { text: "📞 Contact Support via WhatsApp", query: "Give me your WhatsApp link to send receipt" },
          { text: "📍 Where is your office?", query: "Where is your office address" },
          { text: "📋 View Group Tours", query: "Show me all tour packages" }
        ]
      };
    }

    // C5. Office Location & Address
    if (normalized.includes("address") || normalized.includes("office") || normalized.includes("location") || normalized.includes("where are you") || normalized.includes("islamabad") || normalized.includes("karachi") || normalized.includes("lahore")) {
      return {
        text: "You are welcome to visit us! Safar Silsila has offices in Islamabad and Karachi:\n\n" +
              "📍 **Islamabad Office**:\n" +
              "Office # 9, First Floor, Aslam Business Square, FECHS E-11/2, Islamabad, Pakistan.\n\n" +
              "📍 **Karachi Office**:\n" +
              "Building #7c Street-3, Office No 2, Badar Commercial, DHA Phase-V, Karachi, Pakistan.\n\n" +
              "🕒 **Timings**: Monday to Saturday, 10:00 AM to 06:00 PM.\n" +
              "📞 **Phone/WhatsApp**: +92 311 1145456\n\n" +
              "Group departures are organized from **Lahore** (Daewoo Terminal, Thokar Niaz Baig) and **Islamabad** (G-11 Metro Station / Highway junction points). Private tours can start from any city of your choice!",
        suggestions: [
          { text: "📞 Contact via WhatsApp", query: "WhatsApp contact number" },
          { text: "📋 View Tours", query: "Show me your group tours" },
          { text: "📅 Plan Custom Tour", query: "Custom tour planning" }
        ]
      };
    }

    // C6. Contact details & Support
    if (normalized.includes("contact") || normalized.includes("phone") || normalized.includes("number") || normalized.includes("email") || normalized.includes("whatsapp") || normalized.includes("support")) {
      return {
        text: "You can reach Safar Silsila through our official channels for instant queries and bookings:\n\n" +
              "- 📞 **Phone & WhatsApp**: [+92 311 1145456](https://wa.me/923111145456)\n" +
              "- ✉️ **Email**: info@safarsilsila.com\n" +
              "- 📍 **Office Addresses**:\n" +
              "  1. *Islamabad*: Office # 9, First Floor, Aslam Business Square, FECHS E-11/2, Islamabad, Pakistan.\n" +
              "  2. *Karachi*: Building #7c Street-3, Office No 2, Badar Commercial, DHA Phase-V, Karachi, Pakistan.\n\n" +
              "Would you like to open a direct WhatsApp chat to book your tour? Just click the link above or let me know!",
        suggestions: [
          { text: "💬 Open Chat in WhatsApp", query: "Open WhatsApp chat" },
          { text: "📅 Plan Custom Tour", query: "Plan a custom trip" },
          { text: "📋 Explore Packages", query: "Show all tours" }
        ]
      };
    }

    // C7. Weather / Seasons / Best Time
    if (normalized.includes("weather") || normalized.includes("season") || normalized.includes("best time") || normalized.includes("month") || normalized.includes("cold") || normalized.includes("clothes")) {
      return {
        text: "The peak travel season for Northern Pakistan (Hunza, Skardu, Astore, Fairy Meadows, Kumrat) is from **May to October** when mountain roads (like Babusar Pass) are open, and temperatures are pleasant (15°C to 25°C during the day).\n\n" +
              "- **Summer (June - Aug)**: Pleasant day weather, but high-altitude spots (like Deosai or Nanga Parbat base camp) can drop to 5°C or lower at night. Lightweight jackets and layering are recommended.\n" +
              "- **Spring/Autumn (May, Sep, Oct)**: Quite cold in the evenings (drops below 0°C in high valleys). Heavy fleece jackets, thermal innerwear, and warm caps are essential.\n" +
              "- **Winter (Nov - April)**: Heavy snowfall. Most high passes are closed, but winter tourism (like snowboarding in Naltar or viewing frozen Attabad Lake) is possible for adventurers.\n\n" +
              "Are you planning a trip in a specific month?",
        suggestions: [
          { text: "📋 View Group Packages", query: "Show all tours" },
          { text: "📅 Plan Custom Tour", query: "How to plan custom tour" },
          { text: "📞 Contact via WhatsApp", query: "WhatsApp contact number" }
        ]
      };
    }

    // C8. Visas
    if (normalized.includes("visa") || normalized.includes("passport") || normalized.includes("foreigner") || normalized.includes("international")) {
      return {
        text: "Pakistan offers an **eVisa service** for citizens of over 170 countries! The online application is straightforward, and processing typically takes between 24 to 48 hours.\n\n" +
              "- **Safar Silsila Assistance**: Upon booking your tour, we provide a complete visa invitation letter (LOI) and guide you through the official government portal.\n" +
              "- **Tourist Friendly**: Visa fees vary by nationality but are generally low. Most tourists get a 30-day single-entry visa initially.\n\n" +
              "Are you planning to travel from outside Pakistan? Let us know your nationality!",
        suggestions: [
          { text: "📞 Contact Support on WhatsApp", query: "WhatsApp visa advice" },
          { text: "📋 View Group Tours", query: "Show group tours" }
        ]
      };
    }

    // C9. Safety
    if (normalized.includes("safe") || normalized.includes("security") || normalized.includes("danger") || normalized.includes("threat")) {
      return {
        text: "Yes, Northern Pakistan is **extremely safe** for both local and international tourists. The mountain regions (Hunza, Skardu, Swat, Kashmir) are famous for their peaceful environments, near-zero crime rates, and warm, welcoming local hospitality.\n\n" +
              "- **Our Standards**: Safar Silsila works only with certified local mountain drivers and vetted accommodations to guarantee a smooth, worry-free trip.\n" +
              "- **Families & Solo Travelers**: Many families, couples, and solo female travelers book group tours with us weekly. Your comfort and security are our highest priorities.\n\n" +
              "Do you have any specific safety questions about a particular destination?",
        suggestions: [
          { text: "📞 Contact Support on WhatsApp", query: "WhatsApp query" },
          { text: "📋 Explore Packages", query: "Show all tours" }
        ]
      };
    }

    // C10. About Safar Silsila
    if (normalized.includes("about") || normalized.includes("safar silsila") || normalized.includes("history") || normalized.includes("found") || normalized.includes("who are you")) {
      return {
        text: "**Safar Silsila** (originally operated as Roamistan in early 2019) is a trusted travel agency headquartered in Islamabad, Pakistan. We specialize in curating outstanding tours across Northern Pakistan, including:\n\n" +
              "- **Group Adventures**: Scheduled weekly departures from Lahore and Islamabad.\n" +
              "- **Custom Itineraries**: Private travel tailored to corporate groups, families, and couples.\n" +
              "- **Reliable Vehicle Rentals**: A diverse fleet with professional mountain drivers.\n\n" +
              "Our mission is to make Pakistan's most beautiful destinations safe, accessible, and unforgettable. Read more about us on our [About Page](about.html)!",
        suggestions: [
          { text: "📋 View Tour Packages", query: "Show all tours" },
          { text: "📞 Contact Support on WhatsApp", query: "WhatsApp contact" }
        ]
      };
    }

    // D. Dynamic Tour Search fallback
    let bestMatch = null;
    let maxMatches = 0;
    
    for (const key in tourData) {
      const tour = tourData[key];
      const keywords = [
        ...tour.title.toLowerCase().split(/[ ,&]+/),
        ...tour.location.toLowerCase().split(/[ ,&]+/),
        ...tour.duration.toLowerCase().split(/[ ,&]+/),
        tour.difficulty.toLowerCase()
      ];
      
      let matchCount = 0;
      keywords.forEach(kw => {
        if (kw && kw.length > 2 && normalized.includes(kw)) {
          matchCount++;
        }
      });

      if (matchCount > maxMatches) {
        maxMatches = matchCount;
        bestMatch = tour;
      }
    }

    if (bestMatch && maxMatches >= 2) {
      let text = `Based on your interest, I recommend checking our **${bestMatch.title}**:\n\n`;
      text += `- **Duration**: ${bestMatch.duration}\n`;
      text += `- **Price**: Starts at **PKR ${bestMatch.price} / head**\n`;
      text += `- **Difficulty**: ${bestMatch.difficulty}\n`;
      text += `- **Highlights**: ${bestMatch.highlights.slice(0, 3).join(", ")}...\n\n`;
      text += `👉 [View Complete Details and Book Here](${getTourLink(bestMatch.id)})`;
      
      return {
        text: text,
        suggestions: [
          { text: `📋 Show ${bestMatch.duration} itinerary`, query: `Show me the itinerary of ${bestMatch.id}` },
          { text: `🏕️ What's included?`, query: `What is included in ${bestMatch.id}` },
          { text: "💳 How to Book?", query: "How do I book" }
        ]
      };
    }

    // E. Absolute Fallback
    return {
      text: "I want to make sure I give you exactly the information you need! \n\nI can tell you all about our group packages to **Hunza, Skardu, Astore, Fairy Meadows, Kashmir, and Kumrat**, or explain how to request a **custom tour itinerary** and **rent vehicles** (Prados, Coasters, Grand Cabins). \n\nWhat would you like to explore?",
      suggestions: fallbackSuggestions
    };
  }

})();
