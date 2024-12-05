  // Predicted Locations Data with Probability
  const predictedLocations = [
    { lat: 34.8869, lng: 9.5375, name: "El Kef", probability: 0.85 }, // 85% probability
    { lat: 36.2719, lng: 9.0138, name: "Kasserine", probability: 0.45 }, // 45% probability
    { lat: 35.8262, lng: 8.6349, name: "Sidi Bouzid", probability: 0.70 } // 70% probability
];

    // Render predicted locations into flexbox and change card colors based on probability
    const locationsContainer = document.getElementById('predicted-locations');
    predictedLocations.forEach(location => {
        const locationEl = document.createElement('div');
        locationEl.className = 'location-card';
        const probabilityColor = getCardColor(location.probability);
        locationEl.innerHTML = `
            <h3 class="font-semibold text-lg">${location.name}</h3>
            <p>Probability: <span class="font-bold">${Math.round(location.probability * 100)}%</span></p>
            <div class="progress-bar" style="background: ${probabilityColor}; width: ${location.probability * 100}%;"></div>
        `;
        locationsContainer.appendChild(locationEl);
    });

    // Helper function to calculate color based on probability
    function getCardColor(probability) {
        if (probability >= 0.75) {
            return '#d32f2f'; // Red
        } else if (probability >= 0.50) {
            return '#ff9800'; // Orange
        } else {
            return '#ffeb3b'; // Yellow
        }
    }

    // Initialize the map
    const map = L.map('map').setView([35.3869, 9.5375], 7); // Centering map on Tunisia
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for each location with color based on probability
    predictedLocations.forEach(location => {
        L.marker([location.lat, location.lng])
            .bindPopup(`<b>${location.name}</b><br>Probability: ${Math.round(location.probability * 100)}%`)
            .addTo(map)
            .setIcon(getMarkerIcon(location.probability));
    });

    // Helper function to get marker color based on probability
    function getMarkerIcon(probability) {
        let color;
        if (probability >= 0.75) {
            color = '#d32f2f'; // Red
        } else if (probability >= 0.50) {
            color = '#ff9800'; // Orange
        } else {
            color = '#ffeb3b'; // Yellow
        }
        return L.divIcon({
            className: 'leaflet-div-icon',
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%;"></div>`
        });
    }

    // Heatmap Layer with Custom Gradient for Probability
    let heatmapLayer;
    document.getElementById('toggle-heatmap').addEventListener('click', function() {
        if (heatmapLayer) {
            map.removeLayer(heatmapLayer);
            heatmapLayer = null;
            this.textContent = 'Show Heat Map';
        } else {
            const heatData = predictedLocations.map(loc => [loc.lat, loc.lng, loc.probability]);
            heatmapLayer = L.heatLayer(heatData, {
                radius: 25,
                gradient: { 0.1: 'yellow', 0.5: 'orange', 1: 'red' }
            }).addTo(map);
            this.textContent = 'Hide Heat Map';
        }
    });

    // Risk Factors Chart
    const riskFactorsCtx = document.getElementById('risk-factors-chart').getContext('2d');
    new Chart(riskFactorsCtx, {
        type: 'radar',
        data: {
            labels: ['Temperature', 'Wind', 'Humidity', 'Vegetation', 'Terrain'],
            datasets: [{
                label: 'Current Risk Factors',
                data: [80, 65, 70, 85, 60],
                backgroundColor: 'rgba(255, 87, 34, 0.2)',
                borderColor: 'rgb(255, 87, 34)',
                pointBackgroundColor: 'rgb(255, 87, 34)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 87, 34)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { display: false },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });

    // Risk Trend Chart (Line Chart)
    const riskTrendCtx = document.getElementById('risk-trend-chart').getContext('2d');
    new Chart(riskTrendCtx, {
        type: 'line',
        data: {
            labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
            datasets: [{
                label: 'Risk Level',
                data: [30, 45, 75, 65, 45],
                borderColor: 'rgb(255, 87, 34)',
                backgroundColor: 'rgba(255, 87, 34, 0.5)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });