import './Card.css';

export default function Card({
  children,
  className = '',
  hover = true,
  padding = 'md',
  glow = false,
  onClick,
  ...props
}) {
  const classes = [
    'glass-card',
    'card',
    `card-pad-${padding}`,
    hover && 'card-hover',
    glow && 'card-glow',
    onClick && 'card-clickable',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
}
