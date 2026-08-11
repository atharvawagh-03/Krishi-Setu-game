import { useEffect } from 'react';
import useGameStore from '../store/gameStore';

/** Ticks every second to update growing plot progress and detect ready crops */
const useGameTimer = () => {
  const { syncReadyPlots, loadAdvisor, loadStats } = useGameStore();

  useEffect(() => {
    // Sync plot progress every second
    const plotTimer = setInterval(() => {
      syncReadyPlots();
    }, 1000);

    // Refresh advisor every 30 seconds
    const advisorTimer = setInterval(() => {
      loadAdvisor();
    }, 30_000);

    // Refresh stats every 60 seconds
    const statsTimer = setInterval(() => {
      loadStats();
    }, 60_000);

    return () => {
      clearInterval(plotTimer);
      clearInterval(advisorTimer);
      clearInterval(statsTimer);
    };
  }, [syncReadyPlots, loadAdvisor, loadStats]);
};

export default useGameTimer;
