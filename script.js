// Weather App Project
// Weather Forecast Application

const apiKey = '05e1198b79004f3e69aa108166570c65';
const apiUrl = 'https://api.openweathermap.org/data/2.5';

let currentUnit = 'metric';
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const celsiusBtn = document.getElementById('celsiusBtn');
const fahrenheitBtn = document.getElementById('fahrenheitBtn');
const recentSearchesDiv = document.getElementById('recentSearches');
const recentList = document.getElementById('recentList');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const alertMessage = document.getElementById('alertMessage');
const alertText = document.getElementById('alertText');
const updateLocationBtn = document.getElementById('updateLocationBtn');

// Weather display elements
const currentCity = document.getElementById('currentCity');
const currentDate = document.getElementById('currentDate');
const currentTemp = document.getElementById('currentTemp');
const weatherDesc = document.getElementById('weatherDesc');
const weatherIcon = document.getElementById('weatherIcon');
const windSpeed = document.getElementById('windSpeed');
const humidity = document.getElementById('humidity');
const feelsLike = document.getElementById('feelsLike');
const pressure = document.getElementById('pressure');
const currentLocation = document.getElementById('currentLocation');
const currentLocTemp = document.getElementById('currentLocTemp');
const currentLocCondition = document.getElementById('currentLocCondition');
const forecastContainer = document.getElementById('forecastContainer');

// Event Listeners
searchBtn.addEventListener('click', searchCity);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchCity();
});
locationBtn.addEventListener('click', getCurrentLocation);
updateLocationBtn.addEventListener('click', getCurrentLocation);
celsiusBtn.addEventListener('click', () => switchUnit('metric'));
fahrenheitBtn.addEventListener('click', () => switchUnit('imperial'));

// Show recent searches when clicking input
cityInput.addEventListener('focus', showRecentSearches);
cityInput.addEventListener('blur', () => {
    setTimeout(() => {
        recentSearchesDiv.classList.add('hidden');
    }, 200);
});

// Initialize app
window.onload = function() {
    loadDefaultCity();
    updateRecentSearchesUI();
};

// Search for a city
async function searchCity() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    hideError();
    hideAlert();
    
    try {
        const data = await getWeatherData(city);
        displayWeather(data.current);
        displayForecast(data.forecast);
        addToRecentSearches(city);
        updateRecentSearchesUI();
        checkTemperatureAlert(data.current.main.temp);
    } catch (error) {
        showError('City not found. Please check the spelling.');
    }
}

// Get weather data from API
async function getWeatherData(city) {
    // Current weather
    const currentUrl = `${apiUrl}/weather?q=${encodeURIComponent(city)}&units=${currentUnit}&appid=${apiKey}`;
    const currentResponse = await fetch(currentUrl);
    
    if (!currentResponse.ok) {
        throw new Error('City not found');
    }
    
    const currentData = await currentResponse.json();
    
    // 5-day forecast
    const forecastUrl = `${apiUrl}/forecast?q=${encodeURIComponent(city)}&units=${currentUnit}&appid=${apiKey}`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();
    
    return { current: currentData, forecast: forecastData };
}

// Display current weather
function displayWeather(data) {
    currentCity.textContent = `${data.name}, ${data.sys.country}`;
    currentDate.textContent = formatDate(new Date());
    currentTemp.textContent = Math.round(data.main.temp);
    weatherDesc.textContent = data.weather[0].description;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    humidity.textContent = `${data.main.humidity}%`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°${currentUnit === 'metric' ? 'C' : 'F'}`;
    pressure.textContent = `${data.main.pressure} hPa`;
    
    updateWeatherIcon(data.weather[0].main);
    updateBackground(data.weather[0].main);
}

// Display 5-day forecast
function displayForecast(data) {
    const dailyData = {};
    
    // Group forecast by day
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) {
            dailyData[date] = {
                temp: item.main.temp,
                wind: item.wind.speed,
                humidity: item.main.humidity,
                condition: item.weather[0].main,
                date: item.dt
            };
        }
    });
    
    // Get next 5 days
    const forecastArray = Object.values(dailyData).slice(1, 6);
    
    forecastContainer.innerHTML = '';
    
    forecastArray.forEach(day => {
        const card = document.createElement('div');
        card.className = 'forecast-card bg-gray-50 rounded-xl p-4 text-center';
        
        const date = new Date(day.date * 1000);
        const icon = getWeatherIcon(day.condition);
        
        card.innerHTML = `
            <div class="text-gray-600 mb-2">${formatForecastDate(date)}</div>
            <div class="text-4xl mb-3">${icon}</div>
            <div class="text-2xl font-bold text-gray-800 mb-2">${Math.round(day.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}</div>
            <div class="flex items-center justify-center text-gray-600 mb-1">
                <i class="fas fa-wind mr-2"></i>
                <span>${day.wind.toFixed(1)} m/s</span>
            </div>
            <div class="flex items-center justify-center text-gray-600">
                <i class="fas fa-tint mr-2"></i>
                <span>${day.humidity}%</span>
            </div>
        `;
        
        forecastContainer.appendChild(card);
    });
}

// Get current location weather
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                const url = `${apiUrl}/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${apiKey}`;
                const response = await fetch(url);
                const data = await response.json();
                
                // Update current location display
                currentLocation.textContent = data.name;
                currentLocTemp.textContent = `${Math.round(data.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}`;
                currentLocCondition.textContent = data.weather[0].main;
                
                // Also update main weather display
                cityInput.value = data.name;
                const weatherData = await getWeatherData(data.name);
                displayWeather(weatherData.current);
                displayForecast(weatherData.forecast);
                addToRecentSearches(data.name);
                updateRecentSearchesUI();
                
            } catch (error) {
                showError('Failed to get location weather');
            }
        },
        (error) => {
            showError('Unable to access your location. Please allow location access.');
        }
    );
}

// Switch temperature unit
function switchUnit(unit) {
    if (currentUnit === unit) return;
    
    currentUnit = unit;
    
    // Update button styles
    if (unit === 'metric') {
        celsiusBtn.classList.add('bg-blue-500', 'text-white');
        celsiusBtn.classList.remove('text-gray-700');
        fahrenheitBtn.classList.remove('bg-blue-500', 'text-white');
        fahrenheitBtn.classList.add('text-gray-700');
    } else {
        fahrenheitBtn.classList.add('bg-blue-500', 'text-white');
        fahrenheitBtn.classList.remove('text-gray-700');
        celsiusBtn.classList.remove('bg-blue-500', 'text-white');
        celsiusBtn.classList.add('text-gray-700');
    }
    
    // Refresh current city if exists
    if (currentCity.textContent !== '--') {
        const city = currentCity.textContent.split(',')[0];
        cityInput.value = city;
        searchCity();
    }
}

// Recent searches functions
function addToRecentSearches(city) {
    // Remove if already exists
    recentSearches = recentSearches.filter(item => 
        item.toLowerCase() !== city.toLowerCase()
    );
    
    // Add to beginning
    recentSearches.unshift(city);
    
    // Keep only 5 items
    if (recentSearches.length > 5) {
        recentSearches.pop();
    }
    
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

function updateRecentSearchesUI() {
    recentList.innerHTML = '';
    
    if (recentSearches.length === 0) {
        return;
    }
    
    recentSearches.forEach(city => {
        const item = document.createElement('div');
        item.className = 'px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors';
        item.textContent = city;
        item.addEventListener('click', () => {
            cityInput.value = city;
            searchCity();
            recentSearchesDiv.classList.add('hidden');
        });
        recentList.appendChild(item);
    });
}

function showRecentSearches() {
    if (recentSearches.length > 0) {
        recentSearchesDiv.classList.remove('hidden');
    }
}

// Weather icon functions
function updateWeatherIcon(condition) {
    const iconMap = {
        'Clear': 'fas fa-sun',
        'Clouds': 'fas fa-cloud',
        'Rain': 'fas fa-cloud-rain',
        'Snow': 'fas fa-snowflake',
        'Thunderstorm': 'fas fa-bolt',
        'Drizzle': 'fas fa-cloud-sun-rain',
        'Mist': 'fas fa-smog'
    };
    
    const iconClass = iconMap[condition] || 'fas fa-cloud';
    weatherIcon.innerHTML = `<i class="${iconClass} weather-icon"></i>`;
}

function getWeatherIcon(condition) {
    const iconMap = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Snow': '❄️',
        'Thunderstorm': '⛈️',
        'Drizzle': '🌦️',
        'Mist': '🌫️'
    };
    
    return iconMap[condition] || '☁️';
}

// Update background based on weather
function updateBackground(condition) {
    const body = document.body;
    
    // Remove all weather classes
    body.classList.remove('sunny', 'cloudy', 'rainy', 'clear', 'snow');
    
    if (condition === 'Clear') {
        body.classList.add('sunny');
    } else if (condition === 'Clouds') {
        body.classList.add('cloudy');
    } else if (condition === 'Rain' || condition === 'Drizzle' || condition === 'Thunderstorm') {
        body.classList.add('rainy');
    } else if (condition === 'Snow') {
        body.classList.add('snow');
    } else {
        body.classList.add('clear');
    }
}

// Check for extreme temperatures
function checkTemperatureAlert(temp) {
    hideAlert();
    
    let message = '';
    
    if (currentUnit === 'metric') {
        if (temp > 40) {
            message = `Extreme heat warning! Temperature is ${Math.round(temp)}°C`;
        } else if (temp < 0) {
            message = `Freezing warning! Temperature is ${Math.round(temp)}°C`;
        }
    } else {
        if (temp > 104) {
            message = `Extreme heat warning! Temperature is ${Math.round(temp)}°F`;
        } else if (temp < 32) {
            message = `Freezing warning! Temperature is ${Math.round(temp)}°F`;
        }
    }
    
    if (message) {
        showAlert(message);
    }
}

// Error handling functions
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showAlert(message) {
    alertText.textContent = message;
    alertMessage.classList.remove('hidden');
}

function hideAlert() {
    alertMessage.classList.add('hidden');
}

// Helper functions
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatForecastDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Load default city
async function loadDefaultCity() {
    try {
        const data = await getWeatherData('London');
        displayWeather(data.current);
        displayForecast(data.forecast);
    } catch (error) {
        console.log('Failed to load default city');
    }
}// Added for commit 4 
// Added for commit 5 
// Added for commit 6 
// Added for commit 7 
// Added for commit 8 
