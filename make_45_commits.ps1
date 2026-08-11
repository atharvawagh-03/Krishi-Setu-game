# PowerShell script to create 45 atomic, professional commits for SmartFarm Tycoon

Set-Location "D:\Krishi-setu-game"

# Ensure git is initialized and user is set
git init
git config user.name "atharvawagh-03"
git config user.email "atharvawagh@example.com"

# Commit 1
git add README.md
git commit -m "docs: add comprehensive project README.md"

# Commit 2
git add .gitignore
git commit -m "chore: setup root gitignore rules"

# Commit 3
git add LICENSE
git commit -m "docs: add MIT open source license"

# Commit 4
git add CONTRIBUTING.md
git commit -m "docs: add contribution guidelines"

# Commit 5
git add docs/API_DOCUMENTATION.md
git commit -m "docs: document REST API endpoints and data schemas"

# Commit 6
git add docs/ARCHITECTURE.md
git commit -m "docs: define 3-tier system architecture overview"

# Commit 7
git add backend/package.json
git commit -m "chore(backend): initialize package.json dependencies"

# Commit 8
git add backend/.env.example
git commit -m "chore(backend): add environment variable configuration template"

# Commit 9
git add backend/config/db.js
git commit -m "feat(backend): configure MongoDB database connection logic"

# Commit 10
git add backend/models/User.js
git commit -m "feat(backend): implement User schema with XP and leveling logic"

# Commit 11
git add backend/models/FarmPlot.js
git commit -m "feat(backend): implement FarmPlot schema with crop definitions and growth timers"

# Commit 12
git add backend/models/HarvestLog.js
git commit -m "feat(backend): implement HarvestLog schema for analytics tracking"

# Commit 13
git add backend/middleware/errorHandler.js
git commit -m "feat(backend): add central error handling and 404 middleware"

# Commit 14
git add backend/controllers/farmController.js
git commit -m "feat(backend): implement core farm controller logic for planting, harvesting, and stats"

# Commit 15
git add backend/routes/farm.js
git commit -m "feat(backend): register farm REST API endpoints"

# Commit 16
git add backend/server.js
git commit -m "feat(backend): set up Express server entry point with middleware and CORS"

# Commit 17
git add ai-service/requirements.txt
git commit -m "chore(ai): add Python microservice requirements"

# Commit 18
git add ai-service/train.py
git commit -m "feat(ai): add synthetic data generation and RandomForest training script"

# Commit 19
git add ai-service/app.py
git commit -m "feat(ai): implement Flask prediction service endpoint with fallback logic"

# Commit 20
git add frontend/package.json
git commit -m "chore(frontend): initialize Vite + React project dependencies"

# Commit 21
git add frontend/vite.config.js
git commit -m "chore(frontend): configure Vite build options and proxy settings"

# Commit 22
git add frontend/tailwind.config.js
git commit -m "style(frontend): configure Tailwind CSS theme tokens and keyframes"

# Commit 23
git add frontend/postcss.config.js
git commit -m "chore(frontend): add PostCSS configuration"

# Commit 24
git add frontend/.env.example
git commit -m "chore(frontend): add frontend environment template"

# Commit 25
git add frontend/index.html
git commit -m "feat(frontend): set up HTML template with fonts and metadata"

# Commit 26
git add frontend/public/favicon.svg
git commit -m "style(frontend): add crop emoji favicon asset"

# Commit 27
git add frontend/src/index.css
git commit -m "style(frontend): build global glassmorphism and animation utility classes"

# Commit 28
git add frontend/src/main.jsx
git commit -m "feat(frontend): set up React DOM root entry point"

# Commit 29
git add frontend/src/services/api.js
git commit -m "feat(frontend): implement Axios API client service module"

# Commit 30
git add frontend/src/store/gameStore.js
git commit -m "feat(frontend): implement Zustand store for game state management"

# Commit 31
git add frontend/src/hooks/useWeather.js
git commit -m "feat(frontend): implement weather simulation hook with auto-watering"

# Commit 32
git add frontend/src/hooks/useGameTimer.js
git commit -m "feat(frontend): implement real-time plot timer hook"

# Commit 33
git add frontend/src/components/NavBar.jsx
git commit -m "feat(frontend): build NavBar component with resource counters"

# Commit 34
git add frontend/src/components/FarmPlot.jsx
git commit -m "feat(frontend): build FarmPlot component with growth progress ring"

# Commit 35
git add frontend/src/components/FarmGrid.jsx
git commit -m "feat(frontend): build 3x3 interactive FarmGrid component"

# Commit 36
git add frontend/src/components/CropShop.jsx
git commit -m "feat(frontend): build CropShop selector component"

# Commit 37
git add frontend/src/components/WeatherWidget.jsx
git commit -m "feat(frontend): build WeatherWidget display component"

# Commit 38
git add frontend/src/components/AIAdvisor.jsx
git commit -m "feat(frontend): build AIAdvisor recommendation dashboard card"

# Commit 39
git add frontend/src/components/StatsPanel.jsx
git commit -m "feat(frontend): build StatsPanel component with Recharts analytics"

# Commit 40
git add frontend/src/components/HarvestAnimation.jsx
git commit -m "feat(frontend): build particle coin harvest animation component"

# Commit 41
git add frontend/src/pages/LandingPage.jsx
git commit -m "feat(frontend): build feature-rich LandingPage view"

# Commit 42
git add frontend/src/pages/GamePage.jsx
git commit -m "feat(frontend): build main GamePage layout and integration"

# Commit 43
git add frontend/src/App.jsx
git commit -m "feat(frontend): assemble App root router and toast provider"

# Commit 44
git add vercel.json
git commit -m "chore(deploy): add Vercel deployment configuration"

# Commit 45
git add render.yaml
git commit -m "chore(deploy): add Render blueprint deployment configuration"

Write-Host "Done generating 45 commits!"
