document.addEventListener('DOMContentLoaded', () => {
    loadCurrentWeather();
    document.getElementById('current-weather-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadCurrentWeather();
    });

    document.getElementById('forecast-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadForecast();
    });
});

//Fetch Weather

const contentDiv = document.getElementById('content');
const cities = [
    { name: 'New York', latitude: 40.7128, longitude: -74.0060, img: 'city-images/newyork.jpg' },
    { name: 'Berlin', latitude: 52.5200, longitude: 13.4050, img: 'city-images/berlin.jpg' },
    { name: 'Istanbul', latitude: 41.0082, longitude: 28.9784, img: 'city-images/istanbul.jpg' },
    { name: 'Paris', latitude: 48.8566, longitude: 2.3522, img: 'city-images/paris.jpg' },
    { name: 'Zurich', latitude: 47.3769, longitude: 8.5417, img: 'city-images/zurich.jpg' },
    { name: 'Amsterdam', latitude: 52.3676, longitude: 4.9041, img: 'city-images/amsterdam.jpg' }
];
function loadCurrentWeather() {
    contentDiv.innerHTML = '';
    cities.sort((a, b) => a.name.localeCompare(b.name));
    cities.forEach(city => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`)
    .then(res => {
        if (!res.ok) {
            throw new Error(res.status);
        }
        return res.json();
    })
    .then(data => {
        console.log(data);

        const currentWeather = data.current_weather;
        const temperature = currentWeather.temperature;
        const windSpeed = currentWeather.windspeed;

        const cityDiv = document.createElement('div');
        cityDiv.className = 'city';
        const weatherHtml = `
        <h2>${city.name}</h2>
        <img src="${city.img}" alt="${city.name}">
        <p>Current Temperature: ${temperature}&deg;C</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
        cityDiv.innerHTML = weatherHtml;
        contentDiv.appendChild(cityDiv);
        })
    .catch(error => {
        console.error('Error fetching weather data:', error);

        const errorMessage = document.createElement('p');
        errorMessage.innerText = 'Failed to load weather data due to an error.';
        errorMessage.className = 'error';
        cityDiv.appendChild(errorMessage);
        contentDiv.appendChild(cityDiv);
    });
});
}
function loadForecast() {
    contentDiv.innerHTML = '';
    cities.sort((a, b) => a.name.localeCompare(b.name));
    cities.forEach(city => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum`)
     .then(res => {
        if (!res.ok) {
            throw new Error(res.status);
        }
        return res.json();
    })
    .then(data => {
        console.log(data);

        const forecast = data.daily;
        const maxTemp = forecast.temperature_2m_max[0];
        const minTemp = forecast.temperature_2m_min[0];
        const precipitation = forecast.precipitation_sum[0];

        const cityDiv = document.createElement('div');
        cityDiv.className = 'city';
        const forecastHtml = `
        <h2>${city.name}</h2>
        <img src="${city.img}" alt="${city.name}">
        <p>Max Temperature: ${maxTemp}&deg;C</p>
        <p>Min Temperature: ${minTemp}&deg;C</p>
        <p>Precipitation: ${precipitation} mm</p>
    `;
        cityDiv.innerHTML = forecastHtml;
        contentDiv.appendChild(cityDiv);
        })
    .catch(error => {
        console.error('Error fetching forecast data:', error);

        const errorMessage = document.createElement('p');
        errorMessage.innerText = 'Failed to load forecast data due to an error.';
        errorMessage.className = 'error';
        contentDiv.appendChild(errorMessage);
        });
    });
}