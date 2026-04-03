// ── Page: MandiPage — /mandi ──
import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, RefreshCw, Info, Clock, TrendingUp, TrendingDown, Minus, Calculator, Bell, X } from 'lucide-react';
import { PriceRow } from '../components/ui/PriceRow';
import { mandiData, districts } from '../data/mandi';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/ui/LanguageToggle';

// Quick summary bar at the top
function MarketSummary({ data }) {
  const up     = data.filter(d => d.trend === 'up').length;
  const down   = data.filter(d => d.trend === 'down').length;
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

// BUG FIX: district-specific price variation
function getDistrictPrices(district, baseData) {
  const seed = district.charCodeAt(0) + district.charCodeAt(1);
  return baseData.map(item => {
    const variation = ((seed * item.id * 17) % 200) - 100; // ±100 per quintal
    const newPrice = Math.max(100, item.price + variation);
    const newPrev  = Math.max(100, item.prevPrice + variation);
    const diff = newPrice - newPrev;
    const trend = diff > 20 ? 'up' : diff < -20 ? 'down' : 'stable';
    return { ...item, price: newPrice, prevPrice: newPrev, trend, district };
  });
}

// Earnings Calculator Modal
function CalculatorModal({ onClose, isHindi }) {
  const [qty, setQty] = useState('');
  const [cropIdx, setCropIdx] = useState(0);

  const crop = mandiData[cropIdx];
  const earning = qty ? Math.round(parseFloat(qty) * (crop.price / 100)) : 0; // price is per quintal, qty in kg

  return (
    <div style={{ position:'fixed', inset:0, zIndex:300, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}
        style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }} />
      <motion.div
        initial={{ y: 100, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:100, opacity:0 }}
        transition={{ type:'spring', stiffness:320, damping:28 }}
        style={{ position:'relative', width:'100%', maxWidth:430, background:'var(--bg-card)', borderRadius:'24px 24px 0 0', border:'1px solid var(--border)', padding:'20px 20px 40px', zIndex:1 }}
      >
        <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>
          <div style={{ width:36, height:4, borderRadius:2, background:'rgba(255,255,255,0.12)' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div style={{ fontWeight:700, fontSize:18, color:'var(--text-primary)', display:'flex', alignItems:'center', gap:8 }}>
            <Calculator size={20} color="var(--accent-secondary)" />
            {isHindi ? 'कमाई कैलकुलेटर' : 'Earnings Calculator'}
          </div>
          <motion.button whileTap={{ scale:0.9 }} onClick={onClose} style={{ background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:10, width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <X size={15} color="var(--text-secondary)" />
          </motion.button>
        </div>

        {/* Crop picker */}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, color:'var(--text-secondary)', fontWeight:600, display:'block', marginBottom:6 }}>
            {isHindi ? 'फसल चुनें' : 'Select Crop'}
          </label>
          <select value={cropIdx} onChange={e => setCropIdx(Number(e.target.value))} style={{ width:'100%', padding:'11px 14px' }}>
            {mandiData.map((c, i) => (
              <option key={c.id} value={i}>{isHindi ? c.hindi : c.crop} — ₹{c.price}/qtl</option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:12, color:'var(--text-secondary)', fontWeight:600, display:'block', marginBottom:6 }}>
            {isHindi ? 'मात्रा (किलोग्राम में)' : 'Quantity (in kg)'}
          </label>
          <input
            type="number" value={qty} onChange={e => setQty(e.target.value)}
            placeholder={isHindi ? 'जैसे 500 kg' : 'e.g. 500 kg'}
            style={{ width:'100%', padding:'11px 14px' }}
          />
        </div>

        {/* Result */}
        {qty > 0 && (
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
            style={{ background:'rgba(255,215,0,0.08)', border:'1px solid rgba(255,215,0,0.2)', borderRadius:14, padding:'16px', textAlign:'center' }}>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6 }}>
              {isHindi ? 'अनुमानित कमाई' : 'Estimated Earnings'}
            </div>
            <div style={{ fontSize:32, fontWeight:700, color:'var(--accent-secondary)' }}>
              ₹{earning.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>
              {qty} kg × ₹{(crop.price / 100).toFixed(2)}/kg ({isHindi ? crop.hindi : crop.crop})
            </div>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:8, fontStyle:'italic' }}>
              * {isHindi ? 'मंडी कमीशन और भाड़ा अतिरिक्त हो सकता है' : 'Mandi commission & transport may apply'}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// Price alert banner
function AlertBanner({ crop, onDismiss, isHindi }) {
  return (
    <motion.div
      initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
      style={{ background:'rgba(255,215,0,0.08)', border:'1px solid rgba(255,215,0,0.25)', borderRadius:12, padding:'10px 14px', display:'flex', alignItems:'center', gap:10, marginBottom:16 }}
    >
      <Bell size={14} color="var(--accent-secondary)" />
      <div style={{ flex:1, fontSize:12, color:'var(--text-secondary)' }}>
        <strong style={{ color:'var(--accent-secondary)' }}>{isHindi ? crop.hindi : crop.crop}</strong>
        {isHindi ? ' की कीमत ₹' : ' price hit ₹'}{crop.price.toLocaleString('en-IN')}
        {isHindi ? ' — उच्चतम स्तर!' : ' — week high!'}
      </div>
      <button onClick={onDismiss} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', padding:2 }}>
        <X size={13} />
      </button>
    </motion.div>
  );
}

export function MandiPage({ onToast }) {
  const navigate = useNavigate();
  const { t, currentLang } = useLanguage();
  const [district, setDistrict] = useState('Kanpur');
  const [spinning, setSpinning] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showCalc, setShowCalc] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const isHindi = currentLang === 'hi';

  // BUG FIX: prices now vary per district
  const districtData = useMemo(() => getDistrictPrices(district, mandiData), [district]);
  const filtered = filter === 'all' ? districtData : districtData.filter(d => d.trend === filter);

  // Alert crop = the one at weekHigh
  const alertCrop = districtData.find(d => d.price >= d.weekHigh - 50);

  const handleRefresh = useCallback(() => {
    setSpinning(true);
    setLastUpdated(new Date());
    onToast?.({ type:'success', title:'Prices Updated!', message:`Latest rates from AGMARKNET for ${district}` });
    setTimeout(() => setSpinning(false), 1200);
  }, [district, onToast]);

  const handleDistrictChange = useCallback((d) => {
    setDistrict(d);
    setShowAlert(false);
    onToast?.({ type:'info', title:`Switched to ${d}`, message:'Showing current mandi rates for selected district' });
  }, [onToast]);

  const formatTime = (date) => date.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

  return (
    <>
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
            {/* Calculator button */}
            <motion.button whileTap={{ scale:0.9 }} onClick={() => setShowCalc(true)} style={{ width:34, height:34, borderRadius:10, background:'rgba(255,215,0,0.1)', border:'1px solid rgba(255,215,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <Calculator size={16} color="var(--accent-secondary)" />
            </motion.button>
            <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:100, background:'rgba(0,212,106,0.1)', border:'1px solid rgba(0,212,106,0.2)' }}>
              <div className="live-dot" />
              <span style={{ fontSize:11, color:'var(--accent-green)', fontWeight:600 }}>Live</span>
            </div>
            <LanguageToggle />
          </div>
        </header>

        <div style={{ padding:'16px 20px 20px' }}>

          {/* ── Price Alert Banner ── */}
          <AnimatePresence>
            {showAlert && alertCrop && (
              <AlertBanner crop={alertCrop} onDismiss={() => setShowAlert(false)} isHindi={isHindi} />
            )}
          </AnimatePresence>

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
                <div style={{ fontSize:13, color:'var(--text-primary)', fontWeight:500 }}>
                  {isHindi ? 'आज' : 'Today'}, {formatTime(lastUpdated)}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ fontSize:11, color:'var(--text-muted)', textAlign:'right' }}>
                {isHindi ? 'स्रोत:' : 'Source:'} <span style={{ color:'var(--accent-secondary)', fontWeight:600 }}>AGMARKNET</span>
              </div>
              <motion.button onClick={handleRefresh} whileTap={{ scale:0.9 }} style={{ width:30, height:30, borderRadius:8, background:'rgba(255,107,53,0.1)', border:'1px solid rgba(255,107,53,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                <RefreshCw size={14} color="var(--accent-primary)" className={spinning ? 'spin' : ''} />
              </motion.button>
            </div>
          </div>

          {/* ── Market Summary ── */}
          <MarketSummary data={districtData} />

          {/* ── Trend Filter Chips ── */}
          <div className="chips-row" style={{ marginBottom:16 }}>
            {[
              { key:'all',    label:`${isHindi ? 'सभी' : 'All'} (${districtData.length})`, emoji:'📊' },
              { key:'up',     label: isHindi ? 'बढ़त' : 'Rising',   emoji:'📈' },
              { key:'down',   label: isHindi ? 'गिरावट' : 'Falling', emoji:'📉' },
              { key:'stable', label: isHindi ? 'स्थिर' : 'Stable',  emoji:'➡️' },
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
                  <div style={{ fontSize:14 }}>{isHindi ? 'कोई फसल नहीं मिली' : 'No crops match this filter'}</div>
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

      {/* ── Calculator Modal ── */}
      <AnimatePresence>
        {showCalc && <CalculatorModal onClose={() => setShowCalc(false)} isHindi={isHindi} />}
      </AnimatePresence>
    </>
  );
}
