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
    //storing the searched cities in a string
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
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;


    // Created an AJAX call
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {

      //test
      console.log(response.main.humidity)
      console.log(response.main.temp)
     
      //assigning temperature to var
      var tempF = response.main.temp;
      console.log(tempF)

      // Retrieving the URL for the image
      var imgCode = response.weather[0].icon;
      var imgURL = "https://openweathermap.org/img/w/" + imgCode + ".png";

     
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
      var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + '&lat=' + response.coord.lat + '&lon=' + response.coord.lon
    

        $.get(uvURL).then(function (res) {
          var newSpan = $("<span>").text(res.value)
        //assigning attributes to UV Index based on conditions
        $(".uvIndex").text("UV Index: ")
        if (res.value > 7){
          
          newSpan.addClass("red");
          
        } else if (res.value<8 && res.value >5){
          
          newSpan.addClass("orange");
          
        } else if(res.value>4 && res.value<6) {
          newSpan.addClass("yellow")
        } else {
          newSpan.addClass("green")
        }
        $(".uvIndex").append(newSpan)
      })

        
     
      console.log(response)
      
      makeFiveDay(city)
    });
  }

  function makeFiveDay(theCity) {
    console.log('<=====five======>')

    //AJAX call for 5 day forecast
    var fivedayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + theCity + "&units=imperial&appid=" + APIKey;
    $.get(fivedayURL).then(function (response) {
      console.log(response)
      $(".fiveDay").empty()
      for (i = 0; i < response.list.length; i++) {
        var curr = response.list[i]
        if (curr.dt_txt.includes("12:00")) {
          var newDiv = $("<div class='card bg-primary text-light col-md-2' style='text-align: center'>")
          newDiv.append(moment.unix(curr.dt).format("L")+ '<img src="' +'https://openweathermap.org/img/w/' + response.list[i].weather[0].icon + '.png" width="50px" alt="weather icon">' + '</div>'+"<div> Temp: "+response.list[i].main.temp +"</div>"+"<div> Humidity: "+response.list[i].main.humidity+"%</div>")
          $(".fiveDay").append(newDiv)
          console.log(response.list[i].weather[0].icon)
          
        }
      }

    })
  }
  $("#cities").on('click', '.aCity',function () {
    citySearch( $(this).text())
  })


  
});