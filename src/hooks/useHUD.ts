import { useState, useEffect } from 'react';

export interface HUDData {
  speed: number;
  rpm: number;
  gear: number | string;
  fuel: number;
  health: number;
  engineHealth: number;
  odometer: number;
  show: boolean;
  unit: 'mph' | 'km/h' | 'knots';
  seatbelt: boolean;
  headlights: 'off' | 'on' | 'flash';
  turnSignal: {
    left: boolean;
    right: boolean;
  };
}

export function useHUD() {
  // 1. Initialize with empty/zero values
  const [data, setData] = useState<HUDData>({
    speed: 0,
    rpm: 0,
    gear: 'N',
    fuel: 0,
    health: 100,
    engineHealth: 100,
    odometer: 0,
    show: true,
    unit: 'mph',
    seatbelt: false,
    headlights: 'off',
    turnSignal: { left: false, right: false }
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data;

      // 3. Mapping incoming game data to HUD state

      if (msg.type === "updateVehicleData") {
        setData(prev => {
          // speed conversion logic from script.js
          let convertedSpeed = msg.speed;
          if (prev.unit === 'mph') convertedSpeed = Math.round(msg.speed * 2.236936);
          else if (prev.unit === 'km/h') convertedSpeed = Math.round(msg.speed * 3.6);
          else if (prev.unit === 'knots') convertedSpeed = Math.round(msg.speed * 1.943844);

          return {
            ...prev,
            speed: convertedSpeed, 
            rpm: Math.round(msg.rpm * 10000), // Map 0.0-1.0 to your 10k gauge
            fuel: msg.fuel * 100, // Map 0.0-1.0 to percentage
            engineHealth: msg.health * 100, // Map 0.0-1.0 to percentage
            gear: msg.gear === 0 ? 'R' : msg.gear, // Handle 0 as Reverse
            headlights: msg.headlights === 2 ? 'flash' : (msg.headlights === 1 ? 'on' : 'off'),
            turnSignal: {
              left: msg.leftIndicator,
              right: msg.rightIndicator
            },
            odometer: msg.odometer || prev.odometer
          };
        });
      }
      
      // Handle the Speed Mode (Units) specifically if the game sends it
      if (msg.type === "setSpeedMode") {
        const modes: Record<number, 'km/h' | 'mph' | 'knots'> = { 0: 'km/h', 1: 'mph', 2: 'knots' };
        setData(prev => ({ ...prev, unit: modes[msg.mode] || 'mph' }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return { data };
}