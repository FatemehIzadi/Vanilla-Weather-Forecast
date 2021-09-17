const axios = require("axios").default;
let apiKey = "be05ea037563d58b0fbb13748c22aed0";
let city = "New York";
let country = "US";
let weatherDescription = "Clear";
let weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = weekdays[date.getDay()];
  return day.substring(0, 3);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures-${index}">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

var unitTemp = {
  unit: "c",
  temp: 0
};

function getDateTime(response) {
  let unixTimeStamp = response.data.dt;
  let date = new Date(unixTimeStamp * 1000);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let formattedTime = `${hours}:${minutes.substr(-2)}`;
  let weekDay = weekdays[date.getDay()];
  let time = document.querySelector("#time");
  time.innerHTML = formattedTime;
  let day = document.querySelector("#day");
  day.innerHTML = weekDay;
  getForecast(response.data.coord);
}

function getCity(response) {
  let cityName = document.querySelector("#city-name");
  if (city.toLowerCase !== "new york") country = response.data.sys.country;
  cityName.innerHTML = `${city.toUpperCase()}, ${country.toUpperCase()}`;
}

function getIconDescription(response) {
  let weatherIcon = document.querySelector("#weather-icon");
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);
  weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = `${response.data.weather[0].description.toUpperCase()}`;
}

function getTemp(response) {
  let cityTemp = document.querySelector("#city-temp");
  unitTemp.temp = Math.round(response.data.main.temp);
  metricButton.style.fontWeight = "bold";
  metricButton.style.fontSize = "12px";
  cityTemp.innerHTML = Math.round(response.data.main.temp);
}

function getHumidityWindSpeed(response) {
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = `Wind Speed: ${response.data.wind.speed}mpH`;
}
function weatherData(response) {
  getCity(response);
  getDateTime(response);
  getIconDescription(response);
  getTemp(response);
  getHumidityWindSpeed(response);
}

function sayWeather() {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(url).then(weatherData);
}

sayWeather();
function sayCityWeather(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-inp");
  city = searchInput.value;
  sayWeather();
}
let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", sayCityWeather);

function getLocationTemp(response) {
  city = response.data.name;
  sayWeather();
}
function currentWeather(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(getLocationTemp);
}

function sayCurrentWeather(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentWeather);
}
let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", sayCurrentWeather);

let temp = document.querySelector("#city-temp");
function changeToImperial(event) {
  event.preventDefault();
  if (unitTemp.unit === "c") {
    unitTemp.temp = Math.round((unitTemp.temp * 9) / 5) + 32;
    temp.innerHTML = unitTemp.temp;
    imperialButton.style.fontWeight = "bold";
    imperialButton.style.fontSize = "12px";
    metricButton.style.fontWeight = "normal";
    metricButton.style.fontSize = "10px";
    unitTemp.unit = "f";
  }
}
let imperialButton = document.querySelector("#imperial");
imperialButton.addEventListener("click", changeToImperial);
function changeToMetric(event) {
  event.preventDefault();
  if (unitTemp.unit === "f") {
    unitTemp.temp = Math.round(((unitTemp.temp - 32) * 5) / 9);
    temp.innerHTML = unitTemp.temp;
    metricButton.style.fontWeight = "bold";
    metricButton.style.fontSize = "12px";
    imperialButton.style.fontWeight = "normal";
    imperialButton.style.fontSize = "10px";
    unitTemp.unit = "c";
  }
}
let metricButton = document.querySelector("#metric");
metricButton.addEventListener("click", changeToMetric);
