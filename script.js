const enterCity = document.getElementById("city-input");
const searchCity = document.getElementById("search-button");
// const locCity = document.getElementById("LocateCity");
const temp = document.getElementById("temp");
const weathertemp = document.getElementById("weather-temp");
const weatherloc = document.getElementById("weather-location");
const units = document.getElementById("units");
const dropdownContent = document.getElementById("dropdown-content");
const feelLike = document.getElementById("feels-like");
const switchImperial = document.getElementById("switchImperial");
const switchMetric = document.getElementById("switchMetric");
let unitState = "metric";

checkUnitState();

async function getGeoData() {
  const url = `https://nominatim.openstreetmap.org/search?q=${enterCity.value}&format=jsonv2&limit=1&addressdetails=1`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    weatherloc.innerHTML = `${result[0].name}, ${result[0].address.state} <br>${result[0].address.country}`;
    // locCity.innerHTML = `Location is Logtitude ${result[0].lon} and Latitude ${result[0].lat}`;
    getWeatherData(result[0].lat, result[0].lon);
  } catch (error) {
    console.error(error.message);
  }
}

async function getWeatherData(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,showers&current=temperature_2m,precipitation,apparent_temperature,weather_code&timezone=Australia%2FSydney`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    feelLike.innerHTML = `Feels Like ${result.current.apparent_temperature} Celcius`;
    temp.innerHTML = `Current Temp is ${result.current.temperature_2m} Celcius`;
    weathertemp.innerHTML = `${result.current.temperature_2m}c`;
  } catch (error) {
    console.error(error.message);
  }
}

searchCity.addEventListener("click", (e) => {
  console.log("click");
  getGeoData();
  console.log(enterCity.value);
});

units.addEventListener("click", () => {
  console.log("click");
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
    console.log(dropdownContent);
  } else {
    switchMetric.classList.remove("hidden");
    switchImperial.classList.add("hidden");
  }
}
