import React from 'react';
import { motion } from 'motion/react';

interface SegmentedGaugeProps {
  value: number; // 0 to 100
  size: number;
  color: string;
  className?: string;
  showNeedle?: boolean;
}

export const SegmentedGauge: React.FC<SegmentedGaugeProps> = ({
  value,
  size,
  color,
  className = "",
  showNeedle = true
}) => {
  const segments = 4;
  const gap = 4;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const startAngle = -210;
  const endAngle = -30;
  const angleRange = endAngle - startAngle;
  const segmentRange = (angleRange - (segments - 1) * gap) / segments;

  const currentAngle = startAngle + (value / 100) * angleRange;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Outer Thin Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 4}
          stroke={color}
          strokeWidth="1"
          fill="transparent"
          strokeDasharray="1 2" // Dotted
          opacity="0.3"
        />

        {/* Segmented Blocks */}
        {Array.from({ length: segments }).map((_, i) => {
          const segStart = startAngle + i * (segmentRange + gap);
          const segEnd = segStart + segmentRange;
          const isActive = (value / 100) > (i / segments);
          
          const circumference = 2 * Math.PI * radius;
          const dashArray = `${(segmentRange / 360) * circumference} ${circumference}`;
          
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isActive ? color : 'rgba(255,255,255,0.1)'}
              strokeWidth={strokeWidth}
              fill="transparent"
              style={{
                strokeDasharray: dashArray,
                transform: `rotate(${segStart + 90}deg)`,
                transformOrigin: '50% 50%',
                opacity: isActive ? 1 : 0.2
              }}
            />
          );
        })}
      </svg>

      {/* Cursor Indicator along the curvature */}
      {showNeedle && (
        <motion.div
          className="absolute top-1/2 left-1/2 w-full h-full pointer-events-none"
          animate={{ rotate: currentAngle }}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
          style={{ transformOrigin: '50% 50%' }}
        >
          <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full transform rotate-90">
             {/* Small triangle cursor on the inner edge of radius */}
             <path 
               d="M 50 44 L 52 48 L 50 47.5 L 48 48 Z" 
               fill="white" 
               style={{ 
                 transform: `translateX(${(radius - 12) / 2}px)`
               }}
             />
             {/* Outer edge indicator dot */}
             <circle 
               cx="50" 
               cy="42" 
               r="1.2" 
               fill="white" 
               style={{ 
                 transform: `translateX(${(radius - 12) / 2}px)`
               }}
             />
          </svg>
        </motion.div>
      )}
    </div>
  );
};
