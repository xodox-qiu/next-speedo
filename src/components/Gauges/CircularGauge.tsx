import React from 'react';
import { motion } from 'motion/react';

interface CircularGaugeProps {
  value: number;
  max: number;
  size: number;
  strokeWidth: number;
  color: string;
  startAngle?: number;
  endAngle?: number;
  className?: string;
  glow?: boolean;
  showProgress?: boolean;
  showNeedle?: boolean;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  max,
  size,
  strokeWidth,
  color,
  startAngle = -220,
  endAngle = 40,
  className = "",
  glow = true,
  showProgress = true,
  showNeedle = false
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const angleRange = endAngle - startAngle;
  const progress = Math.min(Math.max(value / max, 0), 1);
  const strokeDashoffset = circumference - (progress * (angleRange / 360)) * circumference;
  const currentAngle = startAngle + (progress * angleRange);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`} 
        className="overflow-hidden transform -rotate-90"
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          style={{
            strokeDasharray: `${circumference}`,
            strokeDashoffset: circumference - (angleRange / 360) * circumference,
            transform: `rotate(${startAngle + 90}deg)`,
            transformOrigin: '50% 50%'
          }}
        />
        
        {/* Foreground Progress */}
        {showProgress && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            animate={{
              strokeDashoffset: strokeDashoffset
            }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            style={{
              strokeDasharray: circumference,
              transform: `rotate(${startAngle + 90}deg)`,
              transformOrigin: '50% 50%',
              filter: glow ? `drop-shadow(0 0 5px ${color})` : 'none'
            }}
          />
        )}
      </svg>

      {/* Modern Needle Pointer (Line and Arrow) */}
      {showNeedle && (
        <motion.div
          className="absolute top-1/2 left-1/2 w-full h-full pointer-events-none"
          animate={{ rotate: currentAngle }}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
          style={{ transformOrigin: '50% 50%' }}
        >
          <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full transform rotate-90">
             {/* Center circle pivot */}
             <circle cx="50" cy="50" r="1.5" fill="white" fillOpacity="0.8" />
             
             {/* Needle body */}
             <path 
               d="M 50 50 L 50 35" 
               stroke="white" 
               strokeWidth="0.8" 
               strokeOpacity="0.4"
             />

             {/* Arrowhead closer to rim */}
             <path 
               d="M 50 32 L 52.5 38 L 50 37 L 47.5 38 Z" 
               fill="white" 
               style={{ 
                 filter: 'drop-shadow(0 0 1.5px white)',
               }}
             />
          </svg>
        </motion.div>
      )}
    </div>
  );
};
