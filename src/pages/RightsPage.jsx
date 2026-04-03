// ── Page: RightsPage — /rights ──
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Scale, FileText, Phone, ChevronDown, ChevronUp,
  AlertCircle, BookOpen, Gavel, Shield, Users, Search, X
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/ui/LanguageToggle';

const RIGHTS_DATA = [
  {
    id: 1,
    category: 'land',
    icon: '🌍',
    color: '#FF6B35',
    title: 'Land Rights',
    titleHindi: 'भूमि अधिकार',
    items: [
      {
        q: 'What is the right to khatauni / land record?',
        qH: 'खतौनी/भूमि अभिलेख का अधिकार क्या है?',
        a: 'Every farmer has the right to obtain a copy of their land records (Khatauni) free of cost from the Tehsildar or online via UP Bhulekh portal. This document proves ownership and is required for all government schemes.',
        aH: 'हर किसान को तहसीलदार से या UP Bhulekh पोर्टल से मुफ्त में अपनी खतौनी की प्रति लेने का अधिकार है।',
      },
      {
        q: 'Can I be evicted from my land without a court order?',
        qH: 'क्या बिना कोर्ट आदेश के मुझे जमीन से निकाला जा सकता है?',
        a: 'No. Under the Land Acquisition Act and Revenue Code, no one can evict you from your registered land without a valid court order. If threatened, file an FIR at the nearest police station immediately.',
        aH: 'नहीं। भूमि अधिग्रहण कानून के तहत बिना कोर्ट आदेश के कोई आपको जमीन से नहीं निकाल सकता।',
      },
      {
        q: 'What is Fair Compensation under Land Acquisition?',
        qH: 'भूमि अधिग्रहण में उचित मुआवजा क्या है?',
        a: 'Under the Right to Fair Compensation Act 2013, if the government acquires your land, you are entitled to 2x the market rate in rural areas and compensation for all structures, crops, and livelihood loss.',
        aH: '2013 के कानून के तहत ग्रामीण क्षेत्र में बाजार मूल्य का 2 गुना मुआवजा अनिवार्य है।',
      },
    ],
  },
  {
    id: 2,
    category: 'labour',
    icon: '⚒️',
    color: '#FFD700',
    title: 'Labour Rights',
    titleHindi: 'श्रमिक अधिकार',
    items: [
      {
        q: 'What is the minimum wage for agricultural workers?',
        qH: 'कृषि मजदूरों के लिए न्यूनतम मजदूरी क्या है?',
        a: 'Minimum wages vary by state. In UP, the minimum wage for unskilled agricultural worker is ₹230–250/day (revised annually). Employers must pay at least this. Complaint: Labour Commissioner office or 1800-180-1188.',
        aH: 'UP में अकुशल कृषि मजदूर को न्यूनतम ₹230–250/दिन मिलना अनिवार्य है। शिकायत: 1800-180-1188।',
      },
      {
        q: 'Can employers make me work more than 8 hours/day?',
        qH: 'क्या नियोक्ता मुझसे 8 घंटे से अधिक काम करवा सकता है?',
        a: 'No. Under the Factories Act and various Labour Laws, working hours are capped at 8 hours/day and 48 hours/week. Any overtime must be paid at double the normal wage rate.',
        aH: 'नहीं। 8 घंटे/दिन और 48 घंटे/सप्ताह से अधिक काम कराना कानूनन गलत है। ओवरटाइम दोगुना मिलना चाहिए।',
      },
      {
        q: 'How do I get a job card under MGNREGA?',
        qH: 'मनरेगा के तहत जॉब कार्ड कैसे मिलेगा?',
        a: 'Submit an application at your Gram Panchayat office with Aadhaar card. You are legally entitled to receive a job card within 15 days, and work must be provided within 15 days of requesting employment or you get an unemployment allowance.',
        aH: 'ग्राम पंचायत में आधार के साथ आवेदन करें। 15 दिनों में जॉब कार्ड मिलना अनिवार्य है।',
      },
    ],
  },
  {
    id: 3,
    category: 'rti',
    icon: '📜',
    color: '#00D46A',
    title: 'Right to Information (RTI)',
    titleHindi: 'सूचना का अधिकार (RTI)',
    items: [
      {
        q: 'How do I file an RTI application?',
        qH: 'RTI आवेदन कैसे दाखिल करें?',
        a: 'Write or type your application to the Public Information Officer (PIO) of the relevant department. Pay ₹10 application fee (BPL citizens are exempt). You must receive a response within 30 days. Apply online at rtionline.gov.in.',
        aH: 'संबंधित विभाग के PIO को ₹10 शुल्क के साथ आवेदन करें (BPL मुफ्त)। 30 दिन में जवाब अनिवार्य है। rtionline.gov.in पर ऑनलाइन करें।',
      },
      {
        q: 'What if the government does not respond to RTI in 30 days?',
        qH: 'अगर 30 दिन में RTI का जवाब न मिले तो?',
        a: 'You can file a First Appeal with the First Appellate Authority (FAA) within 30 days of the deadline. If still unsatisfied, file a Second Appeal with the State Information Commission (SIC). The PIO can be fined ₹25,000 for non-compliance.',
        aH: 'FAA को प्रथम अपील करें। फिर भी न मिले तो State Information Commission में दूसरी अपील करें। PIO को ₹25,000 जुर्माना हो सकता है।',
      },
    ],
  },
  {
    id: 4,
    category: 'consumer',
    icon: '🛡️',
    color: '#8B5CF6',
    title: 'Consumer Rights',
    titleHindi: 'उपभोक्ता अधिकार',
    items: [
      {
        q: 'I was cheated by a trader/shopkeeper. What can I do?',
        qH: 'दुकानदार ने ठगा तो क्या करें?',
        a: 'File a complaint at the District Consumer Forum within 2 years of the incident. Claims up to ₹1 Crore are handled here at no court fee. National Consumer Helpline: 1800-11-4000 (toll-free).',
        aH: 'घटना के 2 साल के भीतर जिला उपभोक्ता फोरम में शिकायत करें। ₹1 करोड़ तक के दावे मुफ्त। हेल्पलाइन: 1800-11-4000।',
      },
      {
        q: 'What if a shopkeeper sells adulterated seeds or fertilizers?',
        qH: 'अगर दुकानदार मिलावटी बीज/उर्वरक बेचे तो?',
        a: 'Report to the District Agriculture Officer and file an FIR. Under the Seeds Act and Essential Commodities Act, sellers of adulterated agri-inputs face imprisonment up to 3 years and heavy fines.',
        aH: 'जिला कृषि अधिकारी और पुलिस में FIR दर्ज करें। 3 साल जेल और भारी जुर्माने का प्रावधान है।',
      },
    ],
  },
];

const HELPLINES = [
  { name: 'PM Kisan Helpline', number: '155261', emoji: '🌾', desc: 'Farmer scheme queries' },
  { name: 'Kisan Call Centre', number: '1800-180-1551', emoji: '📞', desc: 'Free agri advisory' },
  { name: 'Consumer Helpline', number: '1800-11-4000', emoji: '🛡️', desc: 'Consumer complaints' },
  { name: 'Labour Helpline', number: '1800-180-1188', emoji: '⚒️', desc: 'Labour rights' },
  { name: 'Legal Aid', number: '15100', emoji: '⚖️', desc: 'Free legal help' },
  { name: 'Lok Adalat', number: '1800-11-4000', emoji: '🏛️', desc: 'Alternate dispute' },
];

function FaqItem({ item, isHindi }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(p => !p)}
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        marginBottom: 8,
        transition: 'border-color 0.2s ease',
        ...(open ? { borderColor: 'rgba(255,107,53,0.3)' } : {}),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px', gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, flex: 1 }}>
          {isHindi ? item.qH : item.q}
        </div>
        <div style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 14px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, borderTop: '1px solid var(--border)' }}>
              <div style={{ paddingTop: 12 }}>
                {isHindi ? item.aH : item.a}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function RightsPage({ onToast }) {
  const navigate = useNavigate();
  const { t, currentLang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isHindi = currentLang === 'hi';

  const CATS = [
    { key: 'all', label: 'All', labelH: 'सभी', emoji: '📋' },
    { key: 'land', label: 'Land', labelH: 'भूमि', emoji: '🌍' },
    { key: 'labour', label: 'Labour', labelH: 'श्रमिक', emoji: '⚒️' },
    { key: 'rti', label: 'RTI', labelH: 'RTI', emoji: '📜' },
    { key: 'consumer', label: 'Consumer', labelH: 'उपभोक्ता', emoji: '🛡️' },
  ];

  const filtered = RIGHTS_DATA.filter(section => {
    if (activeCategory !== 'all' && section.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return section.items.some(item =>
        item.q.toLowerCase().includes(q) ||
        item.qH.includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.aH.includes(q)
      );
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="screen-content"
    >
      {/* ── Header ── */}
      <header style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)', background: 'var(--bg-primary)', position: 'sticky', top: 0, zIndex: 50 }}>
        <motion.button onClick={() => navigate('/')} whileTap={{ scale: 0.9 }} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={18} color="var(--text-primary)" />
        </motion.button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>⚖️</span>
            <span style={{ fontWeight: 700, fontSize: 20, color: 'var(--text-primary)' }}>
              {isHindi ? 'अधिकार जानें' : 'Know Your Rights'}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Noto Sans Devanagari,sans-serif' }}>
            कानूनी मार्गदर्शन — Free Legal Guidance
          </div>
        </div>
        <LanguageToggle />
      </header>

      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
        style={{ margin: '16px 20px 0', background: 'linear-gradient(135deg, rgba(130,100,255,0.15), rgba(80,60,200,0.08))', border: '1px solid rgba(130,100,255,0.25)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}
      >
        <div style={{ fontSize: 40, flexShrink: 0 }}>⚖️</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 3 }}>
            {isHindi ? 'आपके कानूनी अधिकार' : 'Your Legal Rights'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {isHindi
              ? 'भूमि, श्रम, RTI और उपभोक्ता अधिकारों की पूरी जानकारी मुफ्त में'
              : 'Free guidance on land, labour, RTI & consumer rights in simple language'}
          </div>
        </div>
      </motion.div>

      <div style={{ padding: '16px 20px 20px' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={isHindi ? 'अधिकार खोजें...' : 'Search your rights...'}
            style={{ width: '100%', padding: '11px 40px 11px 40px' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="chips-row" style={{ marginBottom: 20 }}>
          {CATS.map(c => (
            <motion.button key={c.key} onClick={() => setActiveCategory(c.key)} whileTap={{ scale: 0.93 }} style={{
              padding: '7px 14px', borderRadius: 100,
              border: `1px solid ${activeCategory === c.key ? 'rgba(130,100,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
              background: activeCategory === c.key ? 'rgba(130,100,255,0.15)' : 'var(--bg-elevated)',
              color: activeCategory === c.key ? '#a78bfa' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: activeCategory === c.key ? 600 : 400,
              cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Poppins,sans-serif',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {c.emoji} {isHindi ? c.labelH : c.label}
            </motion.button>
          ))}
        </div>

        {/* Sections */}
        <AnimatePresence mode="wait">
          <motion.div key={`${activeCategory}-${searchQuery}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                <div style={{ fontSize: 14 }}>No results found</div>
              </div>
            ) : (
              filtered.map((section, si) => (
                <motion.div key={section.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.06 }} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${section.color}18`, border: `1px solid ${section.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      {section.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                        {isHindi ? section.titleHindi : section.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{section.items.length} topics</div>
                    </div>
                  </div>
                  {section.items.map((item, ii) => <FaqItem key={ii} item={item} isHindi={isHindi} />)}
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Helplines */}
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Phone size={12} /> {isHindi ? 'महत्वपूर्ण हेल्पलाइन' : 'Important Helplines'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {HELPLINES.map((h, i) => (
              <motion.a
                key={i}
                href={`tel:${h.number}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.96 }}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px', textDecoration: 'none', display: 'block' }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>{h.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{h.name}</div>
                <div style={{ fontSize: 11, color: 'var(--accent-primary)', fontWeight: 600, marginBottom: 3 }}>{h.number}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{h.desc}</div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 20, display: 'flex', gap: 8, padding: '12px', background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: 10 }}>
          <AlertCircle size={14} color="var(--accent-secondary)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            This is general legal information for awareness purposes only and does not constitute legal advice. For serious legal matters, consult a qualified lawyer or contact District Legal Services Authority (DLSA).
          </p>
        </div>
      </div>
    </motion.div>
  );
}
