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
  unit: 'mph' | 'km/h';
  seatbelt: boolean;
  headlights: 'off' | 'on' | 'flash';
  turnSignal: {
    left: boolean;
    right: boolean;
  };
}

export function useHUD() {
  const [data, setData] = useState<HUDData>({
    speed: 0,
    rpm: 0,
    gear: 1,
    fuel: 100,
    health: 100,
    engineHealth: 100,
    odometer: 1250.5,
    show: true,
    unit: 'mph',
    seatbelt: false,
    headlights: 'off',
    turnSignal: {
      left: false,
      right: false
    }
  });

  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data;
      if (msg.type === "updateSpeedometer") {
        setIsDemo(false);
        setData(prev => ({
          ...prev,
          ...msg.data
        }));
      } else if (msg.type === "showSpeedometer") {
        setData(prev => ({ ...prev, show: msg.state }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Demo oscillation logic
  useEffect(() => {
    if (!isDemo) return;

    let startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      // Values oscillate for demo
      const speed = Math.abs(Math.sin(elapsed * 0.5) * 120);
      const rpm = Math.abs(Math.sin(elapsed * 0.8) * 8000);
      const gear = Math.floor(speed / 30) + 1;
      const fuel = 80 + Math.sin(elapsed * 0.1) * 10;
      const engineHealth = 95 + Math.sin(elapsed * 0.2) * 5;
      const odometer = 1250.5 + (elapsed * 0.01);

      setData({
        speed: Math.round(speed),
        rpm: Math.round(rpm),
        gear: speed < 1 ? 'N' : (gear > 6 ? 6 : gear),
        fuel: fuel,
        health: 100,
        engineHealth: engineHealth,
        odometer: parseFloat(odometer.toFixed(1)),
        show: true,
        unit: 'mph',
        seatbelt: Math.sin(elapsed) > 0.5,
        headlights: elapsed % 3 < 1 ? 'off' : (elapsed % 3 < 2 ? 'on' : 'flash'),
        turnSignal: {
          left: Math.sin(elapsed * 4) > 0 && elapsed % 6 < 3,
          right: Math.sin(elapsed * 4) > 0 && elapsed % 6 >= 3
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isDemo]);

  return { data, isDemo };
}
