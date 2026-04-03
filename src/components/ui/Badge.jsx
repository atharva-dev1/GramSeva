// ── Component: Badge ──
export function Badge({ children, variant = 'orange', className = '' }) {
  const variants = {
    orange: 'badge badge-orange',
    green: 'badge badge-green',
    red: 'badge badge-red',
    gray: 'badge badge-gray',
    gold: 'badge badge-gold',
  };
  return (
    <span className={`${variants[variant] ?? variants.orange} ${className}`}>
      {children}
    </span>
  );
}
