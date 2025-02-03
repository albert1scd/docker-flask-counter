let visitsChart;
let visitData = [];

document.addEventListener('DOMContentLoaded', function() {
    initChart();
    // Update every 5 seconds
    setInterval(updateStats, 5000);
});

function initChart() {
    const ctx = document.getElementById('visitsChart').getContext('2d');
    visitsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Number of Visits',
                data: [],
                borderColor: '#0A9396',
                backgroundColor: '#0A939620',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#E2D784'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#073B3D'
                    },
                    ticks: {
                        color: '#E2D784'
                    }
                },
                x: {
                    grid: {
                        color: '#073B3D'
                    },
                    ticks: {
                        color: '#E2D784'
                    }
                }
            }
        }
    });
}

async function updateStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        // Update stats
        document.getElementById('totalVisits').textContent = data.total_visits;
        document.getElementById('todayVisits').textContent = data.today_visits;

        // Update chart
        const now = new Date().toLocaleTimeString();
        visitData.push({
            time: now,
            visits: data.total_visits
        });

        // Keep only last 10 data points
        if (visitData.length > 10) {
            visitData.shift();
        }

        // Update chart data
        visitsChart.data.labels = visitData.map(d => d.time);
        visitsChart.data.datasets[0].data = visitData.map(d => d.visits);
        visitsChart.update();

    } catch (error) {
        console.error('Error updating stats:', error);
    }
}
