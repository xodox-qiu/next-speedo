// script.js - Pure JavaScript Listener
(function() {
    console.log("External script.js loaded and listening for game events...");

    window.addEventListener('message', (event) => {
        let msg = event.data;

        // 1. Handle stringified data from RAGE:MP
        if (typeof msg === 'string') {
            try {
                msg = JSON.parse(msg);
            } catch (e) {
                return; // Not valid JSON
            }
        }

        // 2. Process the "updateVehicleData" event
        if (msg.type === "updateVehicleData") {
            handleVehicleUpdate(msg);
        }

        // 3. Process the "setSpeedMode" event
        if (msg.type === "setSpeedMode") {
            console.log("Unit changed to mode:", msg.mode);
        }
    });

    function handleVehicleUpdate(data) {
        // You can now use standard DOM manipulation here
        // These IDs must exist in your index.html
        const speedDisplay = document.getElementById('raw-speed');
        if (speedDisplay) {
            // Replicating conversion logic from useHUD.ts
            const mph = Math.round(data.speed * 2.236936);
            speedDisplay.innerText = mph + " MPH";
        }

        // Example: Logging RPM like your repo logic
        const rpmValue = Math.round(data.rpm * 10000);
        console.log("Current RPM:", rpmValue);
    }
})();