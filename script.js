const enterCity = document.getElementById("city-input");
const searchCity = document.getElementById("search-button");
// const locCity = document.getElementById("LocateCity");
const weathertemp = document.getElementById("weather-temp");
const weatherloc = document.getElementById("weather-location");
const weatherDate = document.getElementById("weather-date");
const units = document.getElementById("units");
const dropdownContent = document.getElementById("dropdown-content");
const feelLike = document.getElementById("feels-like");
const switchImperial = document.getElementById("switchImperial");
const switchMetric = document.getElementById("switchMetric");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const precip = document.getElementById("precipitation");
const weatherIconContainer = document.getElementById("weather-icon");
const weatherIcon = weatherIconContainer.querySelector("img");

const now = new Date();
const options = {
  weekday: "long",
  year: "numeric",
  month: "short",
  day: "numeric",
};
const formatedDate = now.toLocaleDateString("en-US", options);
const dailyList = document.getElementById("daily-forecast-list");
let unitState = "metric";

checkUnitState();

async function getGeoData() {
  let url = `https://nominatim.openstreetmap.org/search?q=${enterCity.value}&format=jsonv2&limit=1&addressdetails=1`;
  let x = await fetchResult(url);
  let lon = x[0].lon;
  let lat = x[0].lat;
  let city = x[0].name;
  let state = x[0].address.state;
  let country = x[0].address.country;
  weatherloc.innerHTML = `${city}, ${state} ,<br> ${country}`;
  weatherDate.innerHTML = formatedDate;

  url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,showers&current=temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&timezone=Australia%2FSydney`;
  let y = await fetchResult(url);
  let feelsLike = y.current.apparent_temperature;
  let currentTemp = y.current.temperature_2m;
  let relHumidity = y.current.relative_humidity_2m;
  let curWind = y.current.wind_speed_10m;
  let curPrecip = y.current.precipitation;
  weatherIcon.src = getWeatherFileName(y.current.weather_code);
  feelLike.innerHTML = `${feelsLike}c`;
  weathertemp.innerHTML = `${currentTemp}&#176;`;
  humidity.innerHTML = `${relHumidity}%`;
  wind.innerHTML = `${curWind} km/h`;
  precip.innerHTML = `${curPrecip} mm`;
  displayDailyInfo(y.daily);
}

async function fetchResult(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    // console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

// listen for click on search button
searchCity.addEventListener("click", (e) => {
  //get the location data
  getGeoData();
});

units.addEventListener("click", () => {
  if (dropdownContent.classList.contains("hidden")) {
    dropdownContent.classList.remove("hidden");
  } else {
    dropdownContent.classList.add("hidden");
  }
});

function checkUnitState() {
  if (unitState == "metric") {
    switchMetric.classList.add("hidden");
    switchImperial.classList.remove("hidden");
  } else {
    switchMetric.classList.remove("hidden");
    switchImperial.classList.add("hidden");
  }
}

function getWeatherFileName(code) {
  let x = "";
  switch (code) {
    case 0:
      x = "sunny";
      break;
    case 1:
    case 2:
      x = "partly-cloudy";
      break;
    case 3:
      x = "overcast";
      break;
    case 45:
    case 48:
      x = "fog";
      break;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      x = "drizzle";
      break;
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 82:
      x = "rain";
      break;
  }
  return `assets/images/icon-${x}.webp`;
}

function displayDailyInfo(dailyInfo) {
  console.log(dailyInfo);
  let tempMax = dailyInfo.temperature_2m_max;
  let tempMin = dailyInfo.temperature_2m_min;
  let weatherCodes = dailyInfo.weather_code;

  let dayShort = "";
  let weatherFileCode = null;
  // console.log(tempMin);
  // now.setDate(now.getDate() + 1);
  const options = { weekday: "short" };
  // console.log(now.toLocaleDateString('en-US', options));
  // for (let i = 0; i < 7; i++) {

  //   // Code to be executed seven times
  //   console.log("This will run for the " + (i + 1) + " time.");
  // }
  dailyList.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    dayShort = now.toLocaleDateString("en-US", options);
    weatherFile = getWeatherFileName(weatherCodes[i]);
    console.log(weatherFile);
    dailyList.innerHTML += `
    <div class="weather__daily-forecast-item">
    <h3 class="weather__daily-forecast-day">${dayShort}</h3>
    <img src="${weatherFile}" alt="overcast icon">
    <div class="weather__daily-forecast-temps">
    <div class="weather__daily-forecast-temp-max">${tempMax[i]}&#176;</div>
    <div class="weather__daily-forecast-temp-min">${tempMin[i]}&#176;</div>
    </div>
    </div>
    `;
    now.setDate(now.getDate() + 1);
  }
}
