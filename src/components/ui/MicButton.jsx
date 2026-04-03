// ── Component: MicButton ──
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, AudioWaveform, CheckCircle, Loader } from 'lucide-react';

const RING_COUNT = 3;

export function MicButton({ speechState, onPress, size = 120 }) {
  const isListening = speechState === 'listening';
  const isProcessing = speechState === 'processing';
  const isDone = speechState === 'done';

  const ringDuration = isListening ? 0.7 : 2;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Pulse rings */}
      {RING_COUNT > 0 && !isProcessing && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: '50%',
                border: `2px solid rgba(255,107,53,${isListening ? 0.6 : 0.3})`,
                pointerEvents: 'none',
              }}
              animate={{
                scale: [1, isListening ? 2 : 1.75, 1],
                opacity: [isListening ? 0.7 : 0.5, 0, isListening ? 0.7 : 0.5],
              }}
              transition={{
                duration: ringDuration,
                repeat: Infinity,
                delay: i * 0.35,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}

      {/* Main button circle */}
      <motion.button
        onClick={onPress}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: isDone
            ? 'radial-gradient(circle at 35% 35%, #00D46A, #009f50)'
            : isListening
            ? 'radial-gradient(circle at 35% 35%, #ff8c5a, #cc4a1a)'
            : 'radial-gradient(circle at 35% 35%, #ff8c5a, #e05520)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          boxShadow: isListening
            ? '0 0 0 4px rgba(255,107,53,0.4), 0 8px 40px rgba(255,107,53,0.5)'
            : isDone
            ? '0 0 0 4px rgba(0,212,106,0.3), 0 8px 32px rgba(0,212,106,0.4)'
            : '0 4px 24px rgba(255,107,53,0.35)',
          transition: 'box-shadow 0.3s ease, background 0.3s ease',
        }}
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
            >
              <Loader color="white" size={36} />
            </motion.div>
          ) : isDone ? (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <CheckCircle color="white" size={36} />
            </motion.div>
          ) : isListening ? (
            <motion.div
              key="wave"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <AudioWaveform color="white" size={36} />
            </motion.div>
          ) : (
            <motion.div
              key="mic"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Mic color="white" size={36} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
