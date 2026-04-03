// ── SplashScreen.jsx — Motion graphics intro ──
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Animated counter — plain state, no MotionValue ──
function AnimatedCounter({ target, duration = 1.4, suffix = '', active }) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, duration]);

  return <>{value.toLocaleString('en-IN')}{suffix}</>;
}

// ── Floating particle ──
function Particle({ x, y, size, emoji, delay, duration }) {
  return (
    <motion.div
      style={{ position:'absolute', left:`${x}%`, top:`${y}%`, fontSize:size, pointerEvents:'none', userSelect:'none', zIndex:0, filter:'blur(0.4px)' }}
      initial={{ opacity:0, scale:0, rotate:-20 }}
      animate={{ opacity:[0,0.4,0.15,0.4,0], scale:[0,1,0.9,1,0], rotate:[-20,10,-5,15,-10], y:[0,-30,-60,-40,-80] }}
      transition={{ delay, duration, repeat:Infinity, repeatDelay:Math.random()*2+1, ease:'easeInOut' }}
    >
      {emoji}
    </motion.div>
  );
}

// ── SVG progress ring ──
function ProgressRing({ progress, size = 160, stroke = 2 }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} style={{ position:'absolute', top:0, left:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,107,53,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset} transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition:'stroke-dashoffset 0.05s linear' }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Letter-by-letter animated word ──
function AnimatedText({ text, delay = 0, stagger = 0.06 }) {
  return (
    <span style={{ display:'inline-flex', overflow:'visible' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity:0, y:30, rotateX:-90 }}
          animate={{ opacity:1, y:0, rotateX:0 }}
          transition={{ delay: delay + i * stagger, duration:0.4, ease:[0.22,1,0.36,1] }}
          style={{ display:'inline-block', transformOrigin:'bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

const PARTICLES = [
  { x:8,  y:15, size:20, emoji:'🌾', delay:0.2, duration:5 },
  { x:88, y:10, size:16, emoji:'🌱', delay:0.8, duration:6 },
  { x:15, y:70, size:14, emoji:'🌻', delay:1.2, duration:7 },
  { x:80, y:65, size:18, emoji:'🌾', delay:0.5, duration:5.5 },
  { x:45, y:8,  size:12, emoji:'✨', delay:1.5, duration:4 },
  { x:92, y:40, size:15, emoji:'🌿', delay:0.3, duration:6.5 },
  { x:5,  y:45, size:13, emoji:'🌸', delay:1.0, duration:5 },
  { x:55, y:85, size:16, emoji:'🌾', delay:0.7, duration:7 },
  { x:30, y:80, size:14, emoji:'💫', delay:1.8, duration:4.5 },
  { x:70, y:20, size:12, emoji:'🌱', delay:0.4, duration:6 },
  { x:20, y:30, size:10, emoji:'✨', delay:2.0, duration:5 },
  { x:75, y:85, size:11, emoji:'🌿', delay:1.3, duration:6 },
];

const STATS = [
  { target:20,  suffix:'',   label:'Govt Schemes', emoji:'📋', color:'#FF6B35', duration:1.2 },
  { target:50,  suffix:'M+', label:'Rural Users',  emoji:'👥', color:'#FFD700', duration:1.4 },
  { target:22,  suffix:'',   label:'Languages',    emoji:'🗣️', color:'#00D46A', duration:1.0 },
];

export function SplashScreen({ onComplete }) {
  const [phase, setPhase]         = useState(0);
  const [progress, setProgress]   = useState(0);
  const [startCounts, setStartCounts] = useState(false);
  const [exiting, setExiting]     = useState(false);
  const intervalRef = useRef(null);
  const exitedRef   = useRef(false);

  // Phase timeline
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1700),
      setTimeout(() => { setPhase(4); setStartCounts(true); }, 2400),
      setTimeout(() => setPhase(5), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Progress bar over ~4 seconds
  useEffect(() => {
    let p = 0;
    intervalRef.current = setInterval(() => {
      p = Math.min(p + 1.6, 100);
      setProgress(p);
      if (p >= 100) clearInterval(intervalRef.current);
    }, 60);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Auto-dismiss after 4.5s
  useEffect(() => {
    const t = setTimeout(handleComplete, 4500);
    return () => clearTimeout(t);
  }, []);

  const handleComplete = () => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    clearInterval(intervalRef.current);
    setExiting(true);
    setTimeout(onComplete, 700);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="splash"
          initial={{ opacity:1 }}
          exit={{ opacity:0, scale:1.04 }}
          transition={{ duration:0.65, ease:'easeInOut' }}
          onClick={phase >= 4 ? handleComplete : undefined}
          style={{
            position:'fixed', inset:0, zIndex:9999,
            background:'#080808',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            overflow:'hidden', cursor: phase >= 4 ? 'pointer' : 'default',
          }}
        >
          {/* Background radial glow */}
          <motion.div
            initial={{ scale:0, opacity:0 }}
            animate={phase >= 1 ? { scale:1, opacity:1 } : {}}
            transition={{ duration:1.2, ease:'easeOut' }}
            style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,53,0.12) 0%, rgba(255,107,53,0.04) 50%, transparent 70%)', pointerEvents:'none' }}
          />

          {/* Gold accent glow */}
          <motion.div
            initial={{ scale:0, opacity:0 }}
            animate={phase >= 2 ? { scale:1, opacity:0.6 } : {}}
            transition={{ duration:1.4, delay:0.3 }}
            style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,215,0,0.07) 0%, transparent 70%)', top:'20%', right:'10%', pointerEvents:'none' }}
          />

          {/* Subtle grid */}
          <motion.div
            initial={{ opacity:0 }}
            animate={phase >= 1 ? { opacity:1 } : {}}
            transition={{ duration:1.5 }}
            style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(255,107,53,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,0.03) 1px,transparent 1px)', backgroundSize:'40px 40px' }}
          />

          {/* Particles */}
          {phase >= 1 && PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

          {/* Main content */}
          <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'0 32px' }}>

            {/* Logo + rings */}
            <div style={{ position:'relative', width:160, height:160, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:28 }}>
              <ProgressRing progress={progress} size={160} stroke={2} />

              {/* Rotating outer ring */}
              <motion.div
                animate={{ rotate:360 }}
                transition={{ duration:20, repeat:Infinity, ease:'linear' }}
                style={{ position:'absolute', inset:-6, borderRadius:'50%', border:'1px solid transparent', borderTopColor:'rgba(255,107,53,0.25)', borderRightColor:'rgba(255,215,0,0.15)' }}
              />
              {/* Counter-rotating dashed ring */}
              <motion.div
                animate={{ rotate:-360 }}
                transition={{ duration:30, repeat:Infinity, ease:'linear' }}
                style={{ position:'absolute', inset:8, borderRadius:'50%', border:'1px dashed rgba(255,107,53,0.12)' }}
              />

              {/* Wheat emoji */}
              <motion.div
                initial={{ scale:0, rotate:-180, opacity:0 }}
                animate={phase >= 1 ? { scale:[0,1.3,1], rotate:[-180,10,0], opacity:1 } : {}}
                transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}
                style={{ fontSize:72, lineHeight:1, filter:'drop-shadow(0 0 24px rgba(255,107,53,0.5)) drop-shadow(0 0 8px rgba(255,215,0,0.3))', position:'relative', zIndex:2 }}
              >
                🌾
              </motion.div>

              {/* Pulse halos */}
              {phase >= 1 && [0,1,2].map(i => (
                <motion.div
                  key={i}
                  style={{ position:'absolute', inset:20, borderRadius:'50%', border:'1px solid rgba(255,107,53,0.3)', pointerEvents:'none' }}
                  animate={{ scale:[1,2.2,1], opacity:[0.4,0,0.4] }}
                  transition={{ duration:2.5, repeat:Infinity, delay:i*0.7, ease:'easeInOut' }}
                />
              ))}
            </div>

            {/* App name */}
            {phase >= 2 && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ marginBottom:6 }}>
                <div style={{
                  fontSize:52, fontWeight:700, letterSpacing:'-0.04em',
                  background:'linear-gradient(135deg, #FF6B35 0%, #FFD700 50%, #FF6B35 100%)',
                  backgroundSize:'200% 100%',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                  fontFamily:'Poppins,sans-serif', display:'flex', lineHeight:1.1,
                }}>
                  <AnimatedText text="GramSeva" delay={0} stagger={0.07} />
                </div>
              </motion.div>
            )}

            {/* Hindi sub-title */}
            {phase >= 2 && (
              <motion.div
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.65, duration:0.5 }}
                style={{ fontSize:20, fontWeight:600, color:'rgba(255,107,53,0.7)', fontFamily:'Noto Sans Devanagari,sans-serif', marginBottom:18 }}
              >
                ग्रामसेवा
              </motion.div>
            )}

            {/* Tagline */}
            {phase >= 3 && (
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} style={{ marginBottom:36 }}>
                <div style={{ fontSize:14, fontWeight:600, color:'#666', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:5 }}>
                  Apni Awaaz · Apna Adhikar
                </div>
                <motion.div
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.5 }}
                  style={{ fontSize:14, color:'#444', fontFamily:'Noto Sans Devanagari,sans-serif' }}
                >
                  अपनी आवाज़, अपना अधिकार
                </motion.div>
              </motion.div>
            )}

            {/* Stats */}
            {phase >= 4 && (
              <motion.div
                initial={{ opacity:0, y:24, scale:0.95 }}
                animate={{ opacity:1, y:0, scale:1 }}
                transition={{ type:'spring', stiffness:280, damping:24 }}
                style={{ display:'flex', marginBottom:44, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20, overflow:'hidden' }}
              >
                {STATS.map((stat, i) => (
                  <div key={i} style={{
                    display:'flex', flexDirection:'column', alignItems:'center',
                    padding:'16px 24px', minWidth:90,
                    borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}>
                    <div style={{ fontSize:22, marginBottom:4 }}>{stat.emoji}</div>
                    <div style={{ fontWeight:700, fontSize:26, color:stat.color, lineHeight:1, fontFamily:'Poppins,sans-serif' }}>
                      <AnimatedCounter target={stat.target} suffix={stat.suffix} duration={stat.duration} active={startCounts} />
                    </div>
                    <div style={{ fontSize:11, color:'#555', marginTop:4, fontWeight:500 }}>{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* CTA */}
            {phase >= 5 && (
              <motion.div
                initial={{ opacity:0, scale:0.8, y:16 }}
                animate={{ opacity:1, scale:1, y:0 }}
                transition={{ type:'spring', stiffness:300, damping:20 }}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}
              >
                <motion.button
                  onClick={handleComplete}
                  whileHover={{ scale:1.05 }}
                  whileTap={{ scale:0.96 }}
                  animate={{ boxShadow:['0 0 20px rgba(255,107,53,0.3)','0 0 40px rgba(255,107,53,0.55)','0 0 20px rgba(255,107,53,0.3)'] }}
                  transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut' }}
                  style={{ background:'linear-gradient(135deg,#FF6B35,#e05520)', color:'white', border:'none', borderRadius:100, padding:'14px 40px', fontSize:16, fontWeight:700, cursor:'pointer', fontFamily:'Poppins,sans-serif', display:'flex', alignItems:'center', gap:10 }}
                >
                  <span>Get Started</span>
                  <motion.span animate={{ x:[0,5,0] }} transition={{ duration:1.2, repeat:Infinity, ease:'easeInOut' }} style={{ fontSize:20 }}>→</motion.span>
                </motion.button>
                <motion.div animate={{ opacity:[0.35,0.8,0.35] }} transition={{ duration:1.5, repeat:Infinity }} style={{ fontSize:12, color:'#3a3a3a', letterSpacing:'0.08em', textTransform:'uppercase' }}>
                  or tap anywhere to continue
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Bottom strip */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={phase >= 3 ? { opacity:1, y:0 } : {}}
            transition={{ delay:0.4, duration:0.5 }}
            style={{ position:'absolute', bottom:32, left:0, right:0, display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:12, color:'#2e2e2e' }}
          >
            <span>Made with</span>
            <motion.span animate={{ scale:[1,1.35,1] }} transition={{ duration:1.2, repeat:Infinity }} style={{ fontSize:14 }}>❤️</motion.span>
            <span>for Rural India 🇮🇳</span>
          </motion.div>

          {/* Version badge */}
          <motion.div
            initial={{ opacity:0 }}
            animate={phase >= 4 ? { opacity:1 } : {}}
            style={{ position:'absolute', top:20, right:20, fontSize:11, color:'#2a2a2a', fontWeight:600 }}
          >
            v1.0.0
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
