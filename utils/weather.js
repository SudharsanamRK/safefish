const axios = require('axios');
require('dotenv').config(); // Load env variables

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
/**
 * Checks if current weather conditions are safe for fishing
 * @param {string} location - Location for weather check (city name or coordinates)
 * @returns {Object} Weather safety assessment
 */
async function checkFishingWeather(location = 'New York') {
  try {
    // Make API call to OpenWeatherMap
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        q: location,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const weather = response.data;
    const { main, weather: conditions, wind } = weather;
    
    // Extract relevant weather data
    const temperature = main.temp;
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    const weatherCondition = conditions[0].main.toLowerCase();
    const description = conditions[0].description;

    // Determine safety based on conditions
    const safetyAssessment = assessFishingSafety({
      temperature,
      humidity,
      windSpeed,
      weatherCondition,
      description
    });

    return {
      location: weather.name,
      temperature: Math.round(temperature),
      condition: description,
      windSpeed: Math.round(windSpeed),
      humidity,
      isSafe: safetyAssessment.isSafe,
      recommendation: safetyAssessment.recommendation,
      warnings: safetyAssessment.warnings
    };

  } catch (error) {
    console.error('Weather API error:', error.message);
    
    // Return mock data if API fails
    return {
      location: location,
      temperature: 22,
      condition: 'partly cloudy',
      windSpeed: 8,
      humidity: 65,
      isSafe: true,
      recommendation: 'Weather data unavailable. Please check local conditions before fishing.',
      warnings: ['Unable to fetch real-time weather data']
    };
  }
}

/**
 * Assesses fishing safety based on weather conditions
 * @param {Object} conditions - Weather conditions object
 * @returns {Object} Safety assessment
 */
function assessFishingSafety(conditions) {
  const { temperature, windSpeed, weatherCondition, description } = conditions;
  
  const warnings = [];
  let isSafe = true;
  let recommendation = '';

  // Check for dangerous conditions
  if (weatherCondition.includes('thunderstorm') || weatherCondition.includes('storm')) {
    isSafe = false;
    warnings.push('Thunderstorm conditions - lightning risk');
    recommendation = 'DO NOT fish during thunderstorms. Wait until conditions improve.';
  } else if (windSpeed > 25) {
    isSafe = false;
    warnings.push('High wind conditions - rough waters');
    recommendation = 'Avoid fishing in high winds. Consider sheltered areas or wait for calmer conditions.';
  } else if (temperature < 0) {
    isSafe = false;
    warnings.push('Freezing temperatures - hypothermia risk');
    recommendation = 'Extreme cold conditions. Use proper cold weather gear and fish with others.';
  } else if (weatherCondition.includes('rain') && windSpeed > 15) {
    isSafe = false;
    warnings.push('Heavy rain and wind combination');
    recommendation = 'Combined rain and wind create challenging conditions. Consider postponing.';
  } else if (windSpeed > 15) {
    warnings.push('Moderate wind conditions');
    recommendation = 'Fishing conditions are challenging but manageable. Use caution and wear proper safety gear.';
  } else if (temperature > 35) {
    warnings.push('High temperature - heat exhaustion risk');
    recommendation = 'Hot weather conditions. Stay hydrated, seek shade, and avoid prolonged sun exposure.';
  } else {
    recommendation = 'Good fishing conditions! Remember to wear your life jacket and check local regulations.';
  }

  return {
    isSafe,
    recommendation,
    warnings
  };
}

/**
 * Determines if a user query is weather-related
 * @param {string} message - User message
 * @returns {boolean} Whether the message is weather-related
 */
function isWeatherQuery(message) {
  const weatherKeywords = [
    'weather', 'fishing today', 'go fishing', 'safe to fish',
    'conditions', 'storm', 'rain', 'wind', 'temperature',
    'today', 'now', 'currently', 'outside'
  ];
  
  const lowerMessage = message.toLowerCase();
  return weatherKeywords.some(keyword => lowerMessage.includes(keyword));
}

module.exports = {
  checkFishingWeather,
  isWeatherQuery
};