// ── Component: WeatherWidget ── (crop advisory + weather info)
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Wind, Droplets, Thermometer, Sun, CloudRain, CloudSnow } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

// Simulated weather data (in production replace with OpenWeatherMap API)
const WEATHER_SCENARIOS = [
  {
    condition: 'sunny', temp: 28, humidity: 45, windSpeed: 12,
    icon: '☀️', bgColor: 'rgba(255,215,0,0.08)', borderColor: 'rgba(255,215,0,0.2)',
    iconColor: '#FFD700',
    advisory: 'Good day for harvesting. Low humidity reduces spoilage risk.',
    advisoryHindi: 'फसल कटाई के लिए अच्छा दिन। कम नमी से अनाज खराब होने का खतरा कम।',
    label: 'Sunny', labelH: 'धूप',
  },
  {
    condition: 'cloudy', temp: 24, humidity: 65, windSpeed: 18,
    icon: '⛅', bgColor: 'rgba(136,136,136,0.08)', borderColor: 'rgba(136,136,136,0.2)',
    iconColor: '#888',
    advisory: 'Overcast skies — delay spraying pesticides today.',
    advisoryHindi: 'आज कीटनाशक न छिड़कें। बादल छाए हैं।',
    label: 'Cloudy', labelH: 'बादल',
  },
  {
    condition: 'rainy', temp: 20, humidity: 85, windSpeed: 22,
    icon: '🌧️', bgColor: 'rgba(0,100,255,0.08)', borderColor: 'rgba(0,100,255,0.2)',
    iconColor: '#4A90E2',
    advisory: 'Heavy rain expected. Ensure proper drainage in fields.',
    advisoryHindi: 'भारी बारिश संभव। खेतों में जल निकासी सुनिश्चित करें।',
    label: 'Rainy', labelH: 'बारिश',
  },
];

export function WeatherWidget() {
  const { currentLang } = useLanguage();
  const isHindi = currentLang === 'hi';
  const [weather] = useState(() => WEATHER_SCENARIOS[Math.floor(Math.random() * WEATHER_SCENARIOS.length)]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        background: weather.bgColor,
        border: `1px solid ${weather.borderColor}`,
        borderRadius: 16,
        padding: '14px 16px',
        marginBottom: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 32 }}>{weather.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', lineHeight: 1 }}>
              {weather.temp}°C
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              Kanpur · {isHindi ? weather.labelH : weather.label}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-muted)' }}>
          <div>{time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
          <div style={{ marginTop: 3, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Droplets size={10} color="#4A90E2" /> {weather.humidity}%
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Wind size={10} color="#888" /> {weather.windSpeed} km/h
            </span>
          </div>
        </div>
      </div>
      {/* Advisory */}
      <div style={{
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 10,
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
      }}>
        <span style={{ fontSize: 14, flexShrink: 0 }}>🌾</span>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <span style={{ color: weather.iconColor, fontWeight: 600 }}>
            {isHindi ? 'फसल सलाह: ' : 'Crop Advisory: '}
          </span>
          {isHindi ? weather.advisoryHindi : weather.advisory}
        </div>
      </div>
    </motion.div>
  );
}
