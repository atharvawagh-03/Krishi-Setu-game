import { motion } from 'framer-motion';

// SVG Progress Ring
function ProgressRing({ progress, size = 64, strokeWidth = 5, color = '#22c55e' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="progress-ring" aria-hidden="true">
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
}

function formatTime(seconds) {
  if (seconds <= 0) return '0s';
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

const stateConfig = {
  empty:     { border: 'border-dashed border-white/20', bg: 'rgba(255,255,255,0.03)' },
  harvested: { border: 'border-dashed border-white/20', bg: 'rgba(255,255,255,0.03)' },
  growing:   { border: 'border-amber-400/40',            bg: 'rgba(251,191,36,0.07)' },
  ready:     { border: 'border-green-400',               bg: 'rgba(34,197,94,0.1)' },
};

export default function FarmPlotTile({ plot, selectedCrop, cropInfo, onClick }) {
  const cfg = stateConfig[plot.state] || stateConfig.empty;
  const isClickable = plot.state === 'empty' || plot.state === 'harvested' || plot.state === 'ready';
  const progress = plot.progress || 0;
  const currentStage =
    plot.state === 'ready'
      ? 'Ready'
      : plot.state === 'growing'
      ? progress < 25
        ? 'Seedling'
        : progress < 50
        ? 'Growing'
        : progress < 75
        ? 'Mature'
        : 'Ready'
      : 'Empty';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      whileHover={isClickable ? { scale: 1.04, y: -3 } : {}}
      whileTap={isClickable ? { scale: 0.97 } : {}}
      onClick={isClickable ? onClick : undefined}
      className={`
        relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center
        transition-all duration-300 select-none overflow-hidden
        ${cfg.border}
        ${isClickable ? 'cursor-pointer' : 'cursor-default'}
        ${plot.state === 'ready' ? 'animate-glow' : ''}
      `}
      style={{ background: cfg.bg }}
      role="button"
      aria-label={
        plot.state === 'empty'
          ? `Empty plot ${plot.plotIndex + 1} – click to plant ${cropInfo?.name || 'crop'}`
          : plot.state === 'ready'
          ? `Plot ${plot.plotIndex + 1} – ${plot.cropInfo?.name} ready to harvest!`
          : `Plot ${plot.plotIndex + 1} – ${plot.cropType} growing, ${plot.progress}% done`
      }
      tabIndex={isClickable ? 0 : -1}
      onKeyDown={(e) => { if (e.key === 'Enter' && isClickable) onClick(e); }}
    >
      {/* ── Empty State ─────────────────────────────────── */}
      {(plot.state === 'empty' || plot.state === 'harvested') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-2 text-center px-2"
        >
          <span className="text-3xl opacity-30">🌱</span>
          <span className="text-xs text-slate-500 font-medium">Click to plant</span>
          {cropInfo && (
            <div className="flex items-center gap-1 mt-1 px-2 py-1 rounded-lg text-xs"
              style={{ background: 'rgba(34,197,94,0.1)', color: '#86efac' }}>
              <span>{cropInfo.emoji}</span>
              <span>{cropInfo.cost}🪙</span>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Growing State ────────────────────────────────── */}
      {plot.state === 'growing' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-2"
        >
          {/* Pulsing crop emoji */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <span className="text-4xl">{plot.cropInfo?.emoji || '🌱'}</span>
          </motion.div>

          {/* Progress ring overlay */}
          <div className="relative">
            <ProgressRing progress={progress} size={52} strokeWidth={4} color="#fbbf24" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-amber-300">{progress}%</span>
            </div>
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-300/90">
            {currentStage}
          </span>

          {/* Countdown */}
          <span className="text-xs text-amber-400/80">{formatTime(plot.secondsRemaining || 0)}</span>
        </motion.div>
      )}

      {/* ── Ready State ──────────────────────────────────── */}
      {plot.state === 'ready' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-5xl">{plot.cropInfo?.emoji || '🌾'}</span>
          </motion.div>

          <div className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>
            <span>✅</span>
            <span>{currentStage}</span>
          </div>

          <div className="text-xs text-green-400/80 font-medium">
            +{plot.cropInfo?.reward}🪙
          </div>
        </motion.div>
      )}

      {/* Ready glow pulse overlay */}
      {plot.state === 'ready' && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)' }}
        />
      )}
    </motion.div>
  );
}
