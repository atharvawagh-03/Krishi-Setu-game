import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';
import FarmPlotTile from './FarmPlot';

export default function FarmGrid() {
  const { plots, selectedCrop, crops, plantCrop, harvestCrop } = useGameStore();

  const handlePlotClick = (plot, event) => {
    if (plot.state === 'ready') {
      harvestCrop(plot.plotIndex, event);
    } else if (plot.state === 'empty' || plot.state === 'harvested') {
      plantCrop(plot.plotIndex);
    }
  };

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">🌿 Your Farm</h2>
          <p className="text-slate-400 text-sm mt-1">Click an empty plot to plant · Click ready crops to harvest</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 mb-1">Selected</div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-xl">
            <span className="text-xl">{crops[selectedCrop]?.emoji || '🌾'}</span>
            <span className="text-sm font-semibold text-green-300">{crops[selectedCrop]?.name || 'Wheat'}</span>
          </div>
        </div>
      </div>

      {/* 3×3 Grid */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
        role="grid"
        aria-label="Farm plots"
      >
        <AnimatePresence>
          {plots.map((plot) => (
            <FarmPlotTile
              key={plot.plotIndex}
              plot={plot}
              selectedCrop={selectedCrop}
              cropInfo={crops[selectedCrop]}
              onClick={(e) => handlePlotClick(plot, e)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-5 flex-wrap">
        {[
          { color: 'border-white/20 bg-white/4', label: 'Empty', dot: 'bg-slate-500' },
          { color: 'border-amber-400/40', label: 'Growing', dot: 'bg-amber-400' },
          { color: 'border-green-400', label: 'Ready', dot: 'bg-green-400 animate-pulse' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className={`w-2 h-2 rounded-full ${l.dot}`} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
