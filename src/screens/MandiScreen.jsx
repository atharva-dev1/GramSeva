// ── Screen: MandiScreen ──
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, RefreshCw, Info, Clock } from 'lucide-react';
import { PriceRow } from '../components/ui/PriceRow';
import { mandiData, districts } from '../data/mandi';
import { useLanguage } from '../hooks/useLanguage';

export function MandiScreen({ onBack, onToast }) {
  const { t, currentLang } = useLanguage();
  const [district, setDistrict] = useState('Kanpur');
  const [spinning, setSpinning] = useState(false);
  const isHindi = currentLang === 'hi';

  const handleRefresh = () => {
    setSpinning(true);
    onToast?.({ type: 'success', title: 'Prices Updated!', message: `Latest rates fetched from AGMARKNET for ${district}` });
    setTimeout(() => setSpinning(false), 1200);
  };

  const handleDistrictChange = (d) => {
    setDistrict(d);
    onToast?.({ type: 'info', title: `Switched to ${d}`, message: 'Showing current mandi rates for selected district' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="screen-content"
    >
      <div style={{ padding: '0 20px 20px' }}>
        {/* ── Screen Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 0',
          borderBottom: '1px solid var(--border)',
          marginBottom: 20,
        }}>
          <motion.button
            onClick={onBack}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={18} color="var(--text-primary)" />
          </motion.button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--text-primary)' }}>
              {t('mandiPrices')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              मंडी भाव
            </div>
          </div>
          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="live-dot" />
            <span style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 600 }}>
              {t('liveRates')}
            </span>
          </div>
        </div>

        {/* ── District Selector ── */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 8 }}>
            {t('selectDistrict')}
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin
              size={16}
              color="var(--accent-primary)"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 1, pointerEvents: 'none' }}
            />
            <select
              value={district}
              onChange={e => handleDistrictChange(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px 11px 38px',
                appearance: 'none',
                WebkitAppearance: 'none',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
              }}
            >
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <div style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: 'var(--text-secondary)',
              fontSize: 10,
            }}>▼</div>
          </div>
        </div>

        {/* ── Last Updated ── */}
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '10px 14px',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={14} color="var(--text-secondary)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('lastUpdated')}</div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                Today, 9:00 AM
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
              Source: <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>AGMARKNET</span>
            </div>
            <motion.button
              onClick={handleRefresh}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: 'rgba(255,107,53,0.1)',
                border: '1px solid rgba(255,107,53,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} color="var(--accent-primary)" className={spinning ? 'spin' : ''} />
            </motion.button>
          </div>
        </motion.div>

        {/* ── Price Table ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={district}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}
          >
            {mandiData.map((item, i) => (
              <PriceRow key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Disclaimer ── */}
        <div style={{
          display: 'flex',
          gap: 8,
          padding: '12px',
          background: 'rgba(255,215,0,0.05)',
          border: '1px solid rgba(255,215,0,0.15)',
          borderRadius: 10,
        }}>
          <Info size={14} color="var(--accent-secondary)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
