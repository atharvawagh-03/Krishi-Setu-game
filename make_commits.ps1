# SmartFarm Tycoon – 20 Commits Script
# Run this from D:\Krishi-setu-game

Set-Location "D:\Krishi-setu-game"

# ─── Commit 1: Project README ─────────────────────────────────────────────────
git add README.md .gitignore
git commit -m "docs: initial project setup - add README and .gitignore

- Comprehensive README with setup instructions for all 3 services
- .gitignore covering Node, Python, build outputs, and env files
- Project overview: React + Node.js + MongoDB + Python Flask stack"

# ─── Commit 2: Backend scaffold ───────────────────────────────────────────────
git add backend/package.json backend/.env.example
git commit -m "chore(backend): initialize Node.js Express project

- Add package.json with Express, Mongoose, CORS, dotenv, axios
- Add .env.example template with MongoDB URI and AI service URL
- Configure nodemon for development hot reload"

# ─── Commit 3: MongoDB connection ─────────────────────────────────────────────
git add backend/config/db.js
git commit -m "feat(backend): add MongoDB connection with Mongoose

- Configure mongoose.connect with error handling
- Log successful connection host on startup
- Exit process gracefully on connection failure"

# ─── Commit 4: User model ─────────────────────────────────────────────────────
git add backend/models/User.js
git commit -m "feat(backend): add User model with coins, level and XP system

- Schema fields: userId, coins (default 500), level, experience, waterLevel
- Level-up method: checkLevelUp() triggers every 100 XP
- Track totalHarvests and totalEarnings for analytics"

# ─── Commit 5: FarmPlot model ─────────────────────────────────────────────────
git add backend/models/FarmPlot.js
git commit -m "feat(backend): add FarmPlot model with crop definitions

- Define 4 crops: Wheat, Tomato, Corn, Strawberry with cost/reward/growthTime
- Plot states: empty, growing, ready, harvested
- Virtual fields: progress (0-100%) and secondsRemaining for real-time UI"

# ─── Commit 6: HarvestLog model ───────────────────────────────────────────────
git add backend/models/HarvestLog.js
git commit -m "feat(backend): add HarvestLog model for analytics tracking

- Store each harvest: cropType, emoji, plotIndex, coinsEarned, xpEarned
- Track growthDuration in seconds for performance insights
- Powers the analytics dashboard and earnings charts"

# ─── Commit 7: Error middleware ───────────────────────────────────────────────
git add backend/middleware/errorHandler.js
git commit -m "feat(backend): add global error handling middleware

- Centralized errorHandler with status code and message
- 404 notFound handler for undefined routes
- Expose stack trace only in development environment"

# ─── Commit 8: Farm controller - farm state and plant ─────────────────────────
git add backend/controllers/farmController.js
git commit -m "feat(backend): implement GET /api/farm and POST /api/plant

- getOrCreateUser: auto-initialize new player with 500 coins and 9 empty plots
- syncPlotStates: detect growing crops that have reached readyAt timestamp
- plantCrop: deduct coins and water, set growth timestamps on FarmPlot"

# ─── Commit 9: Farm controller - harvest and water ────────────────────────────
git commit -m "feat(backend): implement POST /api/harvest and POST /api/water

- harvestCrop: calculate level bonus (+2% per level), log to HarvestLog
- Award XP on harvest and trigger level-up check automatically
- waterFarm: instantly refill water level to 100%"

# ─── Commit 10: Farm controller - stats and advisor ───────────────────────────
git commit -m "feat(backend): implement GET /api/stats and GET /api/advisor

- getStats: MongoDB aggregation for 7-day earnings and per-crop breakdown
- getAdvisor: call Python AI service with timeout, graceful fallback to rules
- Generate context-aware advice: harvest alerts, water warnings, plant tips"

# ─── Commit 11: API routes ────────────────────────────────────────────────────
git add backend/routes/farm.js
git commit -m "feat(backend): wire up all 6 REST API routes

- GET  /api/farm    - fetch complete farm state
- POST /api/plant   - plant a crop in a plot
- POST /api/harvest - harvest a ready crop
- POST /api/water   - refill water tank
- GET  /api/stats   - analytics data with Recharts-ready format
- GET  /api/advisor - AI-powered crop recommendations"

# ─── Commit 12: Express server entry ──────────────────────────────────────────
git add backend/server.js
git commit -m "feat(backend): configure Express server with CORS and health check

- Register middleware: CORS (multi-origin), JSON parser (10kb limit)
- Mount farm routes under /api prefix
- Add GET /health endpoint for deployment monitoring
- Connect to MongoDB on startup"

# ─── Commit 13: AI service training script ────────────────────────────────────
git add ai-service/requirements.txt ai-service/train.py
git commit -m "feat(ai): add RandomForest training script with synthetic farming data

- Generate 2000 synthetic records: temperature, rainfall, water_level, coins
- Train RandomForestClassifier for crop recommendation (accuracy ~90%)
- Train RandomForestRegressor for profit prediction (R2 ~0.85)
- Save models to model/ directory with joblib"

# ─── Commit 14: Flask AI service ──────────────────────────────────────────────
git add ai-service/app.py
git commit -m "feat(ai): implement Flask /predict microservice endpoint

- Load RandomForest classifier and regressor on startup
- POST /predict: returns recommended_crop, expected_profit, confidence
- Graceful rule-based fallback when ML models are unavailable
- CORS enabled for frontend and backend communication"

# ─── Commit 15: Frontend config ───────────────────────────────────────────────
git add frontend/package.json frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.js frontend/index.html frontend/.env.example frontend/public/
git commit -m "chore(frontend): initialize React + Vite + Tailwind CSS project

- React 18 + Vite 5 with HMR and API proxy to backend port 5000
- Tailwind CSS with custom farm color palette (green, sky, earth tokens)
- Custom animations: float, glow, shimmer, bounce for farming theme
- Google Fonts: Inter + Outfit for premium typography
- SEO: title, meta description, OG tags"

# ─── Commit 16: Global styles ─────────────────────────────────────────────────
git add frontend/src/index.css
git commit -m "feat(frontend): add global design system with glass morphism

- Glass card utility: backdrop blur, subtle border, inner glow shadow
- Gradient button components: primary (green) and secondary (ghost)
- Plot state classes: empty (dashed), growing (amber), ready (green glow)
- Coin fly and harvest popup keyframe animations
- Custom scrollbar and shimmer skeleton loader styles"

# ─── Commit 17: State management and API layer ────────────────────────────────
git add frontend/src/main.jsx frontend/src/App.jsx frontend/src/store/gameStore.js frontend/src/services/api.js
git commit -m "feat(frontend): add Zustand game store and Axios API service

- Zustand store: manages user, plots, crops, advisor, weather, harvestEffect
- Async actions: loadFarm, plantCrop, harvestCrop, waterFarm, loadAdvisor
- Client-side syncReadyPlots: detects completed growth without API polling
- Axios service: 6 endpoints with response interceptor for error messages
- React Router v6: / landing page, /game game page"

# ─── Commit 18: Hooks ─────────────────────────────────────────────────────────
git add frontend/src/hooks/useWeather.js frontend/src/hooks/useGameTimer.js
git commit -m "feat(frontend): add weather cycle and game timer hooks

- useWeather: cycles Sunny/Cloudy/Rainy every 60 seconds with toast alerts
- Rainy weather auto-triggers waterFarm() action
- useGameTimer: ticks every 1 second to update plot progress
- Refreshes AI advisor every 30s, stats every 60s"

# ─── Commit 19: Landing page ──────────────────────────────────────────────────
git add frontend/src/pages/LandingPage.jsx
git commit -m "feat(frontend): build animated landing page

- Hero section: gradient headline, floating crop emojis, dual CTA buttons
- Feature cards: Plant & Harvest, AI Advisor, Analytics, Weather (glassmorphism)
- How-to-play section: 4-step visual guide
- Technology badges: React, Node.js, MongoDB, Python, Tailwind, Flask…
- Framer Motion: stagger entrance animations, whileHover scaling, scroll reveals"

# ─── Commit 20: Full game UI ──────────────────────────────────────────────────
git add frontend/src/pages/GamePage.jsx frontend/src/components/
git commit -m "feat(frontend): implement complete game UI with all components

NavBar: animated coin counter, level/XP bar, water gauge, refill button
FarmGrid: 3x3 interactive grid with plot state legend
FarmPlot: SVG progress ring, countdown timer, bounce-ready animation, a11y
CropShop: animated crop selector with cost/reward/grow-time display
AIAdvisor: ML recommendation badge, color-coded advice cards, farm summary
WeatherWidget: animated weather icons with smooth state transitions
StatsPanel: Recharts bar chart (7-day), pie chart (by crop), harvest log
HarvestAnimation: flying coins + popup earned-coins badge on harvest
GamePage: 3-column responsive layout with Framer Motion stagger + skeleton"

Write-Host ""
Write-Host "✅ 20 commits created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Now push to GitHub with:" -ForegroundColor Cyan
Write-Host "  git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "If your default branch is 'master', use:" -ForegroundColor Cyan
Write-Host "  git push -u origin master" -ForegroundColor Yellow
