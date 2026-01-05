const apiKey = "061bca284bfacdd70b9f274ef6c0a77e";

// ---------- LOADER ----------
function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
}
function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}

// ---------- CITY WEATHER ----------
function getWeatherByCity() {
  const city = document.getElementById("cityInput").value;
  if (city === "") return alert("Enter city name");
  showLoader();
  fetchWeather(`q=${city}`);
}

// ---------- LOCATION WEATHER ----------
function getLocationWeather() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  showLoader();
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeather(`lat=${lat}&lon=${lon}`);
  });
}

// ---------- FETCH WEATHER ----------
function fetchWeather(query) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      displayWeather(data);
      fetchForecast(data.coord.lat, data.coord.lon);
    })
    .catch(err => alert("Error fetching data"))
    .finally(() => hideLoader());
}

// ---------- DISPLAY CURRENT WEATHER ----------
function displayWeather(data) {
  const box = document.getElementById("weatherBox");

  const isDay = data.weather[0].icon.includes("d");
  setBackground(data.weather[0].main, isDay);

  box.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    <p><b>${data.weather[0].description}</b></p>
    <p>🌡 Temp: ${data.main.temp} °C</p>
    <p>🤒 Feels Like: ${data.main.feels_like} °C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬 Wind: ${data.wind.speed} m/s</p>
    <p>👁 Visibility: ${data.visibility / 1000} km</p>
    <p>🌅 Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
    <p>🌇 Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
  `;
}

// ---------- 7 DAY FORECAST ----------
function fetchForecast(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      let forecastHTML = "<h3>📅 7-Day Forecast</h3>";
      data.daily.slice(0, 7).forEach(day => {
        forecastHTML += `
          <div class="forecast-day">
            <b>${new Date(day.dt * 1000).toDateString()}</b><br>
            🌡 ${day.temp.day} °C<br>
            ${day.weather[0].main}
          </div>
        `;
      });
      document.getElementById("forecast").innerHTML = forecastHTML;
    });
}

// ---------- DYNAMIC BACKGROUND ----------
function setBackground(condition, isDay) {
  const body = document.getElementById("body");

  if (condition === "Rain") {
    body.style.background = "linear-gradient(to bottom, #4b6cb7, #182848)";
  } else if (condition === "Clouds") {
    body.style.background = "linear-gradient(to bottom, #757f9a, #d7dde8)";
  } else if (condition === "Clear" && isDay) {
    body.style.background = "linear-gradient(to bottom, #56ccf2, #2f80ed)";
  } else {
    body.style.background = "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)";
  }
}
