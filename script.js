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
const hourlyForcast = document.getElementById("hourly-forecast");

const now = new Date();
// now.setHours(25);
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

  url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&timezone=Australia%2FSydney`;
  let y = await fetchResult(url);
  // console.log(y);
  let feelsLike = y.current.apparent_temperature;
  let currentTemp = y.current.temperature_2m;
  let relHumidity = y.current.relative_humidity_2m;
  let curWind = y.current.wind_speed_10m;
  let curPrecip = y.current.precipitation;
  let fileSrc = getWeatherFileName(y.current.weather_code);
  weatherIcon.src = fileSrc;
  feelLike.innerHTML = `${feelsLike}c`;
  weathertemp.innerHTML = `${currentTemp}&#176;`;
  humidity.innerHTML = `${relHumidity}%`;
  wind.innerHTML = `${curWind} km/h`;
  precip.innerHTML = `${curPrecip} mm`;
  displayDailyInfo(y.daily);
  displayHourlyInfo(y.hourly);
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
enterCity.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getGeoData();
  }
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
  let tempMax = dailyInfo.temperature_2m_max;
  let tempMin = dailyInfo.temperature_2m_min;
  let weatherCodes = dailyInfo.weather_code;

  // now.setDate(now.getDate() + 1);
  const options = { weekday: "short" };
  // console.log(now.toLocaleDateString('en-US', options));
  // for (let i = 0; i < 7; i++) {

  //   // Code to be executed seven times
  //   console.log("This will run for the " + (i + 1) + " time.");
  // }

  let html = "";
  const date = new Date(now);
  for (let i = 0; i < 7; i++) {
    const dayShort = date.toLocaleDateString("en-US", options);
    const weatherFile = getWeatherFileName(weatherCodes[i]);
    const altText = `Weather icon for ${dayShort}`;

    html += `
    <div class="weather__daily-forecast-item">
    <h3 class="weather__daily-forecast-day">${dayShort}</h3>
    <img src="${weatherFile}" alt="${altText}">
    <div class="weather__daily-forecast-temps">
    <div class="weather__daily-forecast-temp-max">${tempMax[i]}&#176;</div>
    <div class="weather__daily-forecast-temp-min">${tempMin[i]}&#176;</div>
    </div>
    </div>
    `;
    date.setDate(date.getDate() + 1);
  }
  dailyList.innerHTML = html;
}

function displayHourlyInfo(theHour) {
  //to do

  let timeOfDay = theHour.time;
  let tempForHour = theHour.temperature_2m;
  let currentHour = now.getHours();

  let html = "";
  hourlyForcast.html = "";
  let i = -1;
  do {
    i++;
    firstMatch = i;
  } while (!timeOfDay[i].includes(currentHour + ":00"));
  i++;
  console.log(i);
  let weatherCodes = theHour.weather_code;
  for (let z = 0; z <= 7; z++) {
    html += `
   <div class="weather__hourly-forecast-item">
            <div class="weather__hourly-forecast-time">
              <img src="${getWeatherFileName(
                weatherCodes[i]
              )}" alt="Icon for Hourly">
              <div>${hourDisplay(i)}</div>
            </div>
            <div>${tempForHour[i]}&#176;</div>
          </div>
  
  `;
    i++;
  }
  hourlyForcast.innerHTML = html;
  // console.log(matchingIndexes);
}

function hourDisplay(h) {
  if (h === 0) {
    return "12AM";
  } else if (h >= 1 && h <= 11) {
    return h + "AM";
  } else if (h === 12) {
    return "12PM";
  } else if (h >= 13 && h <= 23) {
    return h - 12 + "PM";
  } else if (h === 24) {
    return "12AM";
  } else if (h >= 25) {
    return h - 24 + "AM";
  } else {
    return "Invalid hour"; // Handle cases outside of 0-23
  }
}

function initAutocomplete() {
  // const input = document.getElementById("city-input");
  const autocomplete = new google.maps.places.Autocomplete(enterCity, {
    types: ["(cities)"], // Optional: restrict to cities
    fields: ["geometry", "name", "address_components"], // Optional: limit returned data
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      console.log("No details available for input: '" + place.name + "'");
      return;
    }

    let country = "";
    let state = "";

    if (place.address_components) {
      for (const component of place.address_components) {
        if (component.types.includes("country")) {
          country = component.long_name;
        }
        if (
          component.types.includes("administrative_area_level_1") ||
          component.types.includes("locality")
        ) {
          state = component.long_name;
        }
      }
    }

    // console.log("Latitude:", place.geometry.location.lat());
    // console.log("Longitude:", place.geometry.location.lng());
    // let city = place.name;
    // let lat = place.geometry.location.lat();
    // let lon = place.geometry.location.lng();
    // console.log(city, lat, lon);
    enterCity.value = place.name + ", " + state + " " + country;
    getGeoData();
  });
}

window.addEventListener("load", initAutocomplete);
