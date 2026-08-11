import { useEffect, useCallback } from 'react';
import useGameStore from '../store/gameStore';
import toast from 'react-hot-toast';

const WEATHER_TYPES = [
  { key: 'sunny',  label: 'Sunny',  icon: '☀️',  desc: 'Normal growth speed.' },
  { key: 'cloudy', label: 'Cloudy', icon: '☁️',  desc: 'Neutral effect on crops.' },
  { key: 'rainy',  label: 'Rainy',  icon: '🌧️', desc: 'Auto-watering all crops!' },
];

export const WEATHER_INFO = WEATHER_TYPES.reduce((acc, w) => {
  acc[w.key] = w;
  return acc;
}, {});

/** Cycles through weather every 60 seconds and applies rainy auto-water effect */
const useWeather = () => {
  const { setWeather, waterFarm, user } = useGameStore();

  const changeWeather = useCallback(() => {
    const random = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
    setWeather(random.key);

    if (random.key === 'rainy') {
      toast('🌧️ It\'s raining! Your crops have been watered automatically.', {
        duration: 4000,
        style: { background: '#0ea5e9', color: '#fff' },
      });
      // Auto-water on rainy weather
      if (user?.waterLevel < 100) {
        waterFarm();
      }
    } else {
      toast(`${random.icon} Weather changed to ${random.label}. ${random.desc}`, {
        duration: 3000,
        style: { background: 'rgba(15,23,42,0.95)', color: '#e2e8f0' },
      });
    }
  }, [setWeather, waterFarm, user]);

  useEffect(() => {
    const interval = setInterval(changeWeather, 60_000);
    return () => clearInterval(interval);
  }, [changeWeather]);

  return { WEATHER_INFO };
};

export default useWeather;
