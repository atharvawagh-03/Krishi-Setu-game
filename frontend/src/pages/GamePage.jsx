import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import useWeather from '../hooks/useWeather';
import useGameTimer from '../hooks/useGameTimer';
import NavBar from '../components/NavBar';
import FarmGrid from '../components/FarmGrid';
import CropShop from '../components/CropShop';
import AIAdvisor from '../components/AIAdvisor';
import WeatherWidget from '../components/WeatherWidget';
import StatsPanel from '../components/StatsPanel';
import HarvestAnimation from '../components/HarvestAnimation';

// Skeleton loader for the game layout
function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-16 glass-card rounded-none border-x-0 border-t-0 shimmer-bg" />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6">
        <div className="glass-card h-96 shimmer-bg" />
        <div className="glass-card h-96 shimmer-bg" />
        <div className="glass-card h-96 shimmer-bg" />
      </div>
    </div>
  );
}

export default function GamePage() {
  const { loadFarm, loadAdvisor, loadStats, loading } = useGameStore();
  useWeather();
  useGameTimer();

  useEffect(() => {
    loadFarm();
    loadAdvisor();
    loadStats();
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col"
    >
      {/* ── Top Navigation Bar ───────────────────────────── */}
      <NavBar />

      {/* ── Main Content ─────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6 items-start">

          {/* ── Left Sidebar: Shop + Weather ─────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <WeatherWidget />
            <CropShop />
          </motion.div>

          {/* ── Center: Farm Grid ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FarmGrid />
          </motion.div>

          {/* ── Right Sidebar: Advisor + Stats ────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            <AIAdvisor />
            <StatsPanel />
          </motion.div>

        </div>
      </main>

      {/* ── Harvest Coin Animation ────────────────────────── */}
      <HarvestAnimation />

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="text-center py-3 text-slate-600 text-xs border-t border-white/5">
        KrishiSetu-FarmX · AI-Powered Farming ·{' '}
        <a href="/" className="text-green-600 hover:text-green-400 transition-colors">← Back to Home</a>
      </footer>
    </motion.div>
  );
}
