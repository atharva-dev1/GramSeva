// ── Component: PriceRow ──
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { SparkLine } from './SparkLine';

function calcPercent(price, prev) {
  if (!prev || prev === 0) return 0;
  return (((price - prev) / prev) * 100).toFixed(1);
}

export function PriceRow({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const { currentLang, t } = useLanguage();
  const isHindi = currentLang === 'hi';

  const pct = calcPercent(item.price, item.prevPrice);
  const isUp = item.trend === 'up';
  const isDown = item.trend === 'down';

  const trendColor = isUp ? 'var(--accent-green)' : isDown ? 'var(--accent-red)' : 'var(--text-secondary)';
  const borderColor = isUp ? 'var(--accent-green)' : isDown ? 'var(--accent-red)' : 'rgba(255,255,255,0.15)';

  return (
    <motion.div
      custom={index}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
          opacity: 1,
          x: 0,
          transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
        }),
      }}
      initial="hidden"
      animate="visible"
      onClick={() => setExpanded(prev => !prev)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 12,
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12 }}>
        {/* Crop emoji + name */}
        <div style={{ fontSize: 28, flexShrink: 0 }}>{item.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
            {isHindi ? item.hindi : item.crop}
          </div>
          <div style={{
            fontSize: 12,
            color: 'var(--text-secondary)',
            fontFamily: 'Noto Sans Devanagari, sans-serif',
          }}>
            {isHindi ? item.crop : item.hindi}
          </div>
        </div>

        {/* Price */}
        <div style={{ textAlign: 'right' }}>
          <motion.div
            key={item.price}
            initial={{ scale: 1.1, color: trendColor }}
            animate={{ scale: 1, color: '#F5F5F5' }}
            transition={{ duration: 0.5 }}
            style={{ fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', lineHeight: 1 }}
          >
            ₹{item.price.toLocaleString('en-IN')}
          </motion.div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            per {item.unit}
          </div>
        </div>

        {/* Trend badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '5px 10px',
          borderRadius: 100,
          background: isUp
            ? 'rgba(0,212,106,0.1)'
            : isDown
            ? 'rgba(255,71,87,0.1)'
            : 'rgba(255,255,255,0.05)',
          border: `1px solid ${isUp ? 'rgba(0,212,106,0.2)' : isDown ? 'rgba(255,71,87,0.2)' : 'rgba(255,255,255,0.1)'}`,
          color: trendColor,
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {isUp ? <TrendingUp size={12} /> : isDown ? <TrendingDown size={12} /> : <Minus size={12} />}
          {isUp ? '+' : ''}{pct}%
        </div>

        {/* Expand icon */}
        <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ borderTop: '1px solid var(--border)', padding: '12px 16px' }}>
              {/* Sparkline chart */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  7-Day Price Trend
                </div>
                <SparkLine item={item} width={280} height={40} />
              </div>
              {/* Stats row */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>{t('yesterday')}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
                    ₹{item.prevPrice.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>{t('weekHigh')}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent-green)' }}>
                    ₹{item.weekHigh.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Week Low</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent-red)' }}>
                    ₹{item.weekLow.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>District</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{item.district}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
