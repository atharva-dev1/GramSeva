// ── Component: SparkLine ── (mini price trend chart using SVG)
import { useMemo } from 'react';

/**
 * Generates random-looking but consistent sparkline data from a seed.
 * In production, replace with real historical data.
 */
function generateSparkData(currentPrice, weekHigh, weekLow, trend, seed = 1) {
  const points = [];
  // 7 day history
  for (let i = 6; i >= 0; i--) {
    let noise = (((seed * 92821 + i * 4933) % 1000) / 1000 - 0.5) * (weekHigh - weekLow) * 0.6;
    let base = weekLow + (weekHigh - weekLow) * (i / 6);
    if (trend === 'up') base = weekLow + (weekHigh - weekLow) * ((6 - i) / 6);
    else if (trend === 'stable') base = (weekHigh + weekLow) / 2;
    points.push(Math.max(weekLow, Math.min(weekHigh, Math.round(base + noise))));
  }
  points[6] = currentPrice;
  return points;
}

export function SparkLine({ item, width = 80, height = 30 }) {
  const data = useMemo(
    () => generateSparkData(item.price, item.weekHigh, item.weekLow, item.trend, item.id),
    [item]
  );

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 4) + 2;
    const y = height - 4 - ((v - min) / range) * (height - 8) + 2;
    return `${x},${y}`;
  });

  const isUp = item.trend === 'up';
  const isDown = item.trend === 'down';
  const color = isUp ? '#00D46A' : isDown ? '#FF4757' : '#888';

  const pathD = `M ${pts.join(' L ')}`;

  // Fill path
  const fillD = `M ${pts[0]} L ${pts.join(' L ')} L ${(data.length - 1) / (data.length - 1) * (width - 4) + 2},${height - 2} L 2,${height - 2} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${item.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#sg-${item.id})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      {/* Last point dot */}
      <circle
        cx={pts[pts.length - 1].split(',')[0]}
        cy={pts[pts.length - 1].split(',')[1]}
        r={3}
        fill={color}
      />
    </svg>
  );
}
