export default function Card({ children, className = '', hover = false }) {
  return <div className={`card ${hover ? 'hover:shadow-lg hover:-translate-y-0.5' : ''} ${className}`}>{children}</div>;
}
