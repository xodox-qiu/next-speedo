import { useState, useEffect } from 'react';

// Define the structure of the data we expect from the game
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
  turnSignal: { left: boolean; right: boolean; };
}

export function useHUD() {
  const [data, setData] = useState<HUDData>({
    speed: 0, rpm: 0, gear: 'N', fuel: 0, health: 0, engineHealth: 0,
    odometer: 0, show: true, unit: 'mph', seatbelt: false,
    headlights: 'off', turnSignal: { left: false, right: false }
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      let msg = event.data;

      // 1. Convert string data to Object (Common in RAGE:MP CEF)
      if (typeof msg === 'string') {
        try {
          msg = JSON.parse(msg);
        } catch (e) {
          return; // Ignore messages that aren't valid JSON
        }
      }

      // 2. Map the data to the React State
      if (msg.type === "updateVehicleData") {
        setData(prev => {
          let convertedSpeed = msg.speed;
          if (prev.unit === 'mph') convertedSpeed = Math.round(msg.speed * 2.236936);
          else if (prev.unit === 'km/h') convertedSpeed = Math.round(msg.speed * 3.6);

          return {
            ...prev,
            speed: convertedSpeed,
            rpm: Math.round(msg.rpm * 10000), // Maps 0.0-1.0 to 10k RPM
            fuel: msg.fuel * 100,
            engineHealth: msg.health * 100,
            gear: msg.gear === 0 ? 'R' : msg.gear,
            seatbelt: msg.seatbelts || false,
            turnSignal: {
              left: msg.leftIndicator || false,
              right: msg.rightIndicator || false
            },
            odometer: msg.odometer || prev.odometer
          };
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return { data };
}