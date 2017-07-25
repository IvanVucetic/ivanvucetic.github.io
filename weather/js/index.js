var temp_f;
var temp_c;
var icon;
var aaa = {};

function weatherFeel(weatherIcon){
  var tColor;
  var bColor;
  var iconType;
  
  switch(weatherIcon) {
    case "clear-day":
      tColor = "#fff";
      bColor = "#6ac6f9";
      iconType = weatherIcon.toUpperCase().replace("-", "_");
      break;
    case "clear-night":
      tColor = "#fff";
      bColor = "#3769ae";
      iconType = weatherIcon.toUpperCase().replace("-", "_");
      break;
    case "rain":
      tColor = "#fff";
      bColor = "#3e3d35";
      iconType = weatherIcon.toUpperCase().replace("-", "_");
      break;
    case "snow":
      tColor = "#10100e";
      bColor = "#fff";
      iconType = weatherIcon.toUpperCase().replace("-", "_");
      break;
    case "sleet":
      tColor = "#fff";
      bColor = "#6e90a9";
      iconType = weatherIcon.toUpperCase().replace("-", "_");
      break;
    case "wind":
      tColor = "#636154";
      bColor = "#ffecd0";
      iconType = weatherIcon.toUpperCase().replace("-", "_");
      break;
    case "fog":
      tColor = "#c9d7d8";
      bColor = "#7c9194";
      iconType = weatherIcon.toUpperCase().replace("-", "_");
      break;
    case "cloudy":
      tColor = "#7c9194";
      bColor = "#c9d7d8";
      iconType = weatherIcon.toUpperCase().replace("-", "_");
      break;
    case "partly-cloudy-day":
      tColor = "#8fa1a3";
      bColor = "#dde6e6";
      iconType = weatherIcon.toUpperCase().replace("-", "_").replace("-", "_");
      break;
    case "partly-cloudy-night":
      tColor = "#f6f7f7";
      bColor = "#364042";
      iconType = weatherIcon.toUpperCase().replace("-", "_").replace("-", "_");
      break;
  };
  
  $("body").css("background-color", bColor);
  $("#temperature").css("color", tColor);
  $("a").css("color", tColor);
  var skycons = new Skycons({"color": tColor});
  skycons.add(document.getElementById("icon"), Skycons[iconType]);
  skycons.play();
};

$(document).on('click', '#toggle-units', function() {
  if ($(this).data("type") == "c") {
    $(this).data("type", "f");
    $(this).html("Show Metric");
    $("#temperature").html(temp_f + " F")
  } else {
    $(this).data("type", "c");
    $(this).html("Show Imperial");
    $("#temperature").html(temp_c + " C")
  }
});

function getLocation () {
  var lat;
  var lon;
  function success(position) {
    // this is a callback f-on; anything that uses lat, lon needs to come in here; e.g ajax call
    // https://stackoverflow.com/questions/18891954/assigning-latitude-and-longitude-as-variables-for-global-use
    // https://stackoverflow.com/questions/18883252/grabbing-longitude-and-latitude-value-from-a-function
    lat = position.coords.latitude.toFixed(2);
    lon = position.coords.longitude.toFixed(2);
    // Adding https://cors-anywhere.herokuapp.com/ in front of URL to avoid CORS issues
    var apiUrl = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/138c1b5d86e3f315748b93b0bd542410/" + lat + "," + lon;
    $("#a").html(apiUrl);
    
    var myLatLon = new google.maps.LatLng(lat,lon);
    var mapOptions = {
        zoom: 14,
        center: myLatLon,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var marker = new google.maps.Marker({
          position: myLatLon,
          map: map
          // icon: 'url of the icon'
        });
      
    $.ajax({
      url: apiUrl,
      method: "GET",
      success: function(jsonData) {
        temp_f = (jsonData.currently.temperature).toFixed(2);
        temp_c = ((temp_f - 32) * 5 / 9).toFixed(2);
        icon = jsonData.currently.icon;
        $("#temperature").html(temp_c + " C");
        
        weatherFeel(icon);
      }
    });
  };
  
  function error(err){
    console.warn(`ERROR(${err.code}): ${err.message}`);
    alert("Sorry! We need to know your location in order to tell you the weather! :(")
  };

  navigator.geolocation.getCurrentPosition(success, error);
};

   
$(document).ready(function(){
  getLocation();
});