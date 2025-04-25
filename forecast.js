const apiKey = '7cde4b1656fae237851b00c5e796fe66';
// Default: Jamshedpur, India coordinates
let lat = 22.8046; 
let lon = 86.2029; 
const forecastContainer = document.querySelector('.forecast-container');
const locationDisplay = document.querySelector('.location');

// Add search functionality
const searchBox = document.querySelector('.search-box');
const searchButton = document.querySelector('.search-container button');

async function fetchForecast() {
    try {
        // Show loading state
        forecastContainer.innerHTML = `
            <div class="loading">
                <i class="fa-solid fa-spinner"></i>
                <p>Loading forecast data...</p>
            </div>
        `;
        
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch forecast data');
        }
        
        const data = await response.json();

        // Update location name
        locationDisplay.textContent = data.city.name + ', ' + data.city.country;

        // Clear the container
        forecastContainer.innerHTML = '<div class="forecast-cards"></div>';
        const forecastCards = forecastContainer.querySelector('.forecast-cards');

        // Group forecast data by day
        const dailyForecasts = {};
        data.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString();
            
            if (!dailyForecasts[day]) {
                dailyForecasts[day] = {
                    date: date,
                    temps: [],
                    humidity: forecast.main.humidity,
                    wind: forecast.wind.speed,
                    weather: forecast.weather[0],
                    pop: forecast.pop,
                    feels_like: forecast.main.feels_like,
                    pressure: forecast.main.pressure
                };
            }
            dailyForecasts[day].temps.push(forecast.main.temp);
        });

        // Create forecast cards for each day
        Object.values(dailyForecasts).slice(0, 7).forEach((day, index) => {
            const dayName = day.date.toLocaleDateString('en-US', { weekday: 'long' });
            const formattedDate = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const maxTemp = Math.round(Math.max(...day.temps));
            const minTemp = Math.round(Math.min(...day.temps));
            const weatherIcon = getWeatherIcon(day.weather.main, day.weather.description);
            
            // Add weather description
            const weatherDesc = day.weather.description.charAt(0).toUpperCase() + day.weather.description.slice(1);

            const card = `
                <div class="forecast-card ${index === 0 ? 'active' : ''}">
                    <div class="forecast-date">
                        <span class="day-name">${index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : dayName}</span>
                        <span class="date">${formattedDate}</span>
                    </div>
                    <div class="forecast-icon">
                        <i class="${weatherIcon}"></i>
                        <div class="weather-desc">${weatherDesc}</div>
                    </div>
                    <div class="forecast-temp">
                        <span class="temp-high">${maxTemp}°C</span>
                        <span class="temp-low">${minTemp}°C</span>
                    </div>
                    <div class="forecast-details">
                        <div class="detail">
                            <i class="fa-solid fa-droplet"></i>
                            <span>Humidity: ${day.humidity}%</span>
                        </div>
                        <div class="detail">
                            <i class="fa-solid fa-wind"></i>
                            <span>Wind: ${Math.round(day.wind * 3.6)} km/h</span>
                        </div>
                        <div class="detail">
                            <i class="fa-solid fa-cloud-rain"></i>
                            <span>Precip: ${Math.round(day.pop * 100)}%</span>
                        </div>
                        <div class="detail">
                            <i class="fa-solid fa-temperature-half"></i>
                            <span>Feels like: ${Math.round(day.feels_like)}°C</span>
                        </div>
                    </div>
                </div>
            `;

            forecastCards.innerHTML += card;
        });
        
        // Add chart container
        const chartContainer = document.createElement('div');
        chartContainer.className = 'forecast-chart-container';
        chartContainer.innerHTML = `
            <h2>Temperature Trend</h2>
            <div class="chart-placeholder">
                <canvas id="tempChart"></canvas>
            </div>
        `;
        forecastContainer.appendChild(chartContainer);
        
        // Initialize chart
        initializeChart(Object.values(dailyForecasts).slice(0, 7));
        
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        forecastContainer.innerHTML = `
            <div class="error">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p>Unable to load forecast data. Please check your internet connection and try again.</p>
            </div>
        `;
    }
}

// Function to initialize temperature chart
function initializeChart(forecastData) {
    const ctx = document.getElementById('tempChart');
    if (!ctx) return;
    
    const labels = forecastData.map(day => {
        const date = day.date;
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    });
    
    const highTemps = forecastData.map(day => Math.round(Math.max(...day.temps)));
    const lowTemps = forecastData.map(day => Math.round(Math.min(...day.temps)));
    
    // Create gradient for high temps
    const highGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    highGradient.addColorStop(0, 'rgba(231, 76, 60, 0.8)');
    highGradient.addColorStop(1, 'rgba(231, 76, 60, 0.1)');
    
    // Create gradient for low temps
    const lowGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    lowGradient.addColorStop(0, 'rgba(52, 152, 219, 0.8)');
    lowGradient.addColorStop(1, 'rgba(52, 152, 219, 0.1)');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'High Temperature',
                    data: highTemps,
                    borderColor: 'rgba(231, 76, 60, 1)',
                    backgroundColor: highGradient,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Low Temperature',
                    data: lowTemps,
                    borderColor: 'rgba(52, 152, 219, 1)',
                    backgroundColor: lowGradient,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}

// Function to get Font Awesome icon based on weather condition
function getWeatherIcon(main, description) {
    const icons = {
        Clear: "fa-solid fa-sun",
        Clouds: description.includes("few") || description.includes("scattered") ? "fa-solid fa-cloud-sun" : "fa-solid fa-cloud",
        Rain: description.includes("light") ? "fa-solid fa-cloud-rain" : "fa-solid fa-cloud-showers-heavy",
        Drizzle: "fa-solid fa-cloud-rain",
        Thunderstorm: "fa-solid fa-bolt",
        Snow: "fa-solid fa-snowflake",
        Mist: "fa-solid fa-smog",
        Fog: "fa-solid fa-smog",
        Haze: "fa-solid fa-smog",
        Dust: "fa-solid fa-smog",
        Smoke: "fa-solid fa-smog",
        Sand: "fa-solid fa-smog",
        Ash: "fa-solid fa-smog",
        Squall: "fa-solid fa-wind",
        Tornado: "fa-solid fa-wind"
    };
    
    return icons[main] || "fa-solid fa-cloud";
}

// Function to get coordinates from city name
async function getCoordinates(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }
        
        const data = await response.json();
        
        if (data.length === 0) {
            throw new Error('City not found');
        }
        
        return {
            lat: data[0].lat,
            lon: data[0].lon,
            name: data[0].name,
            country: data[0].country
        };
    } catch (error) {
        console.error("Error getting coordinates:", error);
        throw error;
    }
}

// Function to search for a city
async function searchCity(city) {
    try {
        // Show loading state
        forecastContainer.innerHTML = `
            <div class="loading">
                <i class="fa-solid fa-spinner"></i>
                <p>Searching for location...</p>
            </div>
        `;
        
        const locationData = await getCoordinates(city);
        lat = locationData.lat;
        lon = locationData.lon;
        
        // Update location display
        locationDisplay.textContent = `${locationData.name}, ${locationData.country}`;
        
        // Fetch forecast for the new location
        await fetchForecast();
    } catch (error) {
        console.error("Error searching city:", error);
        forecastContainer.innerHTML = `
            <div class="error">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p>City not found. Please check the spelling and try again.</p>
            </div>
        `;
    }
}

// Add event listeners for search
if (searchBox && searchButton) {
    searchButton.addEventListener('click', () => {
        const city = searchBox.value.trim();
        if (city) searchCity(city);
    });
    
    searchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = searchBox.value.trim();
            if (city) searchCity(city);
        }
    });
}

// Initialize with default location
fetchForecast(); 