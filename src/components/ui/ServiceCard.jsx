// ── Component: ServiceCard ──
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function ServiceCard({ emoji, title, subtitle, gradient, onClick, delay = 0 }) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(255,107,53,0.15)' }}
      whileTap={{ scale: 0.97 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '18px 16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
      }}
      onHoverStart={e => {
        e.currentTarget.style.borderColor = 'rgba(255,107,53,0.3)';
      }}
      onHoverEnd={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Subtle gradient bg */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 80,
        height: 80,
        background: gradient,
        borderRadius: '0 16px 0 80px',
        opacity: 0.12,
        pointerEvents: 'none',
      }} />

      {/* Icon bg */}
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        position: 'relative',
      }}>
        {emoji}
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 3 }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {subtitle}
        </div>
      </div>

      {/* Arrow */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 28,
        height: 28,
        borderRadius: 8,
        background: 'rgba(255,107,53,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255,107,53,0.2)',
      }}>
        <ArrowRight size={14} color="var(--accent-primary)" />
      </div>
    </motion.div>
  );
}
