// ── Component: Toast Notification ──
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={18} color="#00D46A" />,
  error: <AlertCircle size={18} color="#FF4757" />,
  info: <Info size={18} color="#FF6B35" />,
};

export function Toast({ toasts, onDismiss }) {
  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      width: 'calc(100% - 40px)',
      maxWidth: 390,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none',
    }}>
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            style={{
              background: '#1A1A1A',
              border: `1px solid ${toast.type === 'success' ? 'rgba(0,212,106,0.25)' : toast.type === 'error' ? 'rgba(255,71,87,0.25)' : 'rgba(255,107,53,0.25)'}`,
              borderRadius: 14,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              pointerEvents: 'all',
              cursor: 'pointer',
            }}
            onClick={() => onDismiss(toast.id)}
          >
            {ICONS[toast.type] ?? ICONS.info}
            <div style={{ flex: 1 }}>
              {toast.title && (
                <div style={{ fontWeight: 700, fontSize: 13, color: '#F5F5F5', marginBottom: 2 }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: 12, color: '#888888', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>
            <X size={14} color="#444" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
