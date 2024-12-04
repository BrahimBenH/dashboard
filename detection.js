 // Drone Fleet Status
 const droneData = [
    { id: 'D1', status: 'active', battery: 85, location: { name: 'Safe Zone', lat: 34.8869, lng: 9.5375 } }, // Tunisia
    { id: 'D2', status: 'charging', battery: 92, location: { name: 'Base', lat: 36.8625, lng: 10.1953 } }, // Tunisia
    { id: 'D3', status: 'low', battery: 20, location: { name: 'Fire Zone', lat: 36.2719, lng: 9.0138 } }, // Tunisia
    { id: 'D4', status: 'active', battery: 78, location: { name: 'Safe Zone', lat: 35.8262, lng: 8.6349 } } // Tunisia
];

    const droneStatusGrid = document.getElementById('drone-status-grid');
    droneData.forEach(drone => {
        const card = document.createElement('div');
        card.className = 'drone-status-card';

        // Determine battery color and progress bar width based on level
        let batteryColor;
        let batteryWidth = drone.battery + '%';
        if (drone.battery > 75) batteryColor = 'green';
        else if (drone.battery > 30) batteryColor = 'orange';
        else batteryColor = 'red';

        card.innerHTML = `
            <h3>Drone ${drone.id}</h3>
            <p><strong>Location:</strong> ${drone.location.name}</p>
            <p><strong>Battery:</strong> ${drone.battery}%</p>
            <div style="background-color: #ddd; border-radius: 5px; height: 10px; width: 100%;">
                <div style="background-color: ${batteryColor}; height: 100%; width: ${batteryWidth}; border-radius: 5px;"></div>
            </div>
            <p class="status ${drone.status}">${drone.status.charAt(0).toUpperCase() + drone.status.slice(1)}</p>
        `;

        card.addEventListener('click', () => {
            alert(`Drone ${drone.id} is ${drone.status} at ${drone.location.name} with ${drone.battery}% battery.`);
        });

        droneStatusGrid.appendChild(card);
    });

    // Map
    const map = L.map('map').setView([35.8869, 9.5375], 7.2); // Tunisia

    // Add Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add Markers for Drones with Custom Icons
    droneData.forEach(drone => {
        let color;
        if (drone.status === 'active') color = 'green';
        else if (drone.status === 'charging') color = 'orange';
        else if (drone.status === 'low') color = 'red';

        // Custom Drone Icon
        const icon = L.divIcon({
            className: 'custom-icon',
            html: `<div style="background-color: ${color}; border-radius: 50%; width: 20px; height: 20px;"></div>`,
            iconSize: [20, 20]
        });

        // Create a marker with the drone's current location and custom icon
        L.marker([drone.location.lat, drone.location.lng], { icon: icon }).addTo(map)
            .bindPopup(`
                <strong>Drone ${drone.id}</strong><br>
                Status: ${drone.status.charAt(0).toUpperCase() + drone.status.slice(1)}<br>
                Location: ${drone.location.name}<br>
                Battery: ${drone.battery}%
            `);
    });
