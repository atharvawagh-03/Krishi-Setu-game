import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';
import { WEATHER_INFO } from '../hooks/useWeather';

const WEATHER_STYLES = {
  sunny:  { icon: '☀️',  label: 'Sunny',  from: 'from-amber-500/20', to: 'to-orange-500/10', border: 'border-amber-500/30', text: 'text-amber-300' },
  cloudy: { icon: '☁️',  label: 'Cloudy', from: 'from-slate-500/20', to: 'to-gray-500/10',   border: 'border-slate-500/30', text: 'text-slate-300' },
  rainy:  { icon: '🌧️', label: 'Rainy',  from: 'from-sky-500/20',   to: 'to-blue-500/10',   border: 'border-sky-500/30',   text: 'text-sky-300'  },
};

export default function WeatherWidget() {
  const { weather } = useGameStore();
  const w = WEATHER_STYLES[weather] || WEATHER_STYLES.sunny;
  const info = WEATHER_INFO[weather] || {};

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={weather}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4 }}
        className={`glass-card p-5 bg-gradient-to-br ${w.from} ${w.to} border ${w.border}`}
        aria-label={`Current weather: ${w.label}`}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🌤</span>
          <h3 className="font-display font-semibold text-sm text-white">Weather</h3>
          <span className="ml-auto text-xs text-slate-500">Updates: 60s</span>
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            animate={weather === 'rainy' ? { y: [0, -3, 0] } : weather === 'sunny' ? { rotate: [0, 360] } : {}}
            transition={weather === 'sunny' ? { duration: 10, repeat: Infinity, ease: 'linear' } : { duration: 1.5, repeat: Infinity }}
            className="text-5xl"
          >
            {w.icon}
          </motion.div>
          <div>
            <div className={`font-display font-bold text-xl ${w.text}`}>{w.label}</div>
            <div className="text-xs text-slate-400 mt-1 max-w-[140px] leading-snug">{info.desc}</div>
          </div>
        </div>

        {weather === 'rainy' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-2 rounded-lg text-xs text-sky-300 flex items-center gap-1.5"
            style={{ background: 'rgba(14,165,233,0.12)' }}
          >
            <span>💧</span>
            <span>Auto-watering active!</span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
