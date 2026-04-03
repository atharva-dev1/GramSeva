// ── Component: ApplyModal ──
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, User, Phone, MapPin, FileText, Send } from 'lucide-react';

export function ApplyModal({ scheme, isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: form, 2: success
  const [form, setForm] = useState({ name: 'Ramesh Kumar', phone: '9876543210', village: 'Shivpur', district: 'Kanpur' });

  // BUG FIX: reset step every time modal opens so it doesn't show success screen on re-open
  useEffect(() => {
    if (isOpen) setStep(1);
  }, [isOpen]);

  if (!scheme) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    setTimeout(() => {
      onSuccess(`Applied for ${scheme.name}`);
      onClose();
      setStep(1);
    }, 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 200,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: 430,
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px 24px 0 0',
              zIndex: 201,
              overflow: 'hidden',
              maxHeight: '90dvh',
              overflowY: 'auto',
            }}
          >
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }} />
            </div>

            <div style={{ padding: '8px 20px 40px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{scheme.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#F5F5F5', lineHeight: 1.2 }}>
                    Apply for {scheme.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 3, fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                    {scheme.hindi}
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  <X size={16} color="#888" />
                </motion.button>
              </div>

              {/* Benefit pill */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: 20, fontSize: 13, color: '#FF6B35', fontWeight: 600 }}>
                💰 {scheme.benefit}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                  >
                    {/* Name */}
                    <div>
                      <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                        <User size={11} /> Full Name
                      </label>
                      <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Enter your full name" style={{ width: '100%', padding: '11px 14px' }} required />
                    </div>

                    {/* Phone */}
                    <div>
                      <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                        <Phone size={11} /> Mobile Number
                      </label>
                      <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="10-digit mobile number" style={{ width: '100%', padding: '11px 14px' }} type="tel" maxLength={10} required />
                    </div>

                    {/* Village */}
                    <div>
                      <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                        <MapPin size={11} /> Village / Town
                      </label>
                      <input value={form.village} onChange={e => setForm(f => ({...f, village: e.target.value}))} placeholder="Village or town name" style={{ width: '100%', padding: '11px 14px' }} required />
                    </div>

                    {/* District */}
                    <div>
                      <label style={{ fontSize: 12, color: '#888', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                        <MapPin size={11} /> District
                      </label>
                      <select value={form.district} onChange={e => setForm(f => ({...f, district: e.target.value}))} style={{ width: '100%', padding: '11px 14px' }}>
                        {['Kanpur','Lucknow','Varanasi','Agra','Prayagraj','Gorakhpur'].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>

                    {/* Documents required */}
                    <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FileText size={11} /> Documents to submit
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {scheme.documents.map(doc => (
                          <span key={doc} style={{ fontSize: 11, color: '#888', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }}>{doc}</span>
                        ))}
                      </div>
                    </div>

                    <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 4 }}>
                      <Send size={15} /> Submit Application
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    style={{ textAlign: 'center', padding: '30px 0' }}
                  >
                    <motion.div
                      animate={{ scale: [0.5, 1.2, 1], rotate: [0, 15, -5, 0] }}
                      transition={{ duration: 0.6 }}
                      style={{ fontSize: 64, marginBottom: 16 }}
                    >
                      ✅
                    </motion.div>
                    <div style={{ fontWeight: 700, fontSize: 22, color: '#F5F5F5', marginBottom: 8 }}>
                      Application Submitted!
                    </div>
                    <div style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>
                      Your application for <strong style={{ color: '#FF6B35' }}>{scheme.name}</strong> has been received.
                      <br />You'll receive an SMS at <strong style={{ color: '#F5F5F5' }}>+91 {form.phone}</strong>
                    </div>
                    <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(0,212,106,0.08)', border: '1px solid rgba(0,212,106,0.2)', borderRadius: 12 }}>
                      <div style={{ fontSize: 12, color: '#00D46A', fontWeight: 600 }}>Reference ID</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#F5F5F5', marginTop: 4, letterSpacing: '0.05em' }}>
                        GS-{scheme.id}-{Math.random().toString(36).substring(2,8).toUpperCase()}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
