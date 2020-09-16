$(document).ready(function () {
  console.log("We are ready");
  // variables to target points in the main html page
  var form = $("#cities");
  var inputCity = $("#enter-city");
  var savedCities = $("#saved-city-list");
  var mainDisplay = $("#main-display");
  var forecast = $("#five-day-forecast");
  var sessionStorage;

  //   function getWeatherData() {
  //     getLatAndLong();
  //     console.log(latitude);
  //     console.log(longitude);
  //     $.ajax({
  //       url:
  //         "https://api.openweathermap.org/data/2.5/onecall?lat=" +
  //         latitude +
  //         "&lon=" +
  //         longitude +
  //         "&units=imperial&appid=" +
  //         apiKey,
  //       method: "GET",
  //     }).then(function (response) {
  //       console.log(response);
  //     });
  //   }

  form.on("submit", function (event) {
    event.preventDefault();
    var city = $("#city-input").val().trim().toLowerCase() || savedCities.text();
    console.log(city);

    var apiKey = "aaed2ca118ea9337d0324934e67d1796";
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      apiKey +
      "&units=imperial";
//============ Getting Lat and Lon values, Posting Today main temp values===
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      var latitude = response.coord.lat;
      var longitude = response.coord.lon;
      var weatherImg = $("<img>");
      weatherImg.attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon  + "@2x.png");
      weatherImg.attr("alt", "Weather Image indicator");
      $("#city-display").text(response.name + moment().format('[ (]L[)]'));
      $("#main-temp").text("Temperature: " + response.main.temp + " °F");
      $("#main-hum").text("Humidity: " + response.main.humidity + "%");
      $("#wind.speed").text("Wind Speed: " + response.wind.speed + "MPH");
      $("#city-display").append(weatherImg);
//=======================================================================

//========== Getting Weather Data and placing it in the DOM =============
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
        console.log(city);
        console.log(weatherData);
        var fiveDayForecast = weatherData.daily.slice(0, 5).map((days) => {
          console.log(days);
          return days;
        })
        $("#uv-index").text(weatherData.current.uvi);
        for (i = 0; i < fiveDayForecast.length; i++) {
          var card = $("<div>");
          var date = $("<h5>");
          var img = $("<img>");
          var temp = $("<p>");
          var hum = $("<p>");
          var trueDate = moment().add(i+1, "days").format("MM/DD/YY");

          card.addClass("card col-lg-2 bg-primary text-white mr-4 my-2");
          date.text(trueDate);
          img.attr("src", "http://openweathermap.org/img/wn/" + fiveDayForecast[i].weather[0].icon  + "@2x.png");
          img.attr("alt", "Image of Weather");
          temp.text("Temp: " + fiveDayForecast[i].temp.day + " °F");
          hum.text("Humidity: " + fiveDayForecast[i].humidity + "%")

          forecast.append(card);
          card.append(date, img, temp, hum);
        }
      });
    });
  });

  // on submit to pulled data from the api
  // generate tags, populate it with data, append those tags

  // save city searches in localStorage and add them to sessionStorage
  // use sessionStorage to populate saved city list
  // use the last city in localStorage to populate webpage on refresh
});
