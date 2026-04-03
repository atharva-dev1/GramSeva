// ── Component: Header ──
import { motion } from 'framer-motion';
import { LanguageToggle } from '../ui/LanguageToggle';
import { useLanguage } from '../../hooks/useLanguage';

export function Header() {
  const { t, currentLang } = useLanguage();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: '16px 20px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-primary)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Logo + tagline */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>🌾</span>
          <span
            className="gradient-text"
            style={{ fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em' }}
          >
            {t('appName')}
          </span>
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            marginTop: 1,
            fontFamily: currentLang === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Poppins, sans-serif',
          }}
          className="lang-text"
        >
          {t('tagline')}
        </div>
      </div>

      {/* Right: Language toggle */}
      <LanguageToggle />
    </motion.header>
  );
}
