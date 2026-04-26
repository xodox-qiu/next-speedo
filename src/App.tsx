/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SpeedometerHUD } from './components/SpeedometerHUD';

export default function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black/0">
      {/* The Speedometer HUD is at bottom-right */}
      <div className="relative z-10 w-full h-full">
        <SpeedometerHUD />
      </div>
    </div>
  );
}
