// ── Page: MandiPage — /mandi ──
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, RefreshCw, Info, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PriceRow } from '../components/ui/PriceRow';
import { mandiData, districts } from '../data/mandi';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/ui/LanguageToggle';

// Quick summary bar at the top
function MarketSummary({ data }) {
  const up   = data.filter(d => d.trend === 'up').length;
  const down  = data.filter(d => d.trend === 'down').length;
  const stable = data.filter(d => d.trend === 'stable').length;
  return (
    <div style={{ display:'flex', gap:10, marginBottom:20 }}>
      {[
        { label:'Rising', count:up,     color:'var(--accent-green)', icon:<TrendingUp  size={14}/> },
        { label:'Falling', count:down,  color:'var(--accent-red)',   icon:<TrendingDown size={14}/> },
        { label:'Stable',  count:stable, color:'var(--text-secondary)', icon:<Minus size={14}/> },
      ].map(s => (
        <div key={s.label} style={{ flex:1, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:12, padding:'12px', textAlign:'center' }}>
          <div style={{ color:s.color, display:'flex', alignItems:'center', justifyContent:'center', gap:4, marginBottom:4 }}>{s.icon}</div>
          <div style={{ fontWeight:700, fontSize:20, color:s.color }}>{s.count}</div>
          <div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function MandiPage({ onToast }) {
  const navigate = useNavigate();
  const { t, currentLang } = useLanguage();
  const [district, setDistrict] = useState('Kanpur');
  const [spinning, setSpinning] = useState(false);
  const [filter, setFilter] = useState('all'); // all | up | down | stable
  const isHindi = currentLang === 'hi';

  const handleRefresh = () => {
    setSpinning(true);
    onToast?.({ type:'success', title:'Prices Updated!', message:`Latest rates from AGMARKNET for ${district}` });
    setTimeout(() => setSpinning(false), 1200);
  };

  const handleDistrictChange = (d) => {
    setDistrict(d);
    onToast?.({ type:'info', title:`Switched to ${d}`, message:'Showing current mandi rates for selected district' });
  };

  const filtered = filter === 'all' ? mandiData : mandiData.filter(d => d.trend === filter);

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
            <span style={{ fontSize:20 }}>📈</span>
            <span style={{ fontWeight:700, fontSize:20, color:'var(--text-primary)' }}>{t('mandiPrices')}</span>
          </div>
          <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'Noto Sans Devanagari,sans-serif' }}>मंडी भाव — {district}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:100, background:'rgba(0,212,106,0.1)', border:'1px solid rgba(0,212,106,0.2)' }}>
            <div className="live-dot" />
            <span style={{ fontSize:11, color:'var(--accent-green)', fontWeight:600 }}>Live</span>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <div style={{ padding:'16px 20px 20px' }}>

        {/* ── District Selector ── */}
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, color:'var(--text-secondary)', fontWeight:700, display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.08em' }}>
            {t('selectDistrict')}
          </label>
          <div style={{ position:'relative' }}>
            <MapPin size={16} color="var(--accent-primary)" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', zIndex:1, pointerEvents:'none' }} />
            <select value={district} onChange={e => handleDistrictChange(e.target.value)} style={{ width:'100%', padding:'11px 14px 11px 38px', appearance:'none', WebkitAppearance:'none', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:500 }}>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--text-secondary)', fontSize:10 }}>▼</div>
          </div>
        </div>

        {/* ── Last Updated Bar ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:12, padding:'10px 14px', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Clock size={14} color="var(--text-secondary)" />
            <div>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>{t('lastUpdated')}</div>
              <div style={{ fontSize:13, color:'var(--text-primary)', fontWeight:500 }}>Today, 9:00 AM</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ fontSize:11, color:'var(--text-muted)', textAlign:'right' }}>
              Source: <span style={{ color:'var(--accent-secondary)', fontWeight:600 }}>AGMARKNET</span>
            </div>
            <motion.button onClick={handleRefresh} whileTap={{ scale:0.9 }} style={{ width:30, height:30, borderRadius:8, background:'rgba(255,107,53,0.1)', border:'1px solid rgba(255,107,53,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <RefreshCw size={14} color="var(--accent-primary)" className={spinning ? 'spin' : ''} />
            </motion.button>
          </div>
        </div>

        {/* ── Market Summary ── */}
        <MarketSummary data={mandiData} />

        {/* ── Trend Filter Chips ── */}
        <div className="chips-row" style={{ marginBottom:16 }}>
          {[
            { key:'all',    label:`All (${mandiData.length})`, emoji:'📊' },
            { key:'up',     label:'Rising',   emoji:'📈' },
            { key:'down',   label:'Falling',  emoji:'📉' },
            { key:'stable', label:'Stable',   emoji:'➡️' },
          ].map(f => (
            <motion.button key={f.key} onClick={() => setFilter(f.key)} whileTap={{ scale:0.93 }} style={{
              padding:'7px 14px', borderRadius:100,
              border:`1px solid ${filter===f.key ? 'rgba(255,107,53,0.5)' : 'rgba(255,255,255,0.08)'}`,
              background: filter===f.key ? 'rgba(255,107,53,0.15)' : 'var(--bg-elevated)',
              color: filter===f.key ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize:13, fontWeight: filter===f.key ? 600 : 400,
              cursor:'pointer', whiteSpace:'nowrap', fontFamily:'Poppins,sans-serif',
              display:'flex', alignItems:'center', gap:5,
            }}>
              {f.emoji} {f.label}
            </motion.button>
          ))}
        </div>

        {/* ── Price Table ── */}
        <AnimatePresence mode="wait">
          <motion.div key={`${district}-${filter}`} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }} style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
            {filtered.map((item, i) => <PriceRow key={item.id} item={item} index={i} />)}
            {filtered.length === 0 && (
              <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-muted)' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
                <div style={{ fontSize:14 }}>No crops match this filter</div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Disclaimer ── */}
        <div style={{ display:'flex', gap:8, padding:'12px', background:'rgba(255,215,0,0.05)', border:'1px solid rgba(255,215,0,0.15)', borderRadius:10 }}>
          <Info size={14} color="var(--accent-secondary)" style={{ flexShrink:0, marginTop:2 }} />
          <p style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.6 }}>{t('disclaimer')}</p>
        </div>
      </div>
    </motion.div>
  );
}
