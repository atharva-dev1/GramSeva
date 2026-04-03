// ── Page: SchemesPage — /schemes ──
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, Search, X, Filter, SlidersHorizontal } from 'lucide-react';
import { SchemeCard } from '../components/ui/SchemeCard';
import { LoadingDots } from '../components/ui/LoadingDots';
import { schemes } from '../data/schemes';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/ui/LanguageToggle';

const CATEGORIES = ['all', 'farmer', 'health', 'women', 'employment'];
const DEMO_QUERY = "PM Kisan ke liye apply karna hai";

const CAT_META = {
  all:        { emoji:'📋', label:'All' },
  farmer:     { emoji:'🌾', label:'Farmer' },
  health:     { emoji:'🏥', label:'Health'  },
  women:      { emoji:'👩', label:'Women'  },
  employment: { emoji:'💼', label:'Work'   },
};

function matchSchemes(query, category) {
  let result = schemes;
  if (category !== 'all') result = result.filter(s => s.category === category);
  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(s =>
      s.keywords.some(k => k.toLowerCase().includes(q)) ||
      s.name.toLowerCase().includes(q) ||
      s.hindi.includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.descHindi.includes(q)
    );
  }
  return result;
}

export function SchemesPage({ onToast }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, currentLang } = useLanguage();
  const [category, setCategory] = useState(searchParams.get('cat') ?? 'all');
  const [query, setQuery] = useState('');
  const [voicePhase, setVoicePhase] = useState('idle');
  const [displayedSchemes, setDisplayedSchemes] = useState(schemes);
  const [isLoading, setIsLoading] = useState(false);
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const inputRef = useRef(null);
  const isHindi = currentLang === 'hi';

  useEffect(() => {
    let result = matchSchemes(query, category);
    if (eligibleOnly) result = result.filter(s => s.eligible);
    setDisplayedSchemes(result);
  }, [query, category, eligibleOnly]);

  const runVoiceDemo = () => {
    if (voicePhase !== 'idle') { setVoicePhase('idle'); setQuery(''); return; }
    setVoicePhase('listening');
    setQuery('');
    let i = 0;
    const interval = setInterval(() => {
      if (i <= DEMO_QUERY.length) { setQuery(DEMO_QUERY.slice(0, i)); i++; }
      else {
        clearInterval(interval);
        setVoicePhase('loading');
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setVoicePhase('done');
          onToast?.({ type:'info', title:'Voice Recognized!', message:`Searching: "${DEMO_QUERY}"` });
        }, 1200);
      }
    }, 40);
  };

  const clearSearch = () => {
    setQuery(''); setVoicePhase('idle');
    setDisplayedSchemes(eligibleOnly ? schemes.filter(s=>s.eligible) : schemes);
    inputRef.current?.focus();
  };

  const eligible = schemes.filter(s => s.eligible).length;

  return (
    <motion.div
      initial={{ opacity:0, x:40 }}
      animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:-40 }}
      transition={{ duration:0.28, ease:'easeOut' }}
      className="screen-content"
    >
      {/* ── Page Header ── */}
      <header style={{
        padding:'14px 20px', display:'flex', alignItems:'center', gap:12,
        borderBottom:'1px solid var(--border)', background:'var(--bg-primary)',
        position:'sticky', top:0, zIndex:50,
      }}>
        <motion.button onClick={() => navigate('/')} whileTap={{ scale:0.9 }} style={{ width:36, height:36, borderRadius:10, background:'var(--bg-elevated)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
          <ArrowLeft size={18} color="var(--text-primary)" />
        </motion.button>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:20 }}>🌾</span>
            <span style={{ fontWeight:700, fontSize:20, color:'var(--text-primary)' }}>{t('mySchemes')}</span>
          </div>
          <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'Noto Sans Devanagari,sans-serif' }}>
            सरकारी योजनाएं — {displayedSchemes.length}/{schemes.length}
          </div>
        </div>
        <LanguageToggle />
      </header>

      <div style={{ padding:'16px 20px 20px' }}>

        {/* ── Stats Banner ── */}
        <motion.div
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
          style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:20 }}
        >
          {[
            { label:'Total Schemes', value:schemes.length, emoji:'📋', color:'var(--accent-primary)' },
            { label:'You\'re Eligible', value:eligible, emoji:'✅', color:'var(--accent-green)' },
            { label:'Categories', value:CATEGORIES.length-1, emoji:'🏷️', color:'var(--accent-secondary)' },
          ].map(s => (
            <div key={s.label} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:12, padding:'12px', textAlign:'center' }}>
              <div style={{ fontSize:18, marginBottom:4 }}>{s.emoji}</div>
              <div style={{ fontWeight:700, fontSize:22, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:10, color:'var(--text-muted)', lineHeight:1.3 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Category Filter Chips ── */}
        <div className="chips-row" style={{ marginBottom:16 }}>
          {CATEGORIES.map(cat => (
            <motion.button key={cat} onClick={() => setCategory(cat)} whileTap={{ scale:0.93 }} style={{
              padding:'7px 14px', borderRadius:100,
              border:`1px solid ${category===cat ? 'rgba(255,107,53,0.5)' : 'rgba(255,255,255,0.08)'}`,
              background: category===cat ? 'rgba(255,107,53,0.15)' : 'var(--bg-elevated)',
              color: category===cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize:13, fontWeight: category===cat ? 600 : 400,
              cursor:'pointer', whiteSpace:'nowrap', fontFamily:'Poppins,sans-serif',
              display:'flex', alignItems:'center', gap:5,
            }}>
              {CAT_META[cat].emoji} {CAT_META[cat].label}
            </motion.button>
          ))}
        </div>

        {/* ── Voice Search Bar ── */}
        <motion.div
          style={{
            position:'relative', marginBottom:12, borderRadius:100, background:'var(--bg-elevated)',
            border:`1px solid ${voicePhase==='listening' ? 'rgba(255,107,53,0.6)' : 'rgba(255,255,255,0.10)'}`,
            boxShadow: voicePhase==='listening' ? '0 0 0 3px rgba(255,107,53,0.15)' : 'none',
            transition:'all 0.2s ease', display:'flex', alignItems:'center', padding:'0 16px', height:50,
          }}
        >
          <Search size={16} color="var(--text-muted)" style={{ flexShrink:0, marginRight:10 }} />
          <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); if(voicePhase!=='idle') setVoicePhase('idle'); }}
            placeholder={t('searchSchemes')} style={{ flex:1, background:'transparent', border:'none', outline:'none', fontSize:14, padding:0, borderRadius:0, boxShadow:'none' }} />
          {voicePhase==='listening' && (
            <div style={{ display:'flex', gap:3, alignItems:'center', marginRight:10 }}>
              {[0,1,2,3].map(i => <div key={i} className="wave-bar" style={{ animationDelay:`${i*0.1}s`, height:4 }} />)}
            </div>
          )}
          {query && <motion.button initial={{ scale:0 }} animate={{ scale:1 }} onClick={clearSearch} style={{ background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', marginRight:6 }}><X size={14} color="var(--text-muted)" /></motion.button>}
          <motion.button onClick={runVoiceDemo} whileTap={{ scale:0.88 }} style={{ width:34, height:34, borderRadius:'50%', background: voicePhase!=='idle' ? 'var(--accent-primary)' : 'rgba(255,107,53,0.12)', border:`1px solid ${voicePhase!=='idle' ? 'var(--accent-primary)' : 'rgba(255,107,53,0.25)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, transition:'all 0.2s ease' }}>
            <Mic size={15} color={voicePhase!=='idle' ? 'white' : 'var(--accent-primary)'} />
          </motion.button>
        </motion.div>

        {/* ── Eligible Only Toggle ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ fontSize:12, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:5 }}>
            <Filter size={11} /> {displayedSchemes.length} scheme{displayedSchemes.length!==1?'s':''} found
            {query && <span style={{ color:'var(--accent-primary)' }}>for "{query}"</span>}
          </div>
          <motion.button
            onClick={() => setEligibleOnly(p => !p)}
            whileTap={{ scale:0.95 }}
            style={{
              display:'flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:100, cursor:'pointer', fontSize:12, fontWeight:600,
              background: eligibleOnly ? 'rgba(0,212,106,0.15)' : 'var(--bg-elevated)',
              border:`1px solid ${eligibleOnly ? 'rgba(0,212,106,0.35)' : 'rgba(255,255,255,0.08)'}`,
              color: eligibleOnly ? 'var(--accent-green)' : 'var(--text-secondary)',
              transition:'all 0.2s ease',
            }}
          >
            ✅ Eligible only
          </motion.button>
        </div>

        {/* ── Loading ── */}
        <AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, padding:'20px 0' }}>
              <LoadingDots /><span style={{ fontSize:13, color:'var(--text-secondary)' }}>Searching schemes...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Scheme Cards ── */}
        <AnimatePresence mode="wait">
          {!isLoading && (
            <motion.div key={`${category}-${eligibleOnly}-${voicePhase}`} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {displayedSchemes.length > 0 ? (
                displayedSchemes.map((scheme, i) => <SchemeCard key={scheme.id} scheme={scheme} index={i} onToast={onToast} />)
              ) : (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:'center', padding:'40px 20px' }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
                  <div style={{ fontSize:15, fontWeight:600, color:'var(--text-secondary)', marginBottom:6 }}>No schemes found</div>
                  <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:16 }}>Try different keywords or clear filters</div>
                  <motion.button whileTap={{ scale:0.96 }} onClick={clearSearch} className="btn-primary">Show All Schemes</motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
