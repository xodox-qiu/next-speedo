import React from 'react';
import { motion } from 'motion/react';

interface VerticalBarProps {
  value: number;
  max: number;
  width: number;
  height: number;
  color: string;
  className?: string;
}

export const VerticalBar: React.FC<VerticalBarProps> = ({
  value,
  max,
  width,
  height,
  color,
  className = ""
}) => {
  const percentage = Math.min(Math.max(value / max, 0), 1);
  
  return (
    <div 
      className={`relative overflow-hidden bg-white/10 rounded-sm ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute bottom-0 left-0 w-full"
        initial={{ height: 0 }}
        animate={{ height: `${percentage * 100}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        style={{ 
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`
        }}
      />
      {/* Decorative segments */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-full h-[1px] bg-black/20" />
        ))}
      </div>
    </div>
  );
};
