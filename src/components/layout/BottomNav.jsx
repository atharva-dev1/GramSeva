// ── Component: BottomNav ──
import { motion } from 'framer-motion';
import { Home, ShoppingCart, Star, Heart, Scale } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

const TABS = [
  { id: 'home',    path: '/',        icon: Home,         labelKey: 'home',    emoji: '🏠' },
  { id: 'mandi',   path: '/mandi',   icon: ShoppingCart, labelKey: 'mandi',   emoji: '📈' },
  { id: 'schemes', path: '/schemes', icon: Star,         labelKey: 'schemes', emoji: '📋' },
  { id: 'health',  path: '/health',  icon: Heart,        labelKey: 'health',  emoji: '🏥' },
  { id: 'rights',  path: '/rights',  icon: Scale,        labelKey: 'rights',  emoji: '⚖️' },
];

const PATH_TO_TAB = {
  '/': 'home',
  '/mandi': 'mandi',
  '/schemes': 'schemes',
  '/health': 'health',
  '/rights': 'rights',
};

export function BottomNav({ activeTab, onTabChange }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = PATH_TO_TAB[location.pathname] ?? 'home';

  const handleTabClick = (tab) => {
    navigate(tab.path);
    onTabChange?.(tab.id);
  };

  return (
    <nav className="bottom-nav">
      <div style={{ display: 'flex', alignItems: 'stretch', height: 60, padding: '0 4px' }}>
        {TABS.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              whileTap={{ scale: 0.9 }}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 3, border: 'none', background: 'transparent',
                cursor: 'pointer', padding: '6px 2px', position: 'relative',
              }}
            >
              {/* Active top indicator */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:28, height:2, background:'var(--accent-primary)', borderRadius:'0 0 4px 4px' }}
                  transition={{ type:'spring', stiffness:400, damping:30 }}
                />
              )}

              <motion.div animate={{ color: isActive ? 'var(--accent-primary)' : '#444444', scale: isActive ? 1.1 : 1 }} transition={{ duration: 0.15 }}>
                <tab.icon size={18} color={isActive ? 'var(--accent-primary)' : '#444444'} />
              </motion.div>

              <span style={{ fontSize: 9, fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)', transition: 'color 0.2s ease', lineHeight: 1 }}>
                {tab.id === 'rights' ? (t('home') === 'Home' ? 'Rights' : 'अधिकार') : t(tab.labelKey)}
              </span>

              {isActive && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position:'absolute', bottom:4, width:4, height:4, borderRadius:'50%', background:'var(--accent-primary)' }} />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
