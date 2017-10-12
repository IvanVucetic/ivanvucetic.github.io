// SEARCH FUNCTIONALITY FOR CARS
$(".searchField-input").keyup(function () {
    var input = $(this);
    getJSON(input.val().trim());
});

// DRAW RACERS
$(document).on("click", '.car-wrapper', function (event) {

    var carid = $(this).data("id");
    //BRISANJE
    if (alreadyAdded(carid, nizZaTrku)) {
        brisanjeStaze(carid);
        nizZaTrku = brisiAuto(nizZaTrku, carid);
        // must make new call to update speed limits
        $.ajax({
            url: "data.json",
            dataType: "json",
            method: "GET",
            success: function (jsonData) {
                crtanjeOgranicenja(jsonData.speed_limits, jsonData.distance);
                crtanjeSemafora(jsonData.traffic_lights, jsonData.distance);
            }
        });
        //CRTANJE
    } else {
        var tempCar = {};
        tempCar["id"] = carid;
        // promeniti izgled elementa (prevrnuti ga)
        $.ajax({
            url: "data.json",
            dataType: "json",
            method: "GET",
            success: function (jsonData) {
                tempCar["speed"] = jsonData.cars[tempCar["id"] - 1]["speed"];
                tempCar["image"] = jsonData.cars[tempCar["id"] - 1]["image"];
                crtanjeStaze(tempCar["id"], jsonData.distance, tempCar["image"]);
                crtanjeOgranicenja(jsonData.speed_limits, jsonData.distance);
                $(".raceTracks :not(:first-child) .singleTrack .distance .label").remove();
                crtanjeSemafora(jsonData.traffic_lights, jsonData.distance);
            }
        });
        nizZaTrku.push(tempCar);
    }


});

// GET CARS AND DRAW THEM ON PAGE
var getJSON = function (inputStr) {
    $.ajax({
        url: "data.json",
        dataType: "json",
        method: "GET",
        success: function (jsonData) {
            window.data = jsonData;
            var niz = jsonData;
            var cars = niz.cars;
            var filtered = [];

            if (inputStr == "") {
                filtered = cars;
            } else {
                filtered = $.grep(cars, function (car, i) {
                    //  caps sensitive
                    return car.name.search(inputStr) > -1;
                });
            }

            $("#carsList").empty();
            $.map(filtered, function (n, i) {
                var row;
                if (i%3==0){
                    row = $('<div class="row"></div>');
                $("#carsList").append(row);

                }
                else {
                    row = $("#carsList .row").last();
                }
                var cell = $('<div class="cell"></div>');
                var carWrapper = $('<div class="car-wrapper"  data-id="' + n.id + '"></div>');
                var carFrontInfo = $('<div class="car-front-info"></div>');
                var carBackInfo = $('<div class="car-back-info"></div>')
                var carImage = $('<img>').attr({'src': n.image, 'height': 130, 'alt': 'Photo of ' + n.description});
                var carName = $('<h4></h4>').html(n.name);
                var carBackOverlay = $('<div class="overlay"></div>');
                var carBackData = "<strong>Car name:</strong> "+ n.name + "<br>"+
                                    "<strong>Car description:</strong> " + n.description + "<br>"+
                                    "<strong>Car speed:</strong> " + n.speed;
                carBackOverlay.html(carBackData);
                carFrontInfo.append(carImage, carName);
                carBackInfo.append(carImage.clone(), carBackOverlay);
                carWrapper.append(carFrontInfo, carBackInfo);
                cell.append(carWrapper);
                row.append(cell);
            });
        }
    });
};


// ANIMATION
$(document).on('click', '#startRace', function () {

    if ($("#animationSpeed").val()) {
        if (parseInt($("#animationSpeed").val()) > 0) {

            var animationSpeed = $("#animationSpeed").val();
            var rankings = [];
            // needs to go before animation to avoid doubling the call (or trippling...)
            lightHeadElements = $(".lightHead");
            lightelementcounter = 0;
            for (var i = 0; i < lightHeadElements.length; i++) {
                changeLights(lightHeadElements[i], animationSpeed);
            }

            $.map(nizZaTrku, function (car, i) {
                car.distance = 0;
                var conditions = [];

                $.map(window.data.traffic_lights, function (light, i) {
                    light["type"] = 'trafficLight';
                    conditions.push(light);
                });

                $.map(window.data.speed_limits, function (limit, i) {
                    limit["type"] = 'speedLimit';
                    conditions.push(limit);
                });

                conditions.sort(function (a, b) {
                    return a.position - b.position
                });
                conditions.push({position: window.data.distance, speed: 0, type: 'speedLimit'});

                //Making road sections
                var pathParts = [];
                var currentSpeed = car.speed;

                for (let i = 0; i < conditions.length; i++) {
                    let pathPart = {};

                    pathPart.speed = currentSpeed;
                    pathPart.length = conditions[i].position - (conditions[i - 1] ? conditions[i - 1].position : 0);
                    pathPart.duration = (pathPart.length / currentSpeed) * 3600000; // in ms
                    pathPart.endTime = pathParts[pathParts.length - 1] ? pathParts[pathParts.length - 1].endTime + pathPart.duration : pathPart.duration;

                    pathParts.push(pathPart);
                    if (conditions[i].type === 'speedLimit') {
                        currentSpeed = conditions[i].speed; // menjati samo ako je sporije od moguce brzine automobila
                    }
                    else {
                        let lightChangesCount = pathParts[pathParts.length - 1].endTime / conditions[i].duration;
                        let redLight = (lightChangesCount % 2 ? true : false);

                        var moduo = pathParts[pathParts.length - 1].endTime % conditions[i].duration;

                        if (redLight) {
                            let pathPart = {};
                            pathPart.speed = 0;
                            pathPart.length = 0;
                            pathPart.duration = conditions[i].duration - moduo;
                            pathPart.endTime = pathParts[pathParts.length - 1].endTime + pathPart.duration;

                            pathParts.push(pathPart);
                        }
                    }
                }

                // Animating movement
                let distance = 0;
                for (let i = 0; i < pathParts.length; i++) {
                    distance += pathParts[i].length * 1000 / window.data.distance; //move in px
                    $("#" + car.id).animate({
                        left: distance
                    }, pathParts[i].duration / animationSpeed, "linear", function () {
                    })
                }
                ;
                rankings.push({"id": car.id, "endTime": pathParts[pathParts.length - 1].endTime});

            });
            gimmeMedal(rankings, animationSpeed);

        } else {
            alert("Unesite ceo broj za brzinu animacije");
        }
    } else {
        alert("Obavezno uneti brzinu animacije");
    }


});


var nizZaTrku = [];

getJSON("");
