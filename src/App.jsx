// ── App.jsx ──
import { useState, useCallback, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BottomNav } from './components/layout/BottomNav';
import { Toast } from './components/ui/Toast';
import { SplashScreen } from './components/SplashScreen';
import { LanguageProvider } from './hooks/useLanguage';
import { HomePage } from './pages/HomePage';
import { MandiPage } from './pages/MandiPage';
import { SchemesPage } from './pages/SchemesPage';
import { HealthPage } from './pages/HealthPage';

const PATH_TO_TAB = {
  '/': 'home',
  '/mandi': 'mandi',
  '/schemes': 'schemes',
  '/health': 'health',
};

function AppContent({ splashDone }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const activeTab = PATH_TO_TAB[location.pathname] ?? 'home';

  const showToast = useCallback(({ type = 'info', title, message, duration = 3500 }) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleTabChange = (tab) => {
    const paths = { home: '/', mandi: '/mandi', schemes: '/schemes', health: '/health' };
    navigate(paths[tab] ?? '/');
  };

  if (!splashDone) return null;

  return (
    <div className="app-container">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"        element={<HomePage    onToast={showToast} />} />
          <Route path="/mandi"   element={<MandiPage   onToast={showToast} />} />
          <Route path="/schemes" element={<SchemesPage onToast={showToast} />} />
          <Route path="/health"  element={<HealthPage  onToast={showToast} />} />
          <Route path="*"        element={<HomePage    onToast={showToast} />} />
        </Routes>
      </AnimatePresence>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

function AppShell() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!splashDone && (
          <SplashScreen onComplete={() => setSplashDone(true)} />
        )}
      </AnimatePresence>
      <AppContent splashDone={splashDone} />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}
