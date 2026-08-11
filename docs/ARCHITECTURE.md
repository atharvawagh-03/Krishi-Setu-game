# SmartFarm Tycoon – Architecture Overview

## Overview
SmartFarm Tycoon follows a 3-tier microservice-inspired architecture:

```
[ Frontend (React + Vite) ] <---> [ Backend API (Node.js + Express) ] <---> [ AI Service (Python Flask) ]
                                          |
                                          v
                                 [ MongoDB Atlas ]
```

## Layers

1. **Frontend**: SPA built with React 18, Vite, Tailwind CSS, Framer Motion, Zustand state management, and Recharts.
2. **Backend**: Express.js REST API handling game state synchronization, crop growth timers, XP progression, and harvest tracking using Mongoose models.
3. **AI Microservice**: Flask API with pre-trained RandomForest models for crop prediction and profit estimation based on weather and soil data.
4. **Database**: MongoDB for persistent user stats, plot states, and harvest analytics logs.
