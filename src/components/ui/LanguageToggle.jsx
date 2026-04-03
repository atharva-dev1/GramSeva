// ── Component: LanguageToggle ──
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

export function LanguageToggle() {
  const { currentLang, toggleLang } = useLanguage();

  return (
    <motion.button
      onClick={toggleLang}
      whileTap={{ scale: 0.95 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-elevated)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '100px',
        padding: '3px',
        cursor: 'pointer',
        position: 'relative',
        gap: 0,
        width: 72,
        height: 30,
      }}
    >
      {/* Sliding pill indicator */}
      <motion.span
        layout
        layoutId="lang-pill"
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          position: 'absolute',
          top: 3,
          left: currentLang === 'en' ? 3 : 'calc(50% + 0px)',
          width: 32,
          height: 24,
          background: 'var(--accent-primary)',
          borderRadius: '100px',
          zIndex: 0,
        }}
        animate={{
          left: currentLang === 'en' ? 3 : 37,
        }}
      />
      <span
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 700,
          color: currentLang === 'en' ? 'white' : 'var(--text-secondary)',
          position: 'relative',
          zIndex: 1,
          transition: 'color 150ms ease',
          letterSpacing: '0.02em',
        }}
      >
        EN
      </span>
      <span
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 700,
          color: currentLang === 'hi' ? 'white' : 'var(--text-secondary)',
          position: 'relative',
          zIndex: 1,
          transition: 'color 150ms ease',
          letterSpacing: '0.02em',
          fontFamily: 'Noto Sans Devanagari, sans-serif',
        }}
      >
        हि
      </span>
    </motion.button>
  );
}
