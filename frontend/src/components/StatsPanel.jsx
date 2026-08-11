import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import useGameStore from '../store/gameStore';

const CROP_COLORS = {
  wheat:      '#fbbf24',
  tomato:     '#f87171',
  corn:       '#facc15',
  strawberry: '#f472b6',
};

const CROP_EMOJIS = { wheat: '🌾', tomato: '🍅', corn: '🌽', strawberry: '🍓' };

function CustomTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div className="glass-card px-3 py-2 text-xs">
        <p className="text-slate-300 mb-1">{label}</p>
        <p className="text-amber-300 font-bold">🪙 {payload[0]?.value} coins</p>
      </div>
    );
  }
  return null;
}

export default function StatsPanel() {
  const { stats, user } = useGameStore();

  const pieData = stats?.byType?.map((b) => ({
    name: b._id.charAt(0).toUpperCase() + b._id.slice(1),
    value: b.total,
    key: b._id,
  })) || [];

  const barData = stats?.daily?.map((d) => ({
    day: d._id.split('-').slice(1).join('/'),
    earnings: d.earnings,
  })) || [];

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📊</span>
        <h2 className="font-display font-bold text-base text-white">Farm Analytics</h2>
      </div>

      {/* Quick Stats */}
      {user && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'Total Harvests', value: user.totalHarvests, icon: '🌾', color: 'text-green-300' },
            { label: 'Total Earnings', value: `${user.totalEarnings.toLocaleString()}🪙`, icon: '💰', color: 'text-amber-300' },
          ].map((s) => (
            <div
              key={s.label}
              className="p-3 rounded-xl text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="text-lg mb-1">{s.icon}</div>
              <div className={`font-bold text-base ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Earnings Chart (last 7 days) */}
      {barData.length > 0 && (
        <div className="mb-5">
          <p className="text-xs text-slate-500 mb-3 font-medium">📈 7-Day Earnings</p>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="earnings" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Crop Breakdown Pie */}
      {pieData.length > 0 && (
        <div className="mb-5">
          <p className="text-xs text-slate-500 mb-3 font-medium">🥧 Earnings by Crop</p>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.key}
                    fill={CROP_COLORS[entry.key] || '#22c55e'}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`🪙 ${v}`, 'Coins']} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: '#94a3b8', fontSize: '11px' }}>
                    {CROP_EMOJIS[value.toLowerCase()] || ''} {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Harvests */}
      {stats?.recentHarvests?.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 mb-2 font-medium">🕐 Recent Harvests</p>
          <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
            {stats.recentHarvests.slice(0, 8).map((log, i) => (
              <motion.div
                key={log._id || i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between text-xs p-2 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="flex items-center gap-2">
                  <span>{log.cropEmoji}</span>
                  <span className="text-slate-300">{log.cropType}</span>
                </div>
                <span className="text-amber-300 font-semibold">+{log.coinsEarned}🪙</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {!stats && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer-bg h-8 rounded-lg" />
          ))}
          <p className="text-xs text-slate-600 text-center">Harvest crops to see analytics!</p>
        </div>
      )}
    </div>
  );
}
