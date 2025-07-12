<script>
  import Chat from './components/Chat.svelte';
  import './app.css';
  
  let appName = 'SafeFish';
  let appVersion = '1.0.0';
</script>

<svelte:head>
  <title>{appName} - Fishing Safety Assistant</title>
  <meta name="description" content="SafeFish helps fishermen stay safe with weather updates, safety tips, and fishing regulations" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-ocean-50 via-ocean-100 to-ocean-200 p-4">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <header class="text-center mb-6">
      <div class="flex items-center justify-center space-x-3 mb-2">
        <!-- Replace emoji with your logo -->
        <img src="/safefish-logo.png" alt="SafeFish Logo" class="w-12 h-12 rounded-full shadow-md animate-fade-in" />
        <h1 class="text-4xl font-bold text-gray-800">SafeFish</h1>
      </div>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Your intelligent fishing safety companion. Get real-time weather updates, safety guidelines, and fishing regulations all in one place.
      </p>
    </header>
    
    <!-- Main Chat Interface -->
    <div class="bg-white rounded-xl shadow-xl overflow-hidden" style="height: 600px;">
      <Chat />
    </div>
    
    <!-- Footer -->
    <footer class="mt-6 text-center text-sm text-gray-500">
      <div class="flex items-center justify-center space-x-4 mb-2">
        <span class="flex items-center">
          <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          API Connected
        </span>
        <span>•</span>
        <span>Version {appVersion}</span>
        <span>•</span>
        <span>Built with Svelte & Node.js</span>
      </div>
      <p class="text-xs">
        Always follow local regulations and use proper safety equipment. This assistant provides guidance but doesn't replace professional advice.
      </p>
    </footer>
  </div>
</main>

<style>
  :global(body) {
    font-family: 'Inter', system-ui, sans-serif;
  }

  main {
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fade-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .animate-fade-in {
    animation: fade-in 0.4s ease-out;
  }
</style>
