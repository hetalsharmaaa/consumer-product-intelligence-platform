import './Badge.css';

export default function Badge({
  children,
  variant = 'violet',
  size = 'md',
  dot = false,
  className = '',
}) {
  return (
    <span className={`badge badge-${variant} badge-size-${size} ${className}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}
