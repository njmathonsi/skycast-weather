const form = document.getElementById('weather-form');
const result = document.getElementById('weather-result');
const input = document.getElementById('city-input');
const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your real API key

// Display weather data
function showWeather(data) {
  const temp = data.main.temp;
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon;
  const city = data.name;

  result.innerHTML = `
    <h2>${city}</h2>
    <p>${temp}°C — ${desc}</p>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
  `;
}

// Fetch weather from a URL
async function fetchWeather(url) {
  result.innerHTML = '<p>Loading...</p>';
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('City not found or API issue');
    const data = await response.json();
    showWeather(data);
  } catch (error) {
    result.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Handle form submit (city input)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) return;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
});

// Auto-detect user location on load
window.addEventListener('load', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        fetchWeather(url);
      },
      (error) => {
        result.innerHTML = `<p>Location access denied. Please enter a city manually.</p>`;
        console.error('Geolocation error:', error.message);
      }
    );
  } else {
    result.innerHTML = '<p>Geolocation not supported by your browser. Please enter a city.</p>';
  }
});

