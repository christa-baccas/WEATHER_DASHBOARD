var searchBtn = document.getElementById("search");
var currentWeatherContainer = document.getElementById("currentWeather");
var historyContainer = document.getElementById("history");
var searchedCities = [];
var city = '';

function getApi(cityName) {
  var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=bbb2958c4a7e079d6061f61d0fb13c44`;
  fetch(requestUrl)
    .then(function (response) {
      if (response.status !== 200) {
        window.alert(response.status + ": Please enter a valid city");
      }
      return response.json();
    })
    .then(function (data) {
      //console.log(data.coord.lon);
      oneCallApi(data);
    });
}

function oneCallApi(data) {
  var lat = data.coord.lat;
  var lon = data.coord.lon;
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=bbb2958c4a7e079d6061f61d0fb13c44`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      renderCurrentWeather(data.current);
      renderForecast(data.daily);
    });
}

function renderCurrentWeather(currentWeather) {
  // console.log(currentWeather);
  var temp = document.querySelector(".card-temp");
  var humidity = document.querySelector(".card-humidity");
  var wind = document.querySelector(".card-wind");
  var uvi = document.querySelector(".card-uvi");
  var mainWeather = document.getElementById("mainWeather");
  mainWeather.setAttribute("style", "border: 2px solid black");
  temp.textContent = "Temp: " + currentWeather.temp + " \u00B0 F";
  humidity.textContent = "Humidity: " + currentWeather.humidity + " %";
  wind.textContent = "Wind: " + currentWeather.wind_speed + " MPH";
  uvi.textContent = "UV Index: " + currentWeather.uvi;

  // today's date
  var currentDate = moment().format("L");
  // console.log(currentDate);

  // sets the header of the current weather to the city being searched
  var cardTitle = document.querySelector(".card-title");
  cardTitle.textContent =
    city.charAt(0).toUpperCase() +
    city.slice(1) +
    " " +
    currentDate;

  // add the weather icon for current day
  var iconcode = currentWeather.weather[0].icon;
  var iconContainer = document.getElementById("icon");
  var icon = document.createElement("img");
  icon.setAttribute(
    "src",
    "http://openweathermap.org/img/w/" + iconcode + ".png"
  );
  iconContainer.append(icon);
}

function renderForecast(forecast) {
  var cardContainer = document.getElementById("card-group");
  cardContainer.innerHTML = "";

  for (let i = 1; i < 6; i++) {
    var iconCode = forecast[i].weather[0].icon;

    var card = document.createElement("div");
    card.setAttribute("class", "card text-white bg-dark m-2");

    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body p-2");

    var cardDate = document.createElement("h5");
    cardDate.setAttribute("class", "card-date p-2");

    var icon = document.createElement("img");
    icon.setAttribute(
      "src",
      "http://openweathermap.org/img/w/" + iconCode + ".png"
    );

    var cardTemp = document.createElement("p");
    cardTemp.setAttribute("class", "card-temp p-2");

    var cardWind = document.createElement("p");
    cardWind.setAttribute("class", "card-wind p-2");

    var cardHumidity = document.createElement("p");
    cardHumidity.setAttribute("class", "card-humidity p-2");

    cardContainer.append(card);
    card.append(cardBody);
    cardBody.append(cardDate);
    cardBody.append(icon);
    cardBody.append(cardTemp);
    cardBody.append(cardWind);
    cardBody.append(cardHumidity);

    var days = [];
    var daysRequired = 6;

    for (let i = 0; i <= daysRequired; i++) {
      days.push(moment().add(i, "days").format("L"));
    }
    // console.log(days);
    cardDate.textContent = days[i];
    cardTemp.textContent = "Temp: " + forecast[i].temp.day + " \u00B0 F";
    cardWind.textContent = "Wind: " + forecast[i].wind_speed + " MPH";
    cardHumidity.textContent = "Humidity: " + forecast[i].humidity + " %";
  }
}


// this appends the searched cities to the page
searchBtn.addEventListener("click", function () {
  city = document.getElementById("input").value;
  searchedCities.push(enteredTxt);
  var itemBtn = document.createElement("button");
  var enteredTxt = document.getElementById("input").value;
  itemBtn.setAttribute("class", "btn btn-secondary btn-lg col mb-2 prev-search");
  // itemBtn.setAttribute("id", "itemBtn");
  itemBtn.setAttribute("type", "button");
  itemBtn.textContent = enteredTxt.charAt(0).toUpperCase() + enteredTxt.slice(1);
  historyContainer.append(itemBtn);
  localStorage.setItem("Cities Searched", JSON.stringify(searchedCities));
  
  getApi(city);
});

$('#history').on('click','.prev-search', function(){
  city = $(this).text();
  // console.log($(this).text());
  // var enteredTxt = document.getElementById("input").value;
  getApi(city);
});