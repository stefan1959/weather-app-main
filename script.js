const enterCity = document.getElementById("city-input");
const searchCity = document.getElementById("search-button");
// const locCity = document.getElementById("LocateCity");
const temp = document.getElementById("temp");
const weathertemp = document.getElementById("weather-temp");
const weatherloc = document.getElementById("weather-location");
const weatherDate = document.getElementById("weather-date");
const units = document.getElementById("units");
const dropdownContent = document.getElementById("dropdown-content");
const feelLike = document.getElementById("feels-like");
const switchImperial = document.getElementById("switchImperial");
const switchMetric = document.getElementById("switchMetric");
const now = new Date();
const options = {
  weekday: "long",
  year: "numeric",
  month: "short",
  day: "numeric",
};
const formatedDate = now.toLocaleDateString("en-US", options);
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

  url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,showers&current=temperature_2m,precipitation,apparent_temperature,weather_code&timezone=Australia%2FSydney`;
  let y = await fetchResult(url);
  let feelsLike = y.current.apparent_temperature;
  let currentTemp = y.current.temperature_2m;
  feelLike.innerHTML = `Feels Like ${feelsLike}c`;
  temp.innerHTML = `Current Temp is ${currentTemp}c`;
  weathertemp.innerHTML = `${currentTemp}&#176;`;
  console.log(feelsLike);
}

async function fetchResult(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

// listen for click on search button
searchCity.addEventListener("click", (e) => {
  console.log("click");
  //get the location data
  getGeoData();
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
