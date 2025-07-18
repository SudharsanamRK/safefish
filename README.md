# SafeFish - Fishing Safety Chatbot

A web-based chatbot application that provides fishing safety information, weather updates, and regulation guidance to help fishermen stay safe on the water.

---

## Features

- **Intelligent Chat Interface**: Clean, responsive chat UI built with Svelte
- **Safety Information**: Knowledge base covering life jackets, emergency procedures, first aid
- **Fishing Regulations**: Info on licenses, bag limits, size restrictions, prohibited gear
- **Weather Integration**: Real-time safety assessment using OpenWeatherMap API
- **Equipment Guidance**: Gear recommendations and tackle tips
- **Fuzzy Search**: Smart keyword matching using Fuse.js
- **Location-Aware**: Optional geolocation for accurate weather data

---

## Tech Stack

### Backend
- Node.js with Express.js
- Fuse.js for fuzzy search
- Axios for API requests
- CORS for cross-origin support

### Frontend
- Svelte for reactive components
- Tailwind CSS for modern styling
- Vite for lightning-fast builds

---

## Project Structure
```
safefish/
├── backend/
│ ├── server.js # Main Express server
│ ├── routes/chatbot.js # Chat API routes
│ ├── utils/weather.js # Weather API integration
│ ├── data/knowledgeBase.json # Q&A knowledge base
│ └── package.json # Backend dependencies
└── frontend/
├── src/
│ ├── App.svelte # Main app component
│ ├── components/Chat.svelte # Chat interface
│ ├── main.js # App entry point
│ └── app.css # Global styles
├── public/
├── index.html # HTML template
├── vite.config.js # Vite configuration
├── tailwind.config.js # Tailwind configuration
└── package.json # Frontend dependencies
```
---

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- [OpenWeatherMap API key](https://openweathermap.org/api)

---

## Backend Setup

1. **Create folders**:
   ```bash
   mkdir -p safefish/backend/{routes,utils,data}
   cd safefish/backend
   ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure weather API:**
    ```bash
    - Open utils/weather.js
    - Replace 'your-openweathermap-api-key' with your actual API key
    ```

4. **Run backend server:**
    ```bash
    npm run dev
    ```
    > Backend will run at: http://localhost:3001


---

##  Frontend Setup

### Create frontend folders:
   
    ```bash
    mkdir -p safefish/frontend/src/components
    cd safefish/frontend
    ```
### Install dependencies:
   
    ```bash
    npm install
    ```

### Run development server:
    
    ```bash
    npm run dev
     ```
    > Frontend will run at: http://localhost:5173

---

## Usage

### Start both servers:

    ```bash
    # In /backend
    npm run dev

    # In /frontend
    npm run dev
    ```
   > Open your browser and navigate to: http://localhost:5173

---

## Sample Queries

- "Can I go fishing today?" (weather-based)

- "What safety equipment do I need?"

- "Do I need a fishing license?"

- "What are bag limits?"

- "What should I do in a storm?"

---

## API Endpoints

### POST /api/chat
  Send a message to the chatbot

    ```json
    {
      "message": "Can I go fishing today?",
      "location": "New York" // optional
    }  
    ```

### GET /api/categories
Retrieve available knowledge base categories

### GET /api/health
Health check for backend

---

## Configuration

### Weather API

In backend/utils/weather.js, set your API key:

    ```js
    const API_KEY = 'your-actual-api-key-here';
    ```

### Knowledge Base

Extend backend/data/knowledgeBase.json like so:

    ```json
    {
      "category": [
        {
          "keywords": ["keyword1", "keyword2"],
          "question": "Sample question?",
          "answer": "Detailed answer here."
        }
      ]
    }
    ```

---

## Deployment

1. **Backend**

  Set environment variables:
  - PORT (default: 3001)
  - OPENWEATHER_API_KEY

1. Start backend:

    ```bash
    npm start
    ```

2. **Frontend**

  Build production frontend:

    ```bash
    npm run build
    ```
    Deploy /dist folder to your hosting platform

---

##  Features in Detail

### Weather Assessment
Evaluates fishing conditions using:

- **Temperature** (hypothermia/heat stroke risks)
- **Wind speed** (turbulent waters)
- **Weather type** (stormy/rainy)

### Smart Fuzzy Matching
Powered by **Fuse.js**:

- Matches keywords, questions, and answers
- Handles typos and partial inputs
- Returns best match with confidence

### Responsive Design

- Mobile-first layout  
- Touch-friendly components  
- Accessible and color-contrast compliant  

---

## Ouput

<img width="1919" height="973" alt="image" src="https://github.com/user-attachments/assets/ecdf4ce1-fa96-4774-bb7a-c46f103640ff" />


## Contributing

1. **Fork** the repository  
2. Create a **feature branch**  
3. **Add your changes**  
4. **Test thoroughly**  
5. **Submit a pull request**
