import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';

const ADVICE_STYLES = {
  harvest: { bg: 'rgba(34,197,94,0.12)',  border: 'border-green-500/30',  title: 'text-green-300' },
  water:   { bg: 'rgba(14,165,233,0.12)', border: 'border-sky-500/30',    title: 'text-sky-300' },
  plant:   { bg: 'rgba(34,197,94,0.08)',  border: 'border-green-500/20',  title: 'text-green-300' },
  growing: { bg: 'rgba(251,191,36,0.08)', border: 'border-amber-500/20',  title: 'text-amber-300' },
  economy: { bg: 'rgba(251,191,36,0.12)', border: 'border-amber-500/30',  title: 'text-amber-300' },
  idle:    { bg: 'rgba(255,255,255,0.04)',border: 'border-white/10',      title: 'text-slate-300' },
};

export default function AIAdvisor() {
  const { advisor } = useGameStore();

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
          style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(14,165,233,0.3))', border: '1px solid rgba(34,197,94,0.3)' }}>
          🤖
        </div>
        <div>
          <h2 className="font-display font-bold text-base text-white">AI Advisor</h2>
          <p className="text-xs text-slate-500">Smart crop recommendations</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>

      {/* AI Recommendation Badge */}
      {advisor?.aiRecommendation && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl border border-violet-500/30"
          style={{ background: 'rgba(139,92,246,0.1)' }}
        >
          <div className="text-xs text-violet-400 font-semibold mb-1 flex items-center gap-1">
            <span>🧠</span> ML Model: {advisor.aiRecommendation.model}
          </div>
          <div className="text-sm text-white font-medium">
            Plant <span className="text-green-300">{advisor.aiRecommendation.recommended_crop}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
            <span>Expected profit: <span className="text-amber-300">+{advisor.aiRecommendation.expected_profit}🪙</span></span>
            <span>Confidence: <span className="text-violet-300">{Math.round((advisor.aiRecommendation.confidence || 0) * 100)}%</span></span>
          </div>
        </motion.div>
      )}

      {/* Advice Cards */}
      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {advisor?.advice?.length > 0 ? (
            advisor.advice.map((item, i) => {
              const style = ADVICE_STYLES[item.type] || ADVICE_STYLES.idle;
              return (
                <motion.div
                  key={`${item.type}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`p-3 rounded-xl border ${style.border} text-sm`}
                  style={{ background: style.bg }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                    <p className="text-slate-300 leading-snug text-xs">{item.message}</p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-2 py-6 text-slate-500"
            >
              <div className="shimmer-bg w-full h-8 rounded-lg" />
              <div className="shimmer-bg w-3/4 h-8 rounded-lg" />
              <p className="text-xs mt-2">Analyzing your farm…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Farm Summary */}
      {advisor?.farmSummary && (
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Empty', value: advisor.farmSummary.emptyPlots,   color: 'text-slate-400' },
            { label: 'Growing',value: advisor.farmSummary.growingPlots, color: 'text-amber-400' },
            { label: 'Ready', value: advisor.farmSummary.readyPlots,   color: 'text-green-400' },
          ].map((s) => (
            <div key={s.label}>
              <div className={`font-bold text-lg ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
