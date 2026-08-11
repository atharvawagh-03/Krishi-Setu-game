import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/gameStore';

function XPBar({ experience, level }) {
  const xpNeeded = level * 100;
  const pct = Math.min(100, Math.floor((experience / xpNeeded) * 100));
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs text-slate-400 whitespace-nowrap">{experience}/{xpNeeded} XP</span>
    </div>
  );
}

export default function NavBar() {
  const { user, waterFarm } = useGameStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b border-white/10" style={{ background: 'rgba(15,23,42,0.85)' }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
          aria-label="Go to homepage"
        >
          <span className="text-2xl animate-float">🌾</span>
          <span className="font-display font-bold text-lg text-gradient hidden sm:block">KrishiSetu-FarmX</span>
        </button>

        {/* Stats row */}
        {user && (
          <div className="flex items-center gap-3 flex-1 justify-center flex-wrap">
            {/* Coins */}
            <motion.div
              id="coin-counter"
              className="coin-badge"
              key={user.coins}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.3 }}
              aria-label={`Coins: ${user.coins}`}
            >
              <span>🪙</span>
              <span className="font-display text-lg">{user.coins.toLocaleString()}</span>
            </motion.div>

            {/* Level */}
            <div className="flex items-center gap-2 px-3 py-2 glass-card rounded-xl" aria-label={`Level ${user.level}`}>
              <span>⭐</span>
              <span className="text-sm font-bold text-amber-300">Lv.{user.level}</span>
              <XPBar experience={user.experience} level={user.level} />
            </div>

            {/* Water */}
            <div className="flex items-center gap-2 px-3 py-2 glass-card rounded-xl" aria-label={`Water: ${user.waterLevel}%`}>
              <span>💧</span>
              <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
                  animate={{ width: `${user.waterLevel}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ backgroundColor: user.waterLevel < 30 ? '#ef4444' : undefined }}
                />
              </div>
              <span className="text-xs text-sky-300">{user.waterLevel}%</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            id="refill-water-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={waterFarm}
            className="btn-secondary text-sm px-3 py-2 flex items-center gap-1.5"
            aria-label="Refill water to 100%"
          >
            <span>💧</span>
            <span className="hidden sm:inline">Refill</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
