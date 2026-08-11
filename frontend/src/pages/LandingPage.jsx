import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: '🌾',
    title: 'Plant & Harvest',
    desc: 'Grow 4 unique crops on your 3×3 farm grid. Watch them flourish in real-time with beautiful animations.',
    color: 'from-green-500/20 to-emerald-500/10',
    border: 'border-green-500/30',
  },
  {
    icon: '🤖',
    title: 'AI Crop Advisor',
    desc: 'A machine-learning model recommends the best crops based on weather, water level, and your coin balance.',
    color: 'from-sky-500/20 to-cyan-500/10',
    border: 'border-sky-500/30',
  },
  {
    icon: '📊',
    title: 'Live Analytics',
    desc: 'Track your earnings with interactive charts. See harvest history, crop breakdowns, and daily earnings.',
    color: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-500/30',
  },
  {
    icon: '🌦️',
    title: 'Dynamic Weather',
    desc: 'Weather changes every 60 seconds. Rainy days auto-water your crops while sunny days boost growth.',
    color: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30',
  },
];

const techStack = [
  { label: 'React 18', color: '#61DAFB', bg: 'rgba(97,218,251,0.15)' },
  { label: 'Node.js',  color: '#68A063', bg: 'rgba(104,160,99,0.15)' },
  { label: 'MongoDB',  color: '#47A248', bg: 'rgba(71,162,72,0.15)' },
  { label: 'Python',   color: '#FFD43B', bg: 'rgba(255,212,59,0.15)' },
  { label: 'Tailwind', color: '#38BDF8', bg: 'rgba(56,189,248,0.15)' },
  { label: 'Flask',    color: '#FF7043', bg: 'rgba(255,112,67,0.15)' },
  { label: 'Framer',   color: '#BB5CF8', bg: 'rgba(187,92,248,0.15)' },
  { label: 'Recharts', color: '#22C55E', bg: 'rgba(34,197,94,0.15)' },
];

const crops = [
  { emoji: '🌾', name: 'Wheat',      delay: 0 },
  { emoji: '🍅', name: 'Tomato',     delay: 0.3 },
  { emoji: '🌽', name: 'Corn',       delay: 0.6 },
  { emoji: '🍓', name: 'Strawberry', delay: 0.9 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ── Background orbs ───────────────────────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl" />
      </div>

      {/* ── Navbar ────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-float">🌾</span>
            <span className="font-display font-bold text-xl text-gradient">SmartFarm Tycoon</span>
          </div>
          <motion.button
            id="nav-play-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/game')}
            className="btn-primary text-sm px-5 py-2.5"
            aria-label="Play the game"
          >
            🎮 Play Now
          </motion.button>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-green-300 border border-green-500/30 mb-8"
          style={{ background: 'rgba(34,197,94,0.08)' }}
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          AI-Powered Farming Simulation
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-bold text-6xl md:text-7xl lg:text-8xl mb-6 leading-tight"
        >
          <span className="text-gradient">SmartFarm</span>
          <br />
          <span className="text-white">Tycoon</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-300 text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Plant crops, earn coins, and let your&nbsp;
          <span className="text-green-400 font-semibold">AI advisor</span>
          &nbsp;guide you to a bountiful harvest.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            id="hero-play-btn"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/game')}
            className="btn-primary text-lg px-10 py-4"
            aria-label="Start playing SmartFarm Tycoon"
          >
            🚀 Start Farming
          </motion.button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-lg px-8 py-4"
          >
            ⭐ View on GitHub
          </a>
        </motion.div>

        {/* Floating crop emojis */}
        <div className="flex items-center justify-center gap-8 mt-16">
          {crops.map((crop) => (
            <motion.div
              key={crop.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + crop.delay }}
              className="flex flex-col items-center gap-2"
              style={{ animation: `float ${3 + crop.delay}s ease-in-out infinite` }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl glass-card"
              >
                {crop.emoji}
              </div>
              <span className="text-xs text-slate-400 font-medium">{crop.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20" id="features">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Everything you need to farm smarter
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From AI-powered recommendations to real-time analytics — experience farming like never before.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              className={`glass-card-hover p-8 bg-gradient-to-br ${f.color} border ${f.border}`}
            >
              <div className="text-5xl mb-5">{f.icon}</div>
              <h3 className="font-display font-bold text-xl text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── How to Play ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-10 text-center"
        >
          <h2 className="font-display font-bold text-3xl text-white mb-10">How to Play</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: '1', icon: '🛒', text: 'Pick a crop from the shop' },
              { step: '2', icon: '🌱', text: 'Click an empty plot to plant' },
              { step: '3', icon: '⏳', text: 'Watch it grow in real-time' },
              { step: '4', icon: '💰', text: 'Harvest & collect your coins!' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-lg font-bold text-green-400">
                  {s.step}
                </div>
                <div className="text-3xl">{s.icon}</div>
                <p className="text-slate-300 text-sm leading-snug">{s.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Tech Stack ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-slate-500 text-sm uppercase tracking-widest mb-6 font-medium">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {techStack.map((tech) => (
              <span
                key={tech.label}
                className="px-4 py-2 rounded-xl text-sm font-semibold border"
                style={{
                  color: tech.color,
                  background: tech.bg,
                  borderColor: tech.color + '40',
                }}
              >
                {tech.label}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-14"
          style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(14,165,233,0.08))' }}
        >
          <div className="text-6xl mb-6 animate-float">🏆</div>
          <h2 className="font-display font-bold text-4xl text-white mb-4">
            Ready to become a <span className="text-gradient">Farm Tycoon?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Your first crop is just one click away. No sign-up needed!
          </p>
          <motion.button
            id="cta-play-btn"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/game')}
            className="btn-primary text-xl px-12 py-5"
            aria-label="Play SmartFarm Tycoon"
          >
            🌾 Play Now – It's Free!
          </motion.button>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-8 text-center text-slate-500 text-sm">
        <p>© 2025 SmartFarm Tycoon · Built with ❤️ as a portfolio project</p>
      </footer>
    </div>
  );
}
