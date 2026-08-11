import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

const CROP_LIST = [
  { key: 'wheat',      emoji: '🌾', name: 'Wheat',      color: 'from-amber-500/20 to-yellow-500/10',  border: 'border-amber-500/30',  badge: 'bg-amber-500/20 text-amber-300',  tag: 'Beginner' },
  { key: 'tomato',     emoji: '🍅', name: 'Tomato',     color: 'from-red-500/20 to-rose-500/10',      border: 'border-red-500/30',     badge: 'bg-red-500/20 text-red-300',      tag: 'Popular' },
  { key: 'corn',       emoji: '🌽', name: 'Corn',       color: 'from-yellow-500/20 to-orange-500/10', border: 'border-yellow-500/30',  badge: 'bg-yellow-500/20 text-yellow-300', tag: 'Balanced' },
  { key: 'strawberry', emoji: '🍓', name: 'Strawberry', color: 'from-pink-500/20 to-fuchsia-500/10',  border: 'border-pink-500/30',    badge: 'bg-pink-500/20 text-pink-300',     tag: 'Premium' },
  { key: 'sunflower',  emoji: '🌻', name: 'Sunflower',  color: 'from-amber-200/20 to-yellow-400/10', border: 'border-amber-400/30', badge: 'bg-amber-500/20 text-amber-300', tag: 'Sunshine' },
];

function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m`;
}

export default function CropShop() {
  const { selectedCrop, selectCrop, crops, user, plantCrop } = useGameStore();

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🛒</span>
        <h2 className="font-display font-bold text-lg text-white">Crop Shop</h2>
      </div>

      <div className="flex flex-col gap-3">
        {CROP_LIST.map((crop) => {
          const info = crops[crop.key];
          const isSelected = selectedCrop === crop.key;
          const canAfford = user && info && user.coins >= info.cost;

          return (
            <motion.button
              key={crop.key}
              id={`crop-btn-${crop.key}`}
              whileHover={{ scale: 1.02, x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectCrop(crop.key)}
              className={`
                relative w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                bg-gradient-to-br ${crop.color}
                ${isSelected ? `${crop.border} shadow-lg` : 'border-white/10'}
                ${!canAfford ? 'opacity-50' : ''}
              `}
              aria-label={`Select ${crop.name} crop – costs ${info?.cost} coins, earns ${info?.reward} coins`}
              aria-pressed={isSelected}
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
                    <span>⏱ {info ? formatTime(info.growthTime) : '—'}</span>
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
