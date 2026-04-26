import React from 'react';
import { motion } from 'motion/react';
import { CircularGauge } from './Gauges/CircularGauge';
import { VerticalBar } from './Gauges/VerticalBar';
import { SegmentedGauge } from './Gauges/SegmentedGauge';
import { useHUD } from '../hooks/useHUD';
import { Fuel, ArrowBigLeft, ArrowBigRight, Eye, ShieldCheck, ShieldAlert, Zap, Activity } from 'lucide-react';

export const SpeedometerHUD: React.FC = () => {
  const { data } = useHUD();

  if (!data.show) return null;

  const isRedlining = data.rpm > 8000;

  return (
    <div className="fixed bottom-6 right-6 pointer-events-none origin-bottom-right z-50">
      <div className="flex flex-col items-end gap-2">
        
        {/* Main Gauges Group - Side by Side (Transparent background) */}
        <div className="flex items-end gap-6 p-4">
          
          {/* Fuel Gauge - New Segmented Style from Image */}
          <div className="relative w-[110px] h-[110px] mb-2 transform translate-x-3">
            <SegmentedGauge 
              value={data.fuel} 
              size={110} 
              color={data.fuel < 15 ? 'var(--color-hud-danger)' : 'var(--color-hud-primary)'} 
              showNeedle={false}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-3">
              <Fuel className={`w-3.5 h-3.5 ${data.fuel < 15 ? 'text-hud-danger animate-pulse' : 'text-hud-primary'}`} />
              <div className="text-[6px] font-display font-bold mt-1 text-white/40 uppercase">Fuel</div>
            </div>
          </div>

          {/* Speedometer & Tachometer - Center Side */}
          <div className="relative w-[250px] h-[250px] transform translate-x-2">
            {/* Additional Layer Circles */}
            <div className="absolute inset-8 border-[1px] border-white/5 rounded-full" />
            <div className="absolute inset-10 border-[1px] border-white/5 rounded-full" />
            
            {/* RPM Background with Ticks */}
            <CircularGauge 
              value={data.rpm} 
              max={10000} 
              size={250} 
              strokeWidth={8} 
              color={isRedlining ? 'var(--color-hud-danger)' : 'var(--color-hud-primary)'}
              startAngle={-230}
              endAngle={50}
              showProgress={false} 
              showNeedle={false}
            />

            {/* RPM Numbers & Separators (Ticks) */}
            <div className="absolute inset-0 pointer-events-none">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const numberStartAngle = -320; // Shifting labels another 45 degrees left (-275 - 45)
                const numberEndAngle = -40; // (5 - 45)
                const range = numberEndAngle - numberStartAngle;
                const angle = numberStartAngle + (num / 10) * range;
                
                // RPM Number Position
                const numRadius = 106;
                const x = 125 + numRadius * Math.cos((angle + 90) * (Math.PI / 180));
                const y = 125 + numRadius * Math.sin((angle + 90) * (Math.PI / 180));
                
                // Vertical Separator Line Position (Halfway between numbers)
                const separatorRadius = 105; 
                const separatorAngle = angle + (range / 20); 
                const sX = 125 + separatorRadius * Math.cos((separatorAngle + 90) * (Math.PI / 180));
                const sY = 125 + separatorRadius * Math.sin((separatorAngle + 90) * (Math.PI / 180));

                return (
                  <React.Fragment key={num}>
                    {/* The Number */}
                    <div 
                      className="absolute font-display font-black text-[12px] transform -translate-x-1/2 -translate-y-1/2 italic"
                      style={{ 
                        left: x, 
                        top: y, 
                        color: num >= 8 ? 'var(--color-hud-danger)' : 'white',
                        opacity: num >= 8 && isRedlining ? 1 : 0.6,
                      }}
                    >
                      {num}
                    </div>

                    {/* Vertical Line Separator BETWEEN numbers */}
                    {num < 10 && (
                      <div 
                        className="absolute w-[1px] h-5 bg-white/20 origin-center"
                        style={{ 
                          left: sX, 
                          top: sY, 
                          transform: `translate(-50%, -50%) rotate(${separatorAngle}deg)`
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Speed & Odometer Center Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-2">
              <motion.div 
                className="text-[42px] font-display font-black tracking-widest chromatic-aberration italic leading-none glow-blue"
                key={data.speed}
              >
                {data.speed.toString().padStart(3, '0')}
              </motion.div>
              <div className="text-[9px] font-mono tracking-[0.2em] opacity-40 uppercase">
                {data.unit}
              </div>
              
              {/* Odometer */}
              <div className="mt-2 px-2 h-3.5 flex items-center bg-white/5 border border-white/10 rounded-sm skew-x-[-10deg]">
                <div className="text-[8px] font-mono tracking-[0.1em] text-white/50">
                  {data.odometer.toFixed(1).padStart(7, '0')} <span className="text-[5px] opacity-30 ml-1">MI</span>
                </div>
              </div>

               {/* Gear Indicator */}
               <div className="mt-2.5 flex items-center justify-center">
                  <div className="w-7 h-7 flex items-center justify-center bg-white/5 border border-white/20 rounded-md rotate-45 group">
                    <motion.span 
                      className="text-base font-display font-black text-white/90 -rotate-45"
                      key={data.gear}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      {data.gear}
                    </motion.span>
                  </div>
               </div>
            </div>
          </div>

          {/* Engine Health Bar - Right Side */}
          <div className="relative h-[180px] flex flex-col items-center justify-end ml-1">
             <Activity className={`w-3.5 h-3.5 mb-2.5 ${data.engineHealth < 30 ? 'text-hud-danger animate-pulse' : 'text-white/40'}`} />
             <VerticalBar 
               value={data.engineHealth} 
               max={100} 
               width={4} 
               height={110} 
               color={data.engineHealth < 30 ? 'var(--color-hud-danger)' : 'var(--color-hud-secondary)'} 
             />
             <div className="w-2.5 h-2.5 mt-2.5 flex items-center justify-center">
                <Zap className={`w-2.5 h-2.5 ${data.engineHealth < 20 ? 'animate-ping text-hud-danger' : 'text-white/20'}`} />
             </div>
          </div>
        </div>

        {/* Indicators Panel - Compact Width */}
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md p-1 px-3 rounded-lg border border-white/5 w-fit self-end mt-[-15px] -translate-x-4">
           {/* Turn Signal Left */}
           <div className={`transition-all ${data.turnSignal.left ? 'text-hud-secondary glow-green brightness-125' : 'text-white/10'}`}>
              <ArrowBigLeft className={`w-4 h-4 ${data.turnSignal.left ? 'animate-pulse' : ''}`} fill={data.turnSignal.left ? 'currentColor' : 'none'} />
           </div>

           {/* Center Indicators */}
           <div className="flex items-center gap-2 px-2 border-l border-r border-white/10">
              {/* Engine Power LED */}
              <div className="flex items-center gap-1 mr-2 pr-2 border-r border-white/10">
                 <div 
                   className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${data.rpm > 500 ? 'bg-hud-secondary shadow-[0_0_5px_var(--color-hud-secondary)]' : 'bg-white/10'}`}
                 />
                 <span className="text-[5px] font-mono opacity-40 uppercase">PWR</span>
              </div>

              <div className="flex items-center gap-1">
                <Indicator 
                  active={data.headlights !== 'off'} 
                  color={data.headlights === 'flash' ? 'var(--color-hud-accent)' : 'var(--color-hud-primary)'}
                >
                  <Eye className={`w-3.5 h-3.5 ${data.headlights === 'flash' ? 'animate-pulse' : ''}`} />
                </Indicator>
                <div className="text-[6px] font-mono opacity-20 uppercase w-5">{data.headlights}</div>
              </div>

              <Indicator active={!data.seatbelt} color="var(--color-hud-danger)">
                <div className="relative">
                  <ShieldAlert className={`w-3.5 h-3.5 ${!data.seatbelt ? 'animate-bounce' : ''}`} />
                  {data.seatbelt && <ShieldCheck className="absolute -right-0.5 -top-0.5 w-1.5 h-1.5 text-hud-secondary" />}
                </div>
              </Indicator>
           </div>

           {/* Turn Signal Right */}
           <div className={`transition-all ${data.turnSignal.right ? 'text-hud-secondary glow-green brightness-125' : 'text-white/10'}`}>
              <ArrowBigRight className={`w-4 h-4 ${data.turnSignal.right ? 'animate-pulse' : ''}`} fill={data.turnSignal.right ? 'currentColor' : 'none'} />
           </div>
        </div>
      </div>

      {/* Decorative Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.01] overflow-hidden rounded-2xl mix-blend-overlay">
         <div className="w-full h-full animate-scanline bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>
    </div>
  );
};

const Indicator: React.FC<{ active: boolean; color: string; children: React.ReactNode }> = ({ active, color, children }) => (
  <div 
    className={`transition-all duration-300 ${active ? '' : 'opacity-10'}`}
    style={{ color: active ? color : 'white', filter: active ? `drop-shadow(0 0 5px ${color})` : 'none' }}
  >
    {children}
  </div>
);

