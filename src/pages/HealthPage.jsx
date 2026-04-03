// ── Page: HealthPage — /health ──
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, Navigation, Clock, MapPin, Heart, AlertTriangle, Mic, Send, Stethoscope, Activity } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/ui/LanguageToggle';

const FACILITIES = [
  { id:1, name:'PHC Kanpur Central', hindi:'पीएचसी कानपुर केंद्रीय', distance:'0.8 km', hours:'Open 24/7', type:'Primary Health Centre', typeHindi:'प्राथमिक स्वास्थ्य केंद्र', phone:'05122234567', open:true, emoji:'🏥', color:'#00D46A' },
  { id:2, name:'District Hospital', hindi:'जिला अस्पताल', distance:'2.1 km', hours:'8AM–8PM', type:'District Hospital', typeHindi:'जिला चिकित्सालय', phone:'05122345678', open:true, emoji:'🏨', color:'#FF6B35' },
  { id:3, name:'Jan Aushadhi Store', hindi:'जन औषधि भंडार', distance:'0.3 km', hours:'9AM–9PM', type:'Generic Medicines', typeHindi:'जेनेरिक दवा केंद्र', phone:'05122456789', open:true, emoji:'💊', color:'#FFD700' },
  { id:4, name:'ASHA Worker — Suman', hindi:'आशा कार्यकर्ता — सुमन', distance:'0.1 km', hours:'24/7', type:'Community Worker', typeHindi:'सामुदायिक कार्यकर्ता', phone:'9876501234', open:true, emoji:'👩‍⚕️', color:'#00D46A' },
];

const SYMPTOMS_GUIDE = [
  { symptom:'Fever / बुखार', advice:'Take paracetamol 500mg every 6 hrs. Visit PHC if temp > 102°F for 2+ days.', icon:'🌡️', color:'#FF6B35' },
  { symptom:'Chest Pain / सीने में दर्द', advice:'EMERGENCY — Call 112 immediately! Do not wait, go to hospital NOW.', icon:'❤️', urgent:true, color:'#FF4757' },
  { symptom:'Diarrhea / दस्त', advice:'Drink ORS every hour. See a doctor if stools are bloody or fever is high.', icon:'💧', color:'#FFD700' },
  { symptom:'Eye Issues / आंख की समस्या', advice:'Avoid rubbing. Use clean water. Visit the district eye clinic.', icon:'👁️', color:'#00D46A' },
  { symptom:'Snake Bite / सांप काटना', advice:'EMERGENCY — Call 112. Keep limb still, rush to hospital immediately.', icon:'🐍', urgent:true, color:'#FF4757' },
  { symptom:'Child Vaccination / टीकाकरण', advice:'Visit nearest Anganwadi or PHC. All vaccines FREE under UIP scheme.', icon:'💉', color:'#00D46A' },
  { symptom:'Pregnancy / गर्भावस्था', advice:'Register at nearest PHC for free ANC check-ups under PM Suraksha Indradhanush.', icon:'🤰', color:'#FF6B35' },
  { symptom:'Malaria / मलेरिया', advice:'Get blood test at district hospital. Free treatment under NVBDCP programme.', icon:'🦟', color:'#FFD700' },
];

const HEALTH_SCHEMES = [
  { name:'Ayushman Bharat', benefit:'₹5L health cover', color:'#00D46A', emoji:'🏥' },
  { name:'PM Suraksha Bima', benefit:'₹2L accident cover', color:'#FF6B35', emoji:'🛡️' },
  { name:'JSSK — Janani Shishu', benefit:'Free delivery care', color:'#FFD700', emoji:'👶' },
];

export function HealthPage({ onToast }) {
  const navigate = useNavigate();
  const { t, currentLang } = useLanguage();
  const [symptoms, setSymptoms] = useState('');
  const [guidance, setGuidance] = useState(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [activeTab, setActiveTab] = useState('checker'); // checker | facilities | schemes
  const isHindi = currentLang === 'hi';

  const handleGetGuidance = () => {
    if (!symptoms.trim()) {
      onToast?.({ type:'error', title:'No symptoms entered', message:'Please describe your symptoms first.' });
      return;
    }
    const s = symptoms.toLowerCase();
    let found = SYMPTOMS_GUIDE.find(g =>
      g.symptom.toLowerCase().split(' / ').some(w => s.includes(w.toLowerCase()))
    );
    if (!found) {
      found = { symptom:'General Advisory', advice:'Visit your nearest PHC with Ayushman Bharat card for a free consultation.', icon:'🩺', color:'#888' };
    }
    setGuidance(found);
    onToast?.({
      type: found.urgent ? 'error' : 'success',
      title: found.urgent ? '⚠️ Emergency!' : 'Guidance found!',
      message: found.urgent ? 'Call 112 immediately!' : 'See advice below.',
    });
  };

  const handleVoiceMic = () => {
    setVoiceActive(true); setSymptoms(''); setGuidance(null);
    const d = 'bukhar aur sir dard hai'; let i = 0;
    const iv = setInterval(() => {
      if (i <= d.length) { setSymptoms(d.slice(0, i)); i++; }
      else { clearInterval(iv); setVoiceActive(false); }
    }, 50);
  };

  const handleCall = (f) => {
    onToast?.({ type:'success', title:`Calling ${f.name}`, message:`Dialing ${f.phone}...` });
    setTimeout(() => { window.location.href = `tel:${f.phone}`; }, 500);
  };

  const handleDirections = (f) => {
    onToast?.({ type:'info', title:'Opening Maps', message:`Directions to ${f.name}` });
    setTimeout(() => window.open(`https://maps.google.com/?q=${encodeURIComponent(f.name+' Kanpur')}`, '_blank'), 400);
  };

  const TABS = [
    { key:'checker',    label:'Symptom Check', emoji:'🩺' },
    { key:'facilities', label:'Near Me',        emoji:'📍' },
    { key:'schemes',    label:'Schemes',        emoji:'🏥' },
  ];

  return (
    <motion.div
      initial={{ opacity:0, x:40 }}
      animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:-40 }}
      transition={{ duration:0.28, ease:'easeOut' }}
      className="screen-content"
    >
      {/* ── Page Header ── */}
      <header style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid var(--border)', background:'var(--bg-primary)', position:'sticky', top:0, zIndex:50 }}>
        <motion.button onClick={() => navigate('/')} whileTap={{ scale:0.9 }} style={{ width:36, height:36, borderRadius:10, background:'var(--bg-elevated)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
          <ArrowLeft size={18} color="var(--text-primary)" />
        </motion.button>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:20 }}>🏥</span>
            <span style={{ fontWeight:700, fontSize:20, color:'var(--text-primary)' }}>{t('healthHelp')}</span>
          </div>
          <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'Noto Sans Devanagari,sans-serif' }}>स्वास्थ्य सहायता</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ padding:'4px 10px', borderRadius:100, background:'rgba(0,212,106,0.10)', border:'1px solid rgba(0,212,106,0.2)', fontSize:11, color:'var(--accent-green)', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
            <Heart size={11} fill="currentColor" /> Free
          </div>
          <LanguageToggle />
        </div>
      </header>

      {/* ── Ayushman Active Banner ── */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.05 }} style={{ margin:'16px 20px 0', background:'rgba(0,212,106,0.07)', border:'1px solid rgba(0,212,106,0.2)', borderRadius:14, padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ fontSize:28, flexShrink:0 }}>🏥</div>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--accent-green)', marginBottom:2 }}>Ayushman Bharat Active</div>
          <div style={{ fontSize:12, color:'var(--text-secondary)' }}>₹5 Lakh free cover at 25,000+ hospitals · Zero paperwork</div>
        </div>
        <Activity size={20} color="var(--accent-green)" style={{ marginLeft:'auto', flexShrink:0 }} />
      </motion.div>

      {/* ── Section Tab Bar ── */}
      <div style={{ padding:'14px 20px 0' }}>
        <div style={{ display:'flex', background:'var(--bg-elevated)', borderRadius:12, padding:4, gap:4 }}>
          {TABS.map(tab => (
            <motion.button key={tab.key} onClick={() => setActiveTab(tab.key)} whileTap={{ scale:0.96 }} style={{
              flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'9px 4px',
              borderRadius:9, border:'none', cursor:'pointer', fontSize:12, fontWeight: activeTab===tab.key ? 700 : 400,
              background: activeTab===tab.key ? 'var(--accent-primary)' : 'transparent',
              color: activeTab===tab.key ? 'white' : 'var(--text-secondary)',
              transition:'all 0.2s ease', fontFamily:'Poppins,sans-serif',
            }}>
              {tab.emoji} {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ padding:'16px 20px 100px' }}>
        <AnimatePresence mode="wait">

          {/* ── Symptom Checker Tab ── */}
          {activeTab === 'checker' && (
            <motion.div key="checker" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.2 }}>
              {/* Checker Card */}
              <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:20, marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'rgba(0,212,106,0.12)', border:'1px solid rgba(0,212,106,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Stethoscope size={18} color="var(--accent-green)" />
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, color:'var(--text-primary)' }}>{t('symptomChecker')}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>Type or speak your symptoms</div>
                  </div>
                </div>
                <div style={{ position:'relative', marginBottom:12 }}>
                  <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder={t('describeSymptoms')} rows={3} style={{ width:'100%', resize:'none', padding:'12px 46px 12px 14px', lineHeight:1.6 }} />
                  <motion.button onClick={handleVoiceMic} whileTap={{ scale:0.88 }} style={{ position:'absolute', right:10, bottom:10, width:32, height:32, borderRadius:'50%', background: voiceActive ? 'var(--accent-primary)' : 'rgba(255,107,53,0.12)', border:`1px solid ${voiceActive ? 'var(--accent-primary)' : 'rgba(255,107,53,0.25)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                    <Mic size={14} color={voiceActive ? 'white' : 'var(--accent-primary)'} />
                  </motion.button>
                </div>
                <motion.button onClick={handleGetGuidance} whileTap={{ scale:0.97 }} className="btn-primary" style={{ width:'100%', justifyContent:'center', gap:8 }}>
                  <Send size={14} /> {t('getGuidance')}
                </motion.button>
                <AnimatePresence>
                  {guidance && (
                    <motion.div initial={{ opacity:0, height:0, marginTop:0 }} animate={{ opacity:1, height:'auto', marginTop:14 }} exit={{ opacity:0, height:0, marginTop:0 }} style={{ overflow:'hidden' }}>
                      <div style={{ padding:'14px', borderRadius:12, background: guidance.urgent ? 'rgba(255,71,87,0.1)' : 'rgba(0,212,106,0.08)', border:`1px solid ${guidance.urgent ? 'rgba(255,71,87,0.25)' : 'rgba(0,212,106,0.2)'}` }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                          <span style={{ fontSize:24 }}>{guidance.icon}</span>
                          <span style={{ fontSize:14, fontWeight:700, color: guidance.urgent ? 'var(--accent-red)' : 'var(--accent-green)' }}>{guidance.symptom}</span>
                        </div>
                        <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.7 }}>{guidance.advice}</div>
                        {guidance.urgent && (
                          <motion.a href="tel:112" whileTap={{ scale:0.96 }} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:12, background:'var(--accent-red)', color:'white', borderRadius:10, padding:'10px', fontSize:14, fontWeight:700, textDecoration:'none' }}>
                            <Phone size={14} fill="white" /> Call 112 Now
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Symptom Quick Grid */}
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.08em' }}>Tap a symptom</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {SYMPTOMS_GUIDE.map((s, i) => (
                  <motion.div key={i} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.04+i*0.04 }} whileTap={{ scale:0.96 }}
                    onClick={() => { setSymptoms(s.symptom.split(' / ')[0]); setGuidance(null); }}
                    style={{ background: s.urgent ? 'rgba(255,71,87,0.06)' : 'var(--bg-card)', border:`1px solid ${s.urgent ? 'rgba(255,71,87,0.2)' : 'var(--border)'}`, borderRadius:12, padding:'12px', cursor:'pointer', display:'flex', alignItems:'flex-start', gap:8 }}>
                    <span style={{ fontSize:20, flexShrink:0 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize:12, fontWeight:600, color: s.urgent ? 'var(--accent-red)' : 'var(--text-primary)', lineHeight:1.4 }}>{s.symptom}</div>
                      {s.urgent && <div style={{ fontSize:10, color:'var(--accent-red)', marginTop:2, fontWeight:600 }}>🚨 Emergency</div>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Nearby Facilities Tab ── */}
          {activeTab === 'facilities' && (
            <motion.div key="facilities" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.2 }}>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.08em', display:'flex', alignItems:'center', gap:6 }}>
                <MapPin size={12} /> {t('nearbyFacilities')} — Kanpur
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {FACILITIES.map((f, i) => (
                  <motion.div key={f.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }} whileHover={{ y:-2 }}
                    style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderLeft:`3px solid ${f.color}`, borderRadius:12, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:`${f.color}15`, border:`1px solid ${f.color}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{f.emoji}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:600, fontSize:14, color:'var(--text-primary)', marginBottom:2 }}>{isHindi ? f.hindi : f.name}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>{isHindi ? f.typeHindi : f.type}</div>
                      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                        <span style={{ fontSize:11, color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:3 }}><MapPin size={10} /> {f.distance}</span>
                        <span style={{ fontSize:11, color:'var(--accent-green)', fontWeight:600, display:'flex', alignItems:'center', gap:3 }}><Clock size={10} /> {f.hours}</span>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                      <motion.button whileTap={{ scale:0.88 }} onClick={() => handleCall(f)} style={{ width:34, height:34, borderRadius:10, background:'rgba(0,212,106,0.1)', border:'1px solid rgba(0,212,106,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                        <Phone size={14} color="var(--accent-green)" />
                      </motion.button>
                      <motion.button whileTap={{ scale:0.88 }} onClick={() => handleDirections(f)} style={{ width:34, height:34, borderRadius:10, background:'rgba(255,107,53,0.1)', border:'1px solid rgba(255,107,53,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                        <Navigation size={14} color="var(--accent-primary)" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Health Schemes Tab ── */}
          {activeTab === 'schemes' && (
            <motion.div key="schemes" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.2 }}>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.08em' }}>Health-related Schemes</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
                {HEALTH_SCHEMES.map((s, i) => (
                  <motion.div key={i} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }}
                    style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderLeft:`3px solid ${s.color}`, borderRadius:12, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ fontSize:28, flexShrink:0 }}>{s.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14, color:'var(--text-primary)', marginBottom:2 }}>{s.name}</div>
                      <div style={{ fontSize:12, color:'var(--text-secondary)' }}>{s.benefit}</div>
                    </div>
                    <motion.button whileTap={{ scale:0.96 }} onClick={() => navigate('/schemes?cat=health')} className="btn-primary" style={{ fontSize:12, padding:'7px 14px', flexShrink:0 }}>
                      Apply →
                    </motion.button>
                  </motion.div>
                ))}
              </div>
              <motion.button whileTap={{ scale:0.96 }} onClick={() => navigate('/schemes?cat=health')} className="btn-secondary" style={{ width:'100%', justifyContent:'center' }}>
                View all health schemes →
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Emergency Strip ── */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
        style={{ position:'sticky', bottom:72, left:0, right:0, padding:'12px 20px', background:'rgba(255,71,87,0.12)', borderTop:'1px solid rgba(255,71,87,0.25)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, backdropFilter:'blur(16px)', zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <AlertTriangle size={18} color="var(--accent-red)" />
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{t('emergency')}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)' }}>Fire · Police · Ambulance</div>
          </div>
        </div>
        <motion.a href="tel:112" whileTap={{ scale:0.95 }} style={{ background:'var(--accent-red)', color:'white', border:'none', borderRadius:12, padding:'10px 20px', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, textDecoration:'none', boxShadow:'0 4px 16px rgba(255,71,87,0.4)' }}>
          <Phone size={14} fill="white" /> {t('callNow')}
        </motion.a>
      </motion.div>
    </motion.div>
  );
}
