//Variables
var apiKey = "a79fa98eff8edf873c9ecd987e977871";
var cityName = document.getElementById("search-input");
var searchBtn = document.getElementById("search-btn");
var searchedLocation = document.getElementById("searched-location");
var resultCity = document.getElementById("city-name");
var currentDay = document.getElementById("current-day");
var weatherIcon = document.getElementById("weather-icon");
var currentTemp = document.getElementById("temp");
var currentWind = document.getElementById("wind");
var currentHum = document.getElementById("hum");
var forecast = document.getElementById("forecast");

//current day
var currentDay = moment().format("MMM Do YYYY");  

window.onload = function() {
    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
    for (var i = 0; i < storedCities.length; i++) {
      var recentSearches = document.createElement("button");
      recentSearches.setAttribute("id", "searched-button");
      recentSearches.innerHTML = storedCities[i].charAt(0).toUpperCase() + storedCities[i].slice(1);
      searchedLocation.appendChild(recentSearches);
    }
  };

//Fetch coords from 1st API and pass them to weather API to retrieve data
searchBtn.addEventListener('click', function() {
    var city = cityName.value;
    console.log(city);
    if (city !== "") {var recentSearches = document.createElement("button");
    recentSearches.setAttribute("id", "searched-button");
    recentSearches.innerHTML = city.charAt(0).toUpperCase() + city.slice(1);
    searchedLocation.appendChild(recentSearches)};
    var storedCities = localStorage.getItem("cities");
        if (storedCities) {
            storedCities = JSON.parse(storedCities);
        } else {
            storedCities = [];
        }
        if (!storedCities.includes(city)) {
            storedCities.push(city);
            localStorage.setItem("cities", JSON.stringify(storedCities));
        }
    //Api call
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey)
        .then(function(response) {
            response.json().then(function(data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            console.log(lat);            
            console.log(lon);  
            
            return fetch("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey)
            })
                .then(function(response) {
                    response.json().then(function(data) {
                    weatherData(data);
                    fiveDayForecast(data);
                    console.log(data);
                })
            }) 
        })
    event.preventDefault();
    });

function weatherData(data) {
    weatherIcon.innerHTML = '';
    var cityNameResult = data.city.name + " " + "(" +currentDay+ ")";
    var tempResult = data.list[3].main.temp;
    var windResult = data.list[3].wind.speed;
    var humResult = data.list[3].main.humidity;
    var weatherSymbol = data.list[3].weather[0].icon;

    var currentIcon = document.createElement("img");
    currentIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherSymbol + "@2x.png");
    weatherIcon.append(currentIcon);
    

    resultCity.innerHTML = cityNameResult;
    currentTemp.innerHTML = (tempResult-270).toFixed(2) + "°C";
    currentWind.innerHTML = windResult + "km/h";
    currentHum.innerHTML = humResult + "%";
 
}

function fiveDayForecast(data) {
    console.log(data);
    var count = 0;
    var upcomingForecast = document.getElementById("forecast");

    while (upcomingForecast.firstChild) {
        upcomingForecast.removeChild(upcomingForecast.firstChild);
    }

    for (var i = 8; i < data.list.length; i += 8) {
        var middayForecast = data.list[i];
        var temp = data.list[i].main.temp;
        var wind = data.list[i].wind.speed;
        var hum = data.list[i].main.humidity;
        var icon = data.list[i].weather[0].icon;
        console.log(middayForecast);
        count++;
        if (count === 5) break;

        //Date
        var date = moment().add(count, 'days').format("MMM Do");
        console.log(date);
        var forecastWeather = document.createElement("div");
        forecastWeather.classList.add("forecast-box");
        upcomingForecast.append(forecastWeather);
        var forecastDate = document.createElement("h2");
        forecastDate.setAttribute("id", "forecast-date");
        forecastWeather.append(forecastDate);
        forecastDate.innerHTML = date;

        //icon
        var forecastIcon = document.createElement("img");
        forecastIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
        forecastWeather.append(forecastIcon);

        //Temp
        var forecastTemp = document.createElement("p");
        forecastWeather.append(forecastTemp);
        forecastTemp.innerHTML = "Temp: " + (temp-270).toFixed(2) + "°C";

        //Wind
        var forecastWind = document.createElement("p");
        forecastWeather.append(forecastWind);
        forecastWind.innerHTML = "Wind: " + wind + "km/h";

        //Humidity
        var forecastHum = document.createElement("p");
        forecastWeather.append(forecastHum);
        forecastHum.innerHTML = "Humidity: " + hum + "%";

    }
}















        
        







  
        
