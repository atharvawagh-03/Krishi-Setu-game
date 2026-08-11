import { create } from 'zustand';
import { farmAPI } from '../services/api';
import toast from 'react-hot-toast';

const CROP_EMOJIS = {
  wheat: '🌾',
  tomato: '🍅',
  corn: '🌽',
  strawberry: '🍓',
  sunflower: '🌻',
};

const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

const useGameStore = create((set, get) => ({
  // ─── State ─────────────────────────────────────────────────────────────────
  user: null,
  plots: [],
  crops: {},
  advisor: null,
  stats: null,
  weather: 'sunny',
  season: getCurrentSeason(),
  selectedCrop: 'wheat',
  loading: true,
  actionLoading: false,
  harvestEffect: null, // { plotIndex, coins, x, y }

  // ─── Actions ────────────────────────────────────────────────────────────────

  /** Initial load of the farm */
  loadFarm: async () => {
    try {
      set({ loading: true });
      const data = await farmAPI.getFarm();
      set({
        user: data.user,
        plots: data.plots,
        crops: data.crops,
        loading: false,
      });
    } catch (err) {
      toast.error(err.message || 'Failed to load farm');
      set({ loading: false });
    }
  },

  /** Set selected crop in shop */
  selectCrop: (cropKey) => set({ selectedCrop: cropKey }),

  /** Plant selected crop into a plot */
  plantCrop: async (plotIndex) => {
    const { selectedCrop, plots, user, crops } = get();
    const plot = plots[plotIndex];
    if (!plot) return;

    if (plot.state !== 'empty' && plot.state !== 'harvested') {
      toast.error('🚫 This plot is already occupied!');
      return;
    }

    const crop = crops[selectedCrop];
    if (user.coins < crop.cost) {
      toast.error(`💰 Not enough coins! Need ${crop.cost} coins.`);
      return;
    }

    if (user.waterLevel < 5) {
      toast.error('💧 Water too low! Please refill water first.');
      return;
    }

    try {
      set({ actionLoading: true });
      const data = await farmAPI.plantCrop(plotIndex, selectedCrop);
      set((state) => ({
        plots: state.plots.map((p) =>
          p.plotIndex === plotIndex ? { ...p, ...data.plot } : p
        ),
        user: { ...state.user, ...data.user },
        actionLoading: false,
      }));
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message || 'Failed to plant crop');
      set({ actionLoading: false });
    }
  },

  /** Harvest a ready crop */
  harvestCrop: async (plotIndex, event) => {
    const { plots } = get();
    const plot = plots[plotIndex];

    if (!plot || plot.state !== 'ready') {
      toast.error('🚫 Crop is not ready to harvest yet!');
      return;
    }

    // Capture position for coin animation
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    if (event?.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    try {
      set({ actionLoading: true });
      const data = await farmAPI.harvestCrop(plotIndex);

      // Trigger harvest animation
      set({ harvestEffect: { plotIndex, coins: data.coinsEarned, x, y } });
      setTimeout(() => set({ harvestEffect: null }), 1500);

      set((state) => ({
        plots: state.plots.map((p) =>
          p.plotIndex === plotIndex ? { ...p, ...data.plot } : p
        ),
        user: { ...state.user, ...data.user },
        actionLoading: false,
      }));

      toast.success(data.message, { icon: '🎉' });
    } catch (err) {
      toast.error(err.message || 'Failed to harvest crop');
      set({ actionLoading: false });
    }
  },

  /** Refill water */
  waterFarm: async () => {
    try {
      set({ actionLoading: true });
      const data = await farmAPI.waterFarm();
      set((state) => ({
        user: { ...state.user, waterLevel: data.waterLevel },
        actionLoading: false,
      }));
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message || 'Failed to refill water');
      set({ actionLoading: false });
    }
  },

  /** Load advisor data */
  loadAdvisor: async () => {
    try {
      const data = await farmAPI.getAdvisor();
      set({ advisor: data });
    } catch {
      // Silent fail for advisor
    }
  },

  /** Load stats */
  loadStats: async () => {
    try {
      const data = await farmAPI.getStats();
      set({ stats: data });
    } catch {
      // Silent fail for stats
    }
  },

  /** Set weather (called by useWeather hook) */
  setWeather: (weather) => set({ weather }),

  /** Update a single plot progress (called by timer hook) */
  updatePlotProgress: (plotIndex, progress, secondsRemaining, newState) => {
    set((state) => ({
      plots: state.plots.map((p) =>
        p.plotIndex === plotIndex
          ? { ...p, progress, secondsRemaining, state: newState || p.state }
          : p
      ),
    }));
  },

  /** Sync plot states that have completed */
  syncReadyPlots: () => {
    set((state) => ({
      plots: state.plots.map((p) => {
        if (p.state === 'growing' && p.readyAt) {
          const now = Date.now();
          const ready = new Date(p.readyAt).getTime();
          if (now >= ready) {
            return { ...p, state: 'ready', progress: 100, secondsRemaining: 0 };
          }
          // Update progress
          const total = new Date(p.readyAt).getTime() - new Date(p.plantedAt).getTime();
          const elapsed = now - new Date(p.plantedAt).getTime();
          const progress = Math.min(99, Math.floor((elapsed / total) * 100));
          const secondsRemaining = Math.max(0, Math.floor((ready - now) / 1000));
          return { ...p, progress, secondsRemaining };
        }
        return p;
      }),
    }));
  },

  CROP_EMOJIS,
}));

export default useGameStore;
