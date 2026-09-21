export default function ClickableItem({ children, onClick, className = '' }) {
  return (
    <div className={`clickable-item ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
