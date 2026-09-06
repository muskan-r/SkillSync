import { useRef } from "react";

export default function TiltCard({ children, className = "" }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const card = ref.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = ref.current;
    card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -4px rgba(99,102,241,0.15), 0 24px 48px -12px rgba(0,0,0,0.5)",
      }}
    >
      {children}
    </div>
  );
}