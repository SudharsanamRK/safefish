const express = require('express');
const Fuse = require('fuse.js');
const { checkFishingWeather, isWeatherQuery } = require('../utils/weather');
const knowledgeBase = require('../data/knowledgeBase.json');

const router = express.Router();

// Prepare search data for fuzzy matching
const searchData = [];
Object.keys(knowledgeBase).forEach(category => {
  knowledgeBase[category].forEach(item => {
    searchData.push({
      ...item,
      category
    });
  });
});

// Configure Fuse.js for fuzzy searching
const fuseOptions = {
  keys: ['keywords', 'question', 'answer'],
  threshold: 0.4,
  includeScore: true
};

const fuse = new Fuse(searchData, fuseOptions);

// Sample fallback suggestions
const fallbackSuggestions = [
  "What safety equipment do I need?",
  "Do I need a fishing license?",
  "What are bag limits?",
  "Can I go fishing today?",
  "What weather is safe for fishing?",
  "Is it okay to fish during rain?"
];

/**
 * Main chatbot endpoint
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, location } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    console.log(`Processing message: "${message}"`);

    // Weather query check
    if (isWeatherQuery(message)) {
      const weatherData = await checkFishingWeather(location);
      const response = {
        type: 'weather',
        message: formatWeatherResponse(weatherData),
        data: weatherData
      };
      return res.json(response);
    }

    // Knowledge base fuzzy search
    const searchResults = fuse.search(message);

    if (searchResults.length > 0) {
      const bestMatch = searchResults[0];
      if (bestMatch.score < 0.6) {
        return res.json({
          type: 'knowledge',
          message: bestMatch.item.answer,
          category: bestMatch.item.category,
          confidence: Math.round((1 - bestMatch.score) * 100)
        });
      }
    }

    // Friendly fallback (updated here ✅)
    const fallbackResponse = {
      type: 'fallback',
      message: `That’s an interesting question! I mostly help with fishing safety, equipment, regulations, and weather info. 🎣\n\nTry asking about things like:\n- Life jackets\n- Bag limits\n- Fishing during storms\n\nOr pick one of these:`,
      suggestions: getRandomSuggestions(3)
    };

    return res.json(fallbackResponse);

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong processing your request. Please try again.'
    });
  }
});

/**
 * Utility: Get random fallback suggestions
 */
function getRandomSuggestions(count = 3) {
  const shuffled = [...fallbackSuggestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Formats weather data into a user-friendly response
 */
function formatWeatherResponse(weatherData) {
  const { location, temperature, condition, windSpeed, isSafe, recommendation, warnings } = weatherData;

  let response = `🌤️ **Weather Report for ${location}**\n\n`;
  response += `**Current Conditions:**\n`;
  response += `• Temperature: ${temperature}°C\n`;
  response += `• Condition: ${condition}\n`;
  response += `• Wind Speed: ${windSpeed} km/h\n\n`;

  response += isSafe ? `✅ **Safe to Fish**\n` : `⚠️ **NOT Safe to Fish**\n`;
  response += `**Recommendation:** ${recommendation}\n`;

  if (warnings.length > 0) {
    response += `\n**Warnings:**\n`;
    warnings.forEach(warning => {
      response += `• ${warning}\n`;
    });
  }

  response += `\n*Always check local conditions and use proper safety equipment.*`;
  return response;
}

// Category info endpoint
router.get('/categories', (req, res) => {
  const categories = Object.keys(knowledgeBase).map(category => ({
    name: category,
    count: knowledgeBase[category].length
  }));
  res.json(categories);
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    knowledgeBase: {
      totalEntries: searchData.length,
      categories: Object.keys(knowledgeBase).length
    }
  });
});

module.exports = router;
