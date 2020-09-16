$(document).ready(function () {
  console.log("We are ready");
  // variables to target points in the main html page
  var form = $("#cities");
  var inputCity = $("#enter-city");
  var savedCities = $("#saved-city-list");
  var mainDisplay = $("#main-display");
  var forecast = $("#five-day-forecast");
  var sessionStorage;
  var city;

  //======================= Functions to be Used ==================================
  const uppercaseWords = (str) =>
    str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());

  function init() {
    var currentLocalStorage = localStorage.getItem("cities");

    if (currentLocalStorage !== null) {
      sessionStorage = JSON.parse(currentLocalStorage);
      city = JSON.parse(currentLocalStorage).slice(-1).pop();
      displayWeatherData();
      previousSearches();
    } else {
      sessionStorage = [];
    }
  }

  function previousSearches() {
    savedCities.empty();
    sessionStorage.forEach((city) => {
      var cityBtn = $("<button>");

      cityBtn.attr("type", "submit");
      cityBtn.attr("value", city);
      cityBtn.addClass("list-group-item list-group-item-action");
      cityBtn.text(city);

      savedCities.prepend(cityBtn);
    });
  }

  function displayWeatherData() {
    var apiKey = "aaed2ca118ea9337d0324934e67d1796";
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      apiKey +
      "&units=imperial";
    //============ Getting Lat and Lon values, Posting Today main temp values===========
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      var latitude = response.coord.lat;
      var longitude = response.coord.lon;
      var weatherImg = $("<img>");

      weatherImg.attr(
        "src",
        "http://openweathermap.org/img/wn/" +
          response.weather[0].icon +
          "@2x.png"
      );
      weatherImg.attr("alt", "Weather Image indicator");
      $("#city-display").text(response.name + moment().format("[ (]L[)]"));
      $("#main-temp").text(
        "Temperature: " + Math.floor(response.main.temp) + " °F"
      );
      $("#main-hum").text("Humidity: " + response.main.humidity + "%");
      $("#wind.speed").text("Wind Speed: " + response.wind.speed + "MPH");
      $("#city-display").append(weatherImg);
      //============================ End of getting Lat and Lon ====================================

      //========== Getting Weather Data and placing it in the DOM ========================
      $.ajax({
        url:
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          latitude +
          "&lon=" +
          longitude +
          "&appid=" +
          apiKey +
          "&units=imperial",
        method: "GET",
      }).then(function (weatherData) {
        console.log(weatherData);
        var fiveDayForecast = weatherData.daily.slice(0, 5).map((days) => {
          return days;
        });
        $("#uv-index").text(weatherData.current.uvi);
        if (weatherData.current.uvi <= 2) {
          $("#uv-index").addClass("lowUv");
        } else if (weatherData.current.uvi <= 5) {
          $("#uv-index").addClass("moderateUv");
        } else if (weatherData.current.uvi <= 7) {
          $("#uv-index").addClass("highUv");
        } else if (weatherData.current.uvi <= 10) {
          $("#uv-index").addClass("veryHighUv");
        } else {
          $("#uv-index").addClass("extremeUv");
        }
        //=========================== Start of For Loop ====================================
        // Displays 5 day forecast
        forecast.empty();
        for (i = 0; i < fiveDayForecast.length; i++) {
          var card = $("<div>");
          var date = $("<h5>");
          var img = $("<img>");
          var temp = $("<p>");
          var hum = $("<p>");
          var trueDate = moment()
            .add(i + 1, "days")
            .format("MM/DD/YY");

          card.addClass("card col-lg-2 bg-primary text-white mr-4 my-2");
          date.text(trueDate);
          img.attr(
            "src",
            "http://openweathermap.org/img/wn/" +
              fiveDayForecast[i].weather[0].icon +
              "@2x.png"
          );
          img.attr("alt", "Image of Weather");
          temp.text("Temp: " + fiveDayForecast[i].temp.day + " °F");
          hum.text("Humidity: " + fiveDayForecast[i].humidity + "%");

          forecast.append(card);
          card.append(date, img, temp, hum);
        }
        //===================== End of For Loop ============================================
        if (sessionStorage.includes(city) == false) {
          sessionStorage.push(city);
          localStorage.setItem("cities", JSON.stringify(sessionStorage));
          previousSearches();
        }
      });
    });
  }

  //===================== Checking Local Storage for data ========================
  init();

  //============================ Form Submission ===================================

  $("button").on("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    city =
      uppercaseWords($("#city-input").val().trim().toLowerCase()) ||
      $(this).val();

    displayWeatherData();
  });
});
