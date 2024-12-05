     // Incident Details
     const incidentDetails = [
        { icon: "🗺️", title: "Location", content: "Chréa Forest, Tunisia<br>36.5417° N, 8.6875° E" },
        { icon: "🕒", title: "Time", content: "Started: 2024-01-15 14:30" },
        { icon: "🔥", title: "Status", content: "Active" },
        { icon: "⚠️", title: "Affected Area", content: "Current: 2.5 km²<br>Predicted: 4.8 km²" },
        { icon: "⏱️", title: "Estimated Time", content: "45 minutes to predicted state" }
        ];
        
        const incidentContainer = document.getElementById('incident-details');
        incidentDetails.forEach((detail) => {
        const detailEl = document.createElement('button');
        detailEl.className = 'btn btn-outline h-auto flex flex-col items-start p-4 space-y-2';
        detailEl.innerHTML = `
            <span>${detail.icon}</span>
            <div class="font-semibold">${detail.title}</div>
            <div class="text-sm text-left hidden">${detail.content}</div>
        `;
        detailEl.addEventListener('click', () => {
            detailEl.querySelector('.text-sm').classList.toggle('hidden');
        });
        incidentContainer.appendChild(detailEl);
        });
        
        // Map Initialization
        const map = L.map('map').setView([36.5417, 8.6875], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        
        const burnedArea = L.polygon(
          [[36.540, 8.685], [36.543, 8.690], [36.546, 8.686], [36.542, 8.682]],
          { color: 'red' }
        ).addTo(map).bindPopup('Burned Area');
        
        const predictedArea = L.polygon(
          [[36.546, 8.686], [36.550, 8.692], [36.553, 8.688], [36.548, 8.683]],
          { color: 'orange' }
        ).addTo(map).bindPopup('Predicted Area');
        
        // Add Probability Control
        const fireProbabilityControl = L.control({ position: 'topright' });
        
        fireProbabilityControl.onAdd = function (map) {
          const div = L.DomUtil.create('div', 'fire-probability-control');
          div.innerHTML = `
            <h3>🔥 Fire Spread Prediction</h3>
            <p><strong>Detected Areas:</strong></p>
            <ul id="detected-areas-list">
              <li>Burned Area: <span id="burned-area-probability">75%</span></li>
              <li>Predicted Area: <span id="predicted-area-probability">80%</span></li>
            </ul>`;
          div.style.background = 'rgba(255, 255, 255, 0.9)';
          div.style.padding = '10px';
          div.style.borderRadius = '5px';
          div.style.fontSize = '14px';
          return div;
        };
        
        fireProbabilityControl.addTo(map);
        
        // Function to generate a random probability (between 50% and 100%)
        function generateProbability() {
          return Math.floor(Math.random() * 50) + 50; // Generates between 50 and 100
        }
        
        // Update probabilities dynamically
        setInterval(() => {
          const burnedAreaProbability = generateProbability();
          const predictedAreaProbability = generateProbability();
        
          document.getElementById('burned-area-probability').textContent = `${burnedAreaProbability}%`;
          document.getElementById('predicted-area-probability').textContent = `${predictedAreaProbability}%`;
        }, 5000); // Update every 5 seconds
        
        // Deployed Units Chart
        const deployedUnitsCtx = document.getElementById('deployed-units-chart').getContext('2d');
        new Chart(deployedUnitsCtx, {
        type: 'pie',
        data: {
            labels: ['Firefighters', 'Vehicles', 'Aircraft', 'Drones'],
            datasets: [{
                data: [50, 20, 5, 15],
                backgroundColor: ['#FF5722', '#FF7043', '#FF8A65', '#FFAB91']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
        });
        
        // Response Timeline Chart
        const responseTimelineCtx = document.getElementById('response-timeline-chart').getContext('2d');
        new Chart(responseTimelineCtx, {
        type: 'line',
        data: {
            labels: ['0', '5', '10', '15', '20'],
            datasets: [{
                label: 'Fire Intensity',
                data: [50, 70, 90, 60, 30],
                borderColor: '#F44336',
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (min)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Intensity (%)'
                    }
                }
            }
        }
        });