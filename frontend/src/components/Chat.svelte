<script>
  import { onMount, tick } from 'svelte';
  
  let messages = [];
  let inputMessage = '';
  let isTyping = false;
  let chatContainer;
  let userLocation = '';
  
  // Initialize chat with welcome message
  onMount(() => {
    messages = [
      {
        id: 1,
        type: 'bot',
        content: 'Hello! I\'m SafeFish, your fishing safety assistant. 🐟\n\nI can help you with:\n• Safety equipment and procedures\n• Fishing regulations and licenses\n• Weather conditions for fishing\n• Equipment recommendations\n\nWhat would you like to know?',
        timestamp: new Date()
      }
    ];
    
    // Get user's location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = `${position.coords.latitude},${position.coords.longitude}`;
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }
  });
  
  // Send message to backend
  async function sendMessage() {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };
    
    messages = [...messages, userMessage];
    const messageToSend = inputMessage.trim();
    inputMessage = '';
    
    // Show typing indicator
    isTyping = true;
    await scrollToBottom();
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          location: userLocation
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.message,
        timestamp: new Date(),
        category: data.category,
        responseType: data.type,
        data: data.data
      };
      
      // Simulate typing delay
      setTimeout(() => {
        isTyping = false;
        messages = [...messages, botMessage];
        scrollToBottom();
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date(),
        isError: true
      };
      
      setTimeout(() => {
        isTyping = false;
        messages = [...messages, errorMessage];
        scrollToBottom();
      }, 1000);
    }
  }
  
  // Auto-scroll to bottom
  async function scrollToBottom() {
    await tick();
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
  
  // Handle Enter key
  function handleKeypress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
  
  // Format message content
  function formatMessage(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }
  
  // Quick suggestion buttons
  const quickSuggestions = [
    'Can I go fishing today?',
    'What safety equipment do I need?',
    'Do I need a fishing license?',
    'What are bag limits?'
  ];
  
  function selectSuggestion(suggestion) {
    inputMessage = suggestion;
    sendMessage();
  }
</script>

<div class="flex flex-col h-full bg-white rounded-lg shadow-lg">
  <!-- Header -->
  <div class="flex items-center justify-between p-4 bg-gradient-to-r from-ocean-600 to-ocean-700 text-white rounded-t-lg">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 rounded-full overflow-hidden shadow-md animate-float">
        <img src="/safefish-logo.png" alt="SafeFish Logo" class="w-full h-full object-cover" />
      </div>

      <div>
        <h1 class="text-xl font-bold">SafeFish</h1>
        <p class="text-sm text-ocean-200">Your Fishing Safety Assistant</p>
      </div>
    </div>
    <div class="text-right">
      <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      <span class="text-xs text-ocean-200">Online</span>
    </div>
  </div>
  
  <!-- Messages Container -->
  <div class="flex-1 overflow-y-auto p-4 space-y-4 chat-container" bind:this={chatContainer}>
    {#each messages as message (message.id)}
      <div class="flex {message.type === 'user' ? 'justify-end' : 'justify-start'}">
        <div class="flex items-end space-x-2 max-w-full">
          {#if message.type === 'bot'}
            <div class="w-8 h-8 bg-ocean-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white text-sm">🤖</span>
            </div>
          {/if}
          
          <div class="flex flex-col {message.type === 'user' ? 'items-end' : 'items-start'}">
            <div class="{message.type === 'user' ? 'user-message' : 'bot-message'} {message.isError ? 'bg-red-100 border-red-200 text-red-800' : ''}">
              {#if message.responseType === 'weather' && message.data}
                <div class="weather-card mb-2">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-semibold">📍 {message.data.location}</span>
                    <span class="{message.data.isSafe ? 'bg-green-500' : 'bg-red-500'} px-2 py-1 rounded-full text-xs">
                      {message.data.isSafe ? '✅ Safe' : '⚠️ Unsafe'}
                    </span>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div>🌡️ {message.data.temperature}°C</div>
                    <div>💨 {message.data.windSpeed} km/h</div>
                  </div>
                </div>
              {/if}
              
              <div class="prose prose-sm max-w-none">
                {@html formatMessage(message.content)}
              </div>
              
              {#if message.category}
                <div class="mt-2 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600 inline-block">
                  {message.category}
                </div>
              {/if}
            </div>
            
            <div class="text-xs text-gray-500 mt-1">
              {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
          
          {#if message.type === 'user'}
            <div class="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white text-sm">👤</span>
            </div>
          {/if}
        </div>
      </div>
    {/each}
    
    <!-- Typing Indicator -->
    {#if isTyping}
      <div class="flex justify-start">
        <div class="flex items-end space-x-2">
          <div class="w-8 h-8 bg-ocean-500 rounded-full flex items-center justify-center">
            <span class="text-white text-sm">🤖</span>
          </div>
          <div class="bg-gray-100 rounded-2xl px-4 py-2">
            <div class="typing-indicator">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Quick Suggestions (show only if no messages yet or few messages) -->
  {#if messages.length <= 2}
    <div class="px-4 py-2 border-t border-gray-200">
      <p class="text-sm text-gray-600 mb-2">Try asking:</p>
      <div class="flex flex-wrap gap-2">
        {#each quickSuggestions as suggestion}
          <button 
            class="px-3 py-1 bg-ocean-100 text-ocean-700 rounded-full text-sm hover:bg-ocean-200 transition-colors"
            on:click={() => selectSuggestion(suggestion)}
          >
            {suggestion}
          </button>
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Input Area -->
  <div class="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
    <div class="flex items-end space-x-2">
      <div class="flex-1 min-w-0">
        <textarea
          bind:value={inputMessage}
          on:keypress={handleKeypress}
          placeholder="Ask me about fishing safety, regulations, or weather..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 resize-none"
          rows="1"
          style="max-height: 120px; overflow-y: auto;"
        ></textarea>
      </div>
      <button
        on:click={sendMessage}
        disabled={!inputMessage.trim() || isTyping}
        class="px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span class="sr-only">Send message</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
        </svg>
      </button>
    </div>
    
    <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
      <span>Press Enter to send, Shift+Enter for new line</span>
      {#if userLocation}
        <span class="flex items-center">
          <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          Location enabled
        </span>
      {/if}
    </div>
  </div>
</div>