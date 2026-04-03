// ── Page: HomePage ──
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MicButton } from '../components/ui/MicButton';
import { ServiceCard } from '../components/ui/ServiceCard';
import { LanguageToggle } from '../components/ui/LanguageToggle';
import { WeatherWidget } from '../components/ui/WeatherWidget';
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

// News headlines (in production, fetch from an API)
const AGRI_NEWS = [
  { en: 'MSP for Kharif crops hiked by ₹200/qtl for 2025-26 season 📈', hi: 'खरीफ 2025-26 के लिए MSP में ₹200/क्विंटल की बढ़ोतरी 📈' },
  { en: 'PM KISAN 17th installment to be released this month 💰', hi: 'पीएम किसान की 17वीं किस्त इस महीने जारी होगी 💰' },
  { en: 'Rabi crop acreage up 8% compared to last year 🌾', hi: 'रबी फसल का क्षेत्रफल पिछले साल से 8% अधिक 🌾' },
  { en: 'Soil Health Card data now available on DigiLocker 📱', hi: 'मृदा स्वास्थ्य कार्ड की जानकारी DigiLocker पर उपलब्ध 📱' },
  { en: 'NABARD releases ₹2.6L crore credit target for agriculture 🏦', hi: 'NABARD ने कृषि के लिए ₹2.6 लाख करोड़ ऋण लक्ष्य जारी किया 🏦' },
];

function getTimeGreeting(t) {
  const h = new Date().getHours();
  if (h < 12) return t('greetingMorning');
  if (h < 17) return t('greetingAfternoon');
  return t('greetingEvening');
}

// Scrolling news ticker
function NewsTicker({ isHindi }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIdx(p => (p + 1) % AGRI_NEWS.length), 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.15)',
      borderRadius: 10, padding: '8px 12px', marginBottom: 20, overflow: 'hidden',
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-primary)', whiteSpace: 'nowrap', background: 'rgba(255,107,53,0.15)', padding: '2px 8px', borderRadius: 6 }}>
        📰 NEWS
      </span>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
        >
          {isHindi ? AGRI_NEWS[idx].hi : AGRI_NEWS[idx].en}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function HomePage({ onToast }) {
  const navigate = useNavigate();
  const { t, currentLang } = useLanguage();
  const isHindi = currentLang === 'hi';

  const { state: speechState, transcript, startListening, resetSpeech } = useSpeech({
    lang: currentLang === 'hi' ? 'hi-IN' : 'en-IN',
  });
  const [showResult, setShowResult] = useState(false);

  // BUG FIX: use stable callback refs instead of capturing navigate/resetSpeech in effect deps
  const handleSpeechDone = useCallback(() => {
    if (!transcript) return;
    onToast?.({ type: 'info', title: 'Voice Recognized!', message: `Finding schemes for: "${transcript}"` });
    setTimeout(() => {
      navigate('/schemes');
      setShowResult(false);
      resetSpeech();
    }, 600);
  }, [transcript, onToast, navigate, resetSpeech]);

  useEffect(() => {
    if (speechState === 'done' && transcript) {
      setShowResult(true);
      const timer = setTimeout(handleSpeechDone, 1800);
      return () => clearTimeout(timer);
    }
  }, [speechState, transcript, handleSpeechDone]);

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
    { emoji:'⚖️', title:t('knowRights'), subtitle:t('rightsSubtitle'),  gradient:'linear-gradient(135deg,rgba(130,100,255,.5),rgba(80,60,200,.3))',  path:'/rights' },
  ];

  const handleServiceClick = (path) => {
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
          className="glass-card" style={{ padding: '20px', marginBottom: 16 }}
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
            {[
              { label: isHindi ? '20 योजनाएं' : '20 Schemes', emoji:'📋' },
              { label: isHindi ? '15 फसलें' : '15 Crops', emoji:'🌾' },
              { label: isHindi ? '22 भाषाएं' : '22 Languages', emoji:'🗣️' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{s.emoji}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Weather Widget ── */}
        <WeatherWidget />

        {/* ── News Ticker ── */}
        <NewsTicker isHindi={isHindi} />

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
                <div style={{ fontSize:13, color:'var(--accent-green)', fontWeight:600, marginBottom:8 }}>✅ {isHindi ? 'मिली योजनाएं खोली जा रही हैं...' : 'Opening matching schemes...'}</div>
                <div style={{ fontSize:14, color:'var(--text-primary)', background:'var(--bg-elevated)', border:'1px solid rgba(0,212,106,0.2)', borderRadius:12, padding:'10px 16px' }}>"{transcript}"</div>
              </motion.div>
            )}
            {speechState === 'error' && (
              <motion.div key="error" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ textAlign:'center' }}>
                <div style={{ fontSize:13, color:'var(--accent-red)', marginBottom:8 }}>⚠️ {isHindi ? 'माइक्रोफोन से कनेक्ट नहीं हो सका। डेमो मोड में चल रहा है।' : 'Could not access mic. Running demo mode.'}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Service Grid ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.1em' }}>
            {isHindi ? 'त्वरित पहुँच' : 'Quick Access'}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {services.map((s, i) => (
              <ServiceCard key={s.path} emoji={s.emoji} title={s.title} subtitle={s.subtitle} gradient={s.gradient} onClick={() => handleServiceClick(s.path)} delay={i * 0.07} />
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
