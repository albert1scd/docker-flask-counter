// Global variables
let autoRefreshInterval;
const AUTO_REFRESH_DELAY = 10000; // 10 seconds

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set up auto-refresh toggle
    const autoRefreshToggle = document.getElementById('autoRefreshToggle');
    autoRefreshToggle.addEventListener('change', toggleAutoRefresh);
});

// Toggle auto-refresh functionality
function toggleAutoRefresh(event) {
    if (event.target.checked) {
        // Start auto-refresh
        autoRefreshInterval = setInterval(refreshStats, AUTO_REFRESH_DELAY);
    } else {
        // Stop auto-refresh
        clearInterval(autoRefreshInterval);
    }
}

// Animate number changes
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const animate = () => {
        current += increment;
        element.textContent = Math.round(current);
        
        if ((increment > 0 && current < end) || (increment < 0 && current > end)) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = end;
        }
    };
    
    requestAnimationFrame(animate);
}

// Update stats with animation
function updateStatWithAnimation(elementId, newValue) {
    const element = document.getElementById(elementId);
    const oldValue = parseInt(element.textContent);
    
    if (oldValue !== newValue) {
        element.classList.add('updated');
        animateValue(element, oldValue, newValue, 500);
        
        // Remove highlight class after animation
        setTimeout(() => {
            element.classList.remove('updated');
        }, 500);
    }
}

// Refresh all stats
async function refreshStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        // Update each stat with animation
        updateStatWithAnimation('totalVisits', data.total_visits);
        updateStatWithAnimation('todayVisits', data.today_visits);
        
        // Update timestamps
        document.getElementById('lastVisit').textContent = data.last_visit;
        document.getElementById('currentTime').textContent = data.current_time;
        
    } catch (error) {
        console.error('Error fetching stats:', error);
        // Optionally disable auto-refresh on error
        const autoRefreshToggle = document.getElementById('autoRefreshToggle');
        if (autoRefreshToggle.checked) {
            autoRefreshToggle.checked = false;
            clearInterval(autoRefreshInterval);
        }
    }
}