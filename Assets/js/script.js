//This is my API key
var APIKey = "9e9880462ec11527ce99f1b84aebc544";
//Get items for local storage and set inside of variable named cities
var cities = JSON.parse(localStorage.getItem("weather")) || []


$(document).ready(function () {
  writeCities()
  if (cities.length) {
    citySearch(cities[cities.length-1])
  }
  

  

  $("#find-city").on("click", function (event) {

    // event.preventDefault() can be used to prevent an event's default behavior.
    // Here, it prevents the submit button from trying to submit a form when clicked
    event.preventDefault();

    // grab the text from the input box
    var city = $("#city-input").val();
    cities.push(city)
    localStorage.setItem("weather", JSON.stringify(cities))
    writeCities()
    citySearch(city)

    
  });
  function writeCities() {
    $("#cities").empty();
    for (a = 0; a < cities.length; a++) {
      var newDiv = $("<div class='card aCity'>").text(cities[a])
      $("#cities").prepend(newDiv)
    }
  }

  function citySearch(city) {

//API query URL with temp conversion
    var queryURL = "https:api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;


    // Created an AJAX call
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {

      //test
      console.log(response.main.humidity)
      console.log(response.main.temp)

      var tempF = response.main.temp;
      console.log(tempF)

      // Retrieving the URL for the image
      var imgCode = response.weather[0].icon;
      var imgURL = "http://openweathermap.org/img/w/" + imgCode + ".png";

     
      // Creating an element to hold the image
      var image = $("<img>").attr("src", imgURL);

      //transfer content to HTML
      $(".temp").text("Temperature(F): " + tempF.toFixed(2));
      $(".humidity").text("Humidity: " + response.main.humidity + "%");
      $(".wind").text("Wind Speed: " + response.wind.speed + " MPH");
      var name = $('<div>').text(response.name + " (" + moment.unix(response.dt).format('L') + ")");
      name.append(image)
      $(".name").empty()
      $(".name").append(name)
      var uvURL = 'http://api.openweathermap.org/data/2.5/uvi?appid=' + APIKey + '&lat=' + response.coord.lat + '&lon=' + response.coord.lon
      $.get(uvURL).then(function (res) {
        $(".uvIndex").text("UV Index: " + res.value)

      })
     
      console.log(response)
      
      makeFiveDay(city)
    });
  }

  function makeFiveDay(theCity) {
    console.log('<=====five======>')

    //AJAX call
    var fivedayURL = "https:api.openweathermap.org/data/2.5/forecast?q=" + theCity + "&units=imperial&appid=" + APIKey;
    $.get(fivedayURL).then(function (response) {
      console.log(response)
      $(".fiveDay").empty()
      for (i = 0; i < response.list.length; i++) {
        var curr = response.list[i]
        if (curr.dt_txt.includes("12:00")) {
          var newDiv = $("<div class='card bg-primary text-light col-md-3'>")
          newDiv.append(moment.unix(curr.dt).format("L")+"<div> Temp: "+response.list[i].main.temp +"</div>"+"<div> Humidity: "+response.list[i].main.humidity+"%</div>")
          
          $(".fiveDay").append(newDiv)
          console.log(response.list[i].weather[0].icon)
          //console.log(response.weather[0].icon)
        }
      }

    })
  }
  $("#cities").on('click', '.aCity',function () {
    citySearch( $(this).text())
  })


  //   let unix_timestamp = 1549312452
  // // Create a new JavaScript Date object based on the timestamp
  // // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  // var date = new Date(unix_timestamp * 1000);
  // // Hours part from the timestamp
  // var hours = date.getHours();
  // // Minutes part from the timestamp
  // var minutes = "0" + date.getMinutes();
  // // Seconds part from the timestamp
  // var seconds = "0" + date.getSeconds();

  // // Will display time in 10:30:23 format
  // var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  // console.log(formattedTime);
  //   console.log(queryURL)
  //   console.log(response)
  //   console.log(response.list[i].main.humidity)
  //   console.log(response.list[i].wind.speed)

  //renderSearch()

  // });

  // // Function for displaying movie data
  // function renderSearch() {

  // // Deleting the movie buttons prior to adding new movie buttons
  // // (this is necessary otherwise we will have repeat buttons)
  // $("#city-status").empty();

  // // Looping through the array of movies
  // for (var i = 0; i < cities.length; i++) {

  // // Then dynamicaly generating buttons for each movie in the array.
  // // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
  // var list = $("<p>");
  // // Adding a class
  // list.addClass("cities");
  // // Adding a data-attribute with a value of the movie at index i
  // list.attr("data-name", cities[i]);
  // // Providing the button's text with a value of the movie at index i
  // list.text(cities[i]);
  // // Adding the button to the HTML
  // $("#city-status").append(list);
  // }
  // }

  // // This function handles events where one button is clicked
  // $("#city-status").on("click", function(event) {
  //   // event.preventDefault() prevents the form from trying to submit itself.
  //   // We're using a form so that the user can hit enter instead of clicking the button if they want
  //   event.preventDefault();

  //   // This line will grab the text from the input box
  //   var city = $("#city-input").val().trim();
  //   // The movie from the textbox is then added to our array
  //   cities.push(city);
  // $("city-status").append(cities)
  //   // calling renderButtons which handles the processing of our movie array
  //   renderSearch();
  // });
  // renderSearch()

  // });
});