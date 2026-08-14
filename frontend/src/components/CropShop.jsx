import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

const CROP_LIST = [
  { key: 'wheat',      emoji: '🌾', name: 'Wheat',      color: 'from-amber-500/20 to-yellow-500/10',  border: 'border-amber-500/30',  badge: 'bg-amber-500/20 text-amber-300',  tag: 'Beginner',  cost: 20,  reward: 40,  growthTime: 30,  season: 'winter',  waterCost: 5 },
  { key: 'tomato',     emoji: '🍅', name: 'Tomato',     color: 'from-red-500/20 to-rose-500/10',      border: 'border-red-500/30',     badge: 'bg-red-500/20 text-red-300',      tag: 'Popular',    cost: 50,  reward: 95,  growthTime: 60,  season: 'summer',  waterCost: 8 },
  { key: 'corn',       emoji: '🌽', name: 'Corn',       color: 'from-yellow-500/20 to-orange-500/10', border: 'border-yellow-500/30',  badge: 'bg-yellow-500/20 text-yellow-300', tag: 'Balanced',   cost: 80,  reward: 160, growthTime: 120, season: 'monsoon', waterCost: 10 },
  { key: 'strawberry', emoji: '🍓', name: 'Strawberry', color: 'from-pink-500/20 to-fuchsia-500/10',  border: 'border-pink-500/30',    badge: 'bg-pink-500/20 text-pink-300',     tag: 'Premium',    cost: 120, reward: 280, growthTime: 180, season: 'spring',  waterCost: 12 },
  { key: 'sunflower',  emoji: '🌻', name: 'Sunflower',  color: 'from-amber-200/20 to-yellow-400/10', border: 'border-amber-400/30', badge: 'bg-amber-500/20 text-amber-300', tag: 'Sunshine',   cost: 100, reward: 220, growthTime: 150, season: 'summer',  waterCost: 9 },
  { key: 'rice',       emoji: '🌾', name: 'Rice',       color: 'from-emerald-500/20 to-lime-500/10', border: 'border-emerald-400/30', badge: 'bg-emerald-500/20 text-emerald-300', tag: 'Wetland', cost: 60, reward: 130, growthTime: 110, season: 'monsoon', waterCost: 14 },
  { key: 'potato',     emoji: '🥔', name: 'Potato',     color: 'from-purple-500/20 to-violet-500/10', border: 'border-violet-400/30', badge: 'bg-violet-500/20 text-violet-300', tag: 'Root', cost: 70, reward: 150, growthTime: 130, season: 'winter', waterCost: 11 },
  { key: 'spinach',    emoji: '🌿', name: 'Spinach',    color: 'from-green-500/20 to-emerald-500/10', border: 'border-green-400/30', badge: 'bg-green-500/20 text-green-300', tag: 'Leafy', cost: 45, reward: 90, growthTime: 70, season: 'spring', waterCost: 7 },
  { key: 'chili',      emoji: '🌶️', name: 'Chili',      color: 'from-orange-500/20 to-red-500/10', border: 'border-orange-500/30', badge: 'bg-orange-500/20 text-orange-300', tag: 'Spicy', cost: 90, reward: 200, growthTime: 140, season: 'summer', waterCost: 10 },
  { key: 'cotton',     emoji: '🧵', name: 'Cotton',     color: 'from-slate-400/20 to-stone-400/10', border: 'border-slate-300/40', badge: 'bg-slate-400/20 text-slate-200', tag: 'Fiber', cost: 110, reward: 250, growthTime: 170, season: 'monsoon', waterCost: 12 },
  { key: 'sugarcane',  emoji: '🎋', name: 'Sugarcane',  color: 'from-lime-500/20 to-green-500/10', border: 'border-lime-400/30', badge: 'bg-lime-500/20 text-lime-300', tag: 'Sweet', cost: 130, reward: 320, growthTime: 200, season: 'monsoon', waterCost: 15 },
];

function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m`;
}

export default function CropShop() {
  const { selectedCrop, selectCrop, crops, user, plantCrop, season } = useGameStore();

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🛒</span>
        <h2 className="font-display font-bold text-lg text-white">Crop Shop</h2>
      </div>

      <div className="flex flex-col gap-3">
        {CROP_LIST.map((crop) => {
          const info = crops[crop.key] || {};
          const isSelected = selectedCrop === crop.key;
          const seasonLocked = crop.season && crop.season !== season;
          const canAfford = user && info && user.coins >= info.cost;
          const buttonDisabled = seasonLocked || !canAfford;

          return (
            <motion.button
              key={crop.key}
              id={`crop-btn-${crop.key}`}
              whileHover={{ scale: buttonDisabled ? 1 : 1.03, x: buttonDisabled ? 0 : 4, y: buttonDisabled ? 0 : -2 }}
              whileTap={{ scale: buttonDisabled ? 1 : 0.97 }}
              onClick={() => {
                if (buttonDisabled) return;
                selectCrop(crop.key);
              }}
              className={`
                relative w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                bg-gradient-to-br ${crop.color}
                ${isSelected ? `${crop.border} shadow-lg` : 'border-white/10'}
                ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              aria-label={`Select ${crop.name} crop – costs ${info?.cost} coins, earns ${info?.reward} coins`}
              aria-pressed={isSelected}
              aria-disabled={buttonDisabled}
            >
              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="crop-selector"
                  className="absolute inset-0 rounded-xl ring-2 ring-green-400/60"
                  transition={{ duration: 0.2 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-3">
                <span className="text-3xl">{crop.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-sm">{crop.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${crop.badge}`}>
                      {crop.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>💰 {info?.cost ?? '—'} cost</span>
                    <span>🏆 {info?.reward ?? '—'} reward</span>
                    <span>💧 {crop.waterCost ?? '—'} water</span>
                    <span>⏱ {info ? formatTime(info.growthTime) : '—'}</span>
                    {crop.season && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em]">
                        {seasonLocked ? `${crop.season} only` : `${crop.season}`}
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-400 text-lg"
                  >
                    ✓
                  </motion.span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Balance reminder */}
      {user && (
        <div className="mt-4 p-3 rounded-xl text-xs text-center"
          style={{ background: 'rgba(251,191,36,0.08)', color: '#fcd34d' }}>
          💰 Balance: <strong>{user.coins.toLocaleString()}</strong> coins
        </div>
      )}
    </div>
  );
}
