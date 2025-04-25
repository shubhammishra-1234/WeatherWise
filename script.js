document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "49d9a3c83c094e658ae22020251604";
    const apiUrl = "https://api.weatherapi.com/v1/current.json";
  
    const searchBox = document.querySelector(".search-box");
    const searchButton = document.querySelector(".search-container button");
  
    const weatherTemp = document.querySelector(".weather-temp");
    const weatherDesc = document.querySelector(".weather-desc");
    const locationElem = document.querySelector(".location");
    const dateDayName = document.querySelector(".date-dayname");
    const dateDay = document.querySelector(".date-day");
    const humidityElem = document.querySelector(".humidity .value");
    const windElem = document.querySelector(".wind .value");
    const precipitationElem = document.querySelector(".percipitation .value");
    const weatherIcon = document.querySelector(".weather-info .icon");
    const feelsLikeElem = document.querySelector(".detail-item:first-child strong");
    const visibilityElem = document.querySelector(".detail-item:last-child strong");
  
    function fetchWeather(city) {
      if (!city) return;
      
      searchButton.disabled = true;
      searchButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Searching...';
      
      fetch(`${apiUrl}?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`)
        .then((response) => {
          if (!response.ok) throw new Error("City not found");
          return response.json();
        })
        .then((data) => updateWeatherUI(data))
        .catch((error) => {
          alert("City not found. Please try again.");
          console.error("Error:", error);
        })
        .finally(() => {
          searchButton.disabled = false;
          searchButton.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Search';
        });
    }
  
    function updateWeatherUI(data) {
      const { location, current } = data;
  
      locationElem.textContent = `${location.name}, ${location.country}`;
      weatherTemp.textContent = `${Math.round(current.temp_c)}°C`;
      weatherDesc.textContent = current.condition.text;
      humidityElem.textContent = `${current.humidity}%`;
      windElem.textContent = `${current.wind_kph} km/h`;
      
      // Update precipitation data
      if (current.precip_mm > 0) {
        precipitationElem.textContent = `${current.precip_mm} mm`;
      } else {
        precipitationElem.textContent = "0%";
      }
      
      weatherIcon.className = getWeatherIcon(current.condition.text);
      
      // Update feels like temperature
      feelsLikeElem.textContent = `${Math.round(current.feelslike_c)}°C`;
      
      // Update visibility (convert to km)
      const visibilityKm = (current.vis_km).toFixed(1);
      visibilityElem.textContent = `${visibilityKm} km`;
      
      updateDate();
    }
  
    function getWeatherIcon(condition) {
      const icons = {
        Sunny: "fa-solid fa-sun icon",
        "Partly cloudy": "fa-solid fa-cloud-sun icon",
        Cloudy: "fa-solid fa-cloud icon",
        Overcast: "fa-solid fa-cloud icon",
        Mist: "fa-solid fa-smog icon",
        Rain: "fa-solid fa-cloud-rain icon",
        Snow: "fa-solid fa-snowflake icon",
        Thunderstorm: "fa-solid fa-bolt icon",
        "Patchy rain possible": "fa-solid fa-cloud-showers-heavy icon",
        "Light rain shower": "fa-solid fa-cloud-showers-heavy icon",
      };
  
      return icons[condition] || "fa-solid fa-cloud icon";
    }
  
    function updateDate() {
      const now = new Date();
      const options = { weekday: "long", day: "numeric", month: "short" };
  
      dateDayName.textContent = now.toLocaleDateString("en-US", { weekday: "long" });
      dateDay.textContent = now.toLocaleDateString("en-US", options).split(",")[1];
    }
  
    searchButton.addEventListener("click", () => {
      const city = searchBox.value.trim();
      if (city) fetchWeather(city);
    });
  
    searchBox.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const city = searchBox.value.trim();
        if (city) fetchWeather(city);
      }
    });
  
    // Load default city on load
    fetchWeather("Jamshedpur");
});
  