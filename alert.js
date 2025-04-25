// Weather and Natural Disaster Alerts
document.addEventListener('DOMContentLoaded', function() {
    const alertsContainer = document.querySelector('.alerts-container');
    
    // Function to fetch and display alerts
    function fetchAlerts() {
        // Show loading state
        alertsContainer.innerHTML = `
            <div class="loading-alerts">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <p>Loading alerts...</p>
            </div>
        `;
        
        const data = null;
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        
        xhr.addEventListener('readystatechange', function() {
            if (this.readyState === this.DONE) {
                try {
                    const response = JSON.parse(this.responseText);
                    displayAlerts(response);
                } catch (error) {
                    console.error('Error parsing alert data:', error);
                    showError();
                }
            }
        });
        
        xhr.addEventListener('error', function() {
            console.error('Network error occurred');
            showError();
        });
        
        xhr.open('GET', 'https://indonesia-most-accurate-weather-and-earthquake.p.rapidapi.com/weather/jawa-timur/surabaya');
        xhr.setRequestHeader('x-rapidapi-key', '05594f6078mshd564853a33eeb82p15820ejsnbc3a5aff731f');
        xhr.setRequestHeader('x-rapidapi-host', 'indonesia-most-accurate-weather-and-earthquake.p.rapidapi.com');
        
        xhr.send(data);
    }
    
    // Function to display alerts
    function displayAlerts(data) {
        if (!data || !data.alerts || data.alerts.length === 0) {
            alertsContainer.innerHTML = `
                <div class="no-alerts">
                    <i class="fa-solid fa-check-circle"></i>
                    <p>No active weather alerts</p>
                </div>
            `;
            return;
        }
        
        let alertsHTML = '<div class="alerts-list">';
        
        data.alerts.forEach(alert => {
            const alertType = alert.type || 'weather';
            const alertIcon = getAlertIcon(alertType);
            const alertClass = getAlertClass(alertType);
            
            alertsHTML += `
                <div class="alert-item ${alertClass}">
                    <div class="alert-icon">
                        <i class="${alertIcon}"></i>
                    </div>
                    <div class="alert-content">
                        <h4>${alert.title || 'Weather Alert'}</h4>
                        <p>${alert.description || 'No description available'}</p>
                        <div class="alert-meta">
                            <span class="alert-time">
                                <i class="fa-solid fa-clock"></i> 
                                ${formatDate(alert.timestamp)}
                            </span>
                            <span class="alert-location">
                                <i class="fa-solid fa-location-dot"></i> 
                                ${alert.location || 'Unknown location'}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        alertsHTML += '</div>';
        alertsContainer.innerHTML = alertsHTML;
    }
    
    // Function to show error state
    function showError() {
        alertsContainer.innerHTML = `
            <div class="error-alerts">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p>Unable to load alerts. Please try again later.</p>
            </div>
        `;
    }
    
    // Helper function to get appropriate icon based on alert type
    function getAlertIcon(type) {
        const icons = {
            weather: 'fa-solid fa-cloud-showers-heavy',
            earthquake: 'fa-solid fa-house-crack',
            tsunami: 'fa-solid fa-water',
            volcano: 'fa-solid fa-volcano',
            flood: 'fa-solid fa-water',
            landslide: 'fa-solid fa-mountain',
            default: 'fa-solid fa-triangle-exclamation'
        };
        
        return icons[type.toLowerCase()] || icons.default;
    }
    
    // Helper function to get appropriate CSS class based on alert type
    function getAlertClass(type) {
        const classes = {
            weather: 'weather-alert',
            earthquake: 'earthquake-alert',
            tsunami: 'tsunami-alert',
            volcano: 'volcano-alert',
            flood: 'flood-alert',
            landslide: 'landslide-alert',
            default: 'default-alert'
        };
        
        return classes[type.toLowerCase()] || classes.default;
    }
    
    // Helper function to format date
    function formatDate(timestamp) {
        if (!timestamp) return 'Unknown time';
        
        const date = new Date(timestamp);
        return date.toLocaleString();
    }
    
    // Fetch alerts when page loads
    fetchAlerts();
    
    // Refresh alerts every 5 minutes
    setInterval(fetchAlerts, 5 * 60 * 1000);
}); 