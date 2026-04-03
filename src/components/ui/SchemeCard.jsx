// ── Component: SchemeCard ──
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, FileText, ArrowRight, ChevronDown, ChevronUp, Users, Building2, Calendar, Bookmark, BookmarkCheck } from 'lucide-react';
import { Badge } from './Badge';
import { ApplyModal } from './ApplyModal';
import { useLanguage } from '../../hooks/useLanguage';

export function SchemeCard({ scheme, index = 0, onToast, isSaved = false, onToggleSave }) {
  const { t, currentLang } = useLanguage();
  const isHindi = currentLang === 'hi';
  const [expanded, setExpanded] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApplySuccess = (msg) => {
    setApplied(true);
    onToast?.({ type: 'success', title: 'Application Submitted!', message: msg });
    setTimeout(() => setApplied(false), 8000);
  };

  const handleToggleSave = (e) => {
    e.stopPropagation();
    onToggleSave?.();
    onToast?.({
      type: isSaved ? 'info' : 'success',
      title: isSaved ? 'Removed from saved' : 'Scheme Saved! 🔖',
      message: isSaved ? `${scheme.name} removed from bookmarks` : `${scheme.name} added to your saved list`,
    });
  };

  return (
    <>
      <motion.div
        custom={index}
        variants={{
          hidden: { opacity: 0, y: 60, scale: 0.95 },
          visible: (i) => ({
            opacity: 1, y: 0, scale: 1,
            transition: { delay: i * 0.07, type: 'spring', stiffness: 300, damping: 25 },
          }),
        }}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -3 }}
        style={{
          background: 'var(--bg-card)',
          border: `1px solid ${applied ? 'rgba(0,212,106,0.3)' : 'var(--border)'}`,
          borderRadius: 16,
          overflow: 'hidden',
          position: 'relative',
          transition: 'border-color 0.3s ease',
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: 3, background: scheme.color, width: '100%' }} />

        <div style={{ padding: '16px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: `${scheme.color}18`, border: `1px solid ${scheme.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
            }}>
              {scheme.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {isHindi ? scheme.hindi : scheme.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                    {isHindi ? scheme.name : scheme.hindi}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <Badge variant={scheme.eligible ? 'green' : 'red'}>
                    {scheme.eligible
                      ? <><CheckCircle size={10} /> {t('eligible')}</>
                      : <><XCircle size={10} /> {t('notEligible')}</>}
                  </Badge>
                  {onToggleSave && (
                    <motion.button whileTap={{ scale: 0.85 }} onClick={handleToggleSave} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: isSaved ? 'var(--accent-secondary)' : 'var(--text-muted)', transition: 'color 0.2s ease' }}>
                      {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Benefit chip */}
          <div style={{ marginBottom: 10 }}>
            <Badge variant="orange" className="text-13">💰 {isHindi ? scheme.benefitHindi : scheme.benefit}</Badge>
          </div>

          {/* Description */}
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
            {isHindi ? scheme.descHindi : scheme.description}
          </p>

          {/* Meta row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Building2 size={10} /> {scheme.ministry}
            </span>
            {scheme.beneficiaries && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users size={10} /> {scheme.beneficiaries}
              </span>
            )}
          </div>

          {/* Documents row */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <FileText size={11} /> {t('docsNeeded')}:
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {scheme.documents.map(doc => (
                <span key={doc} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'var(--bg-elevated)', padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
                  {doc}
                </span>
              ))}
            </div>
          </div>

          {/* Expandable Learn More section */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginBottom: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    {[
                      { icon: <Building2 size={13} />, label: 'Ministry', value: scheme.ministry },
                      { icon: <Users size={13} />, label: 'Beneficiaries', value: scheme.beneficiaries || 'All eligible' },
                      { icon: <Calendar size={13} />, label: 'Deadline', value: scheme.deadline || 'Open' },
                      { icon: '📌', label: 'Category', value: scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1) },
                    ].map(item => (
                      <div key={item.label} style={{ background: 'var(--bg-elevated)', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          {item.icon} {item.label}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '10px 12px', background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.15)', borderRadius: 10, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    💡 <strong style={{ color: 'var(--accent-primary)' }}>How to apply:</strong> Visit your nearest Common Service Centre (CSC) or apply online at services.india.gov.in with the required documents.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="divider" style={{ marginBottom: 14 }} />

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {applied ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: 'rgba(0,212,106,0.1)', border: '1px solid rgba(0,212,106,0.3)',
                  borderRadius: 12, padding: '10px', fontSize: 13, color: 'var(--accent-green)', fontWeight: 600,
                }}
              >
                <CheckCircle size={15} /> Applied Successfully!
              </motion.div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setApplyOpen(true)}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}
              >
                {t('apply')} <ArrowRight size={14} />
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setExpanded(p => !p)}
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}
            >
              {expanded ? 'Show Less' : t('learnMore')}
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <ApplyModal
        scheme={scheme}
        isOpen={applyOpen}
        onClose={() => setApplyOpen(false)}
        onSuccess={handleApplySuccess}
      />
    </>
  );
}
