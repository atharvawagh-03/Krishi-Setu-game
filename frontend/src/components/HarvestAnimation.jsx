import { AnimatePresence, motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

/** Renders flying coin emoji from the harvested plot position toward the coin counter */
export default function HarvestAnimation() {
  const { harvestEffect } = useGameStore();

  return (
    <AnimatePresence>
      {harvestEffect && (
        <>
          {/* Multiple coins for visual richness */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={`coin-${i}`}
              initial={{
                opacity: 1,
                x: harvestEffect.x,
                y: harvestEffect.y,
                scale: 1,
              }}
              animate={{
                opacity: 0,
                x: harvestEffect.x + (Math.random() - 0.5) * 90,
                y: harvestEffect.y - 130 - i * 18,
                scale: 0.45,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 + i * 0.1, ease: 'easeOut', delay: i * 0.05 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                fontSize: '1.8rem',
                pointerEvents: 'none',
                zIndex: 9999,
                transform: 'translate(-50%, -50%)',
              }}
              aria-hidden="true"
            >
              🪙
            </motion.div>
          ))}

          {/* Coins earned popup */}
          <motion.div
            initial={{ opacity: 0, y: harvestEffect.y, x: harvestEffect.x, scale: 0.5 }}
            animate={{ opacity: 1, y: harvestEffect.y - 60, scale: 1 }}
            exit={{ opacity: 0, y: harvestEffect.y - 100, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              zIndex: 9999,
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.9))',
              color: '#1a1a1a',
              fontWeight: '800',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1.1rem',
              padding: '6px 16px',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(251,191,36,0.5)',
              whiteSpace: 'nowrap',
            }}
            aria-live="polite"
          >
            +{harvestEffect.coins} 🪙
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
