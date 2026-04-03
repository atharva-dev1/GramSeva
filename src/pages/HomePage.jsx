// ── Page: HomePage ──
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MicButton } from '../components/ui/MicButton';
import { ServiceCard } from '../components/ui/ServiceCard';
import { LanguageToggle } from '../components/ui/LanguageToggle';
import { useSpeech } from '../hooks/useSpeech';
import { useLanguage } from '../hooks/useLanguage';

const STATS = [
  { en: '650M+ Rural Users', hi: '65 करोड़+ ग्रामीण' },
  { en: '20 Active Schemes',  hi: '20 सक्रिय योजनाएं' },
  { en: '22 Languages',       hi: '22 भाषाएं' },
  { en: 'Free Forever',       hi: 'हमेशा मुफ्त' },
  { en: 'Govt. Verified',     hi: 'सरकार प्रमाणित' },
];

const LANG_CHIPS = ['Hindi 🇮🇳', 'English', 'Bhojpuri', 'Marathi', 'Tamil'];

function getTimeGreeting(t) {
  const h = new Date().getHours();
  if (h < 12) return t('greetingMorning');
  if (h < 17) return t('greetingAfternoon');
  return t('greetingEvening');
}

export function HomePage({ onToast }) {
  const navigate = useNavigate();
  const { t, currentLang } = useLanguage();
  const isHindi = currentLang === 'hi';

  const { state: speechState, transcript, startListening, resetSpeech } = useSpeech({
    lang: currentLang === 'hi' ? 'hi-IN' : 'en-IN',
  });
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (speechState === 'done' && transcript) {
      setShowResult(true);
      const timer = setTimeout(() => {
        onToast?.({ type: 'info', title: 'Voice Recognized!', message: `Finding schemes for: "${transcript}"` });
        setTimeout(() => { navigate('/schemes'); setShowResult(false); resetSpeech(); }, 600);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [speechState, transcript]);

  const handleMicPress = () => {
    if (speechState === 'idle' || speechState === 'done' || speechState === 'error') {
      setShowResult(false);
      startListening(null, () => {});
    } else {
      resetSpeech();
    }
  };

  const services = [
    { emoji:'🌾', title:t('mySchemes'),   subtitle:t('schemesSubtitle'), gradient:'linear-gradient(135deg,rgba(255,107,53,.6),rgba(255,107,53,.3))', path:'/schemes' },
    { emoji:'📈', title:t('mandiPrices'), subtitle:t('mandiSubtitle'),   gradient:'linear-gradient(135deg,rgba(255,215,0,.5),rgba(255,150,0,.3))',   path:'/mandi' },
    { emoji:'🏥', title:t('healthHelp'),  subtitle:t('healthSubtitle'),  gradient:'linear-gradient(135deg,rgba(0,212,106,.5),rgba(0,150,70,.3))',     path:'/health' },
    { emoji:'⚖️', title:t('knowRights'), subtitle:t('rightsSubtitle'),  gradient:'linear-gradient(135deg,rgba(130,100,255,.5),rgba(80,60,200,.3))',  path:'rights' },
  ];

  const handleServiceClick = (path) => {
    if (path === 'rights') {
      onToast?.({ type: 'info', title: 'Coming Soon!', message: 'Legal guidance launching next update 🚀' });
      return;
    }
    navigate(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="screen-content"
    >
      {/* ── Page Header ── */}
      <header style={{
        padding: '16px 20px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-primary)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🌾</span>
            <span className="gradient-text" style={{ fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em' }}>
              {t('appName')}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1, fontFamily: isHindi ? 'Noto Sans Devanagari,sans-serif' : 'Poppins,sans-serif' }}>
            {t('tagline')}
          </div>
        </div>
        <LanguageToggle />
      </header>

      <div style={{ padding: '20px 20px 12px' }}>
        {/* ── Greeting Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="glass-card" style={{ padding: '20px', marginBottom: 24 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 26, marginBottom: 4 }}>{t('greeting')}</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', marginBottom: 4, fontFamily: isHindi ? 'Noto Sans Devanagari,sans-serif' : 'inherit' }}>
                {getTimeGreeting(t)} 🌟
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 210 }}>
                {t('howCanHelp')}
              </div>
            </div>
            <div style={{ fontSize: 52, lineHeight: 1, filter: 'drop-shadow(0 0 12px rgba(255,107,53,0.3))' }}>🌾</div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,107,53,0.15)' }}>
            {[{ label:'20 Schemes', emoji:'📋' }, { label:'15 Crops', emoji:'🌾' }, { label:'22 Languages', emoji:'🗣️' }].map(s => (
              <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{s.emoji}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Mic Section ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginBottom: 32 }}
        >
          <MicButton speechState={speechState} onPress={handleMicPress} size={120} />

          <AnimatePresence mode="wait">
            {speechState === 'idle' && (
              <motion.div key="hint" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ textAlign:'center' }}>
                <div style={{ fontSize:14, color:'var(--text-secondary)', marginBottom:12 }}>{t('tapToSpeak')}</div>
                <div className="chips-row" style={{ justifyContent:'center' }}>
                  {LANG_CHIPS.map(chip => (
                    <span key={chip} style={{ fontSize:12, padding:'5px 12px', borderRadius:100, background:'var(--bg-elevated)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--text-secondary)', whiteSpace:'nowrap' }}>{chip}</span>
                  ))}
                </div>
              </motion.div>
            )}
            {(speechState === 'listening' || speechState === 'processing') && (
              <motion.div key="listening" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} style={{ textAlign:'center', maxWidth:300 }}>
                <div style={{ fontSize:13, color: speechState==='processing' ? 'var(--accent-secondary)' : 'var(--accent-primary)', fontWeight:600, marginBottom:8 }}>
                  {speechState === 'listening' ? t('listening') : t('processing')}
                </div>
                {transcript && (
                  <div style={{ fontSize:14, color:'var(--text-primary)', background:'var(--bg-elevated)', border:'1px solid rgba(255,107,53,0.2)', borderRadius:12, padding:'10px 16px', fontStyle:'italic' }}>
                    "{transcript}"
                  </div>
                )}
                <div style={{ display:'flex', gap:4, justifyContent:'center', marginTop:12 }}>
                  {[0,1,2,3,4].map(i => <div key={i} className="wave-bar" style={{ animationDelay:`${i*0.12}s` }} />)}
                </div>
              </motion.div>
            )}
            {speechState === 'done' && showResult && (
              <motion.div key="result" initial={{ opacity:0, scale:0.9, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0 }} style={{ textAlign:'center' }}>
                <div style={{ fontSize:13, color:'var(--accent-green)', fontWeight:600, marginBottom:8 }}>✅ Opening matching schemes...</div>
                <div style={{ fontSize:14, color:'var(--text-primary)', background:'var(--bg-elevated)', border:'1px solid rgba(0,212,106,0.2)', borderRadius:12, padding:'10px 16px' }}>"{transcript}"</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Service Grid ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.1em' }}>Quick Access</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {services.map((s, i) => (
              <ServiceCard key={s.title} emoji={s.emoji} title={s.title} subtitle={s.subtitle} gradient={s.gradient} onClick={() => handleServiceClick(s.path)} delay={i * 0.07} />
            ))}
          </div>
        </div>

        {/* ── Stats Strip ── */}
        <div className="stats-strip" style={{ paddingBottom: 8 }}>
          {STATS.map(s => (
            <motion.div key={s.en} whileTap={{ scale:0.95 }} style={{ padding:'7px 14px', borderRadius:100, background:'rgba(255,107,53,0.12)', border:'1px solid rgba(255,107,53,0.25)', color:'var(--accent-primary)', fontSize:12, fontWeight:600, whiteSpace:'nowrap', flexShrink:0 }}>
              {isHindi ? s.hi : s.en}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
