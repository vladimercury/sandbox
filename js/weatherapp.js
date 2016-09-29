var cities = {
	id1500607: "Lesosibirsk",
	id1502026: "Krasnoyarsk",
	id498817: "Saint Petersburg",
};

var jsonData = {

};

var example = {"coord":{"lon":30.26,"lat":59.89},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"base":"stations","main":{"temp":285.59,"pressure":1024,"humidity":96,"temp_min":284.82,"temp_max":286.48},"wind":{"speed":1.31,"deg":355.503},"rain":{"3h":0.055},"clouds":{"all":76},"dt":1474964540,"sys":{"type":3,"id":187864,"message":0.0289,"country":"RU","sunrise":1474948584,"sunset":1474990903},"id":498817,"name":"Saint Petersburg","cod":200};
var webPrefix = "http://api.openweathermap.org/data/2.5/weather?id=";
var webPostfix = "&appid=c8e9fe9958edb2d21b01a90fbb1262d2";

function refreshWeather(cityID){
	if(jsonData.hasOwnProperty(cityID)){
		printWeatherData(jsonData[cityID]);
	}
	else{
		$.getJSON(webPrefix + cityID.replace('id', '') + webPostfix, function(json) {
			jsonData[cityID] = json;
			printWeatherData(json);
		});
	}
}

function setBackground(cityID){
	$(".jumbotron").css("background", 'url("img/city/' + cityID + '.jpg") round');
}

function printWeatherData(json){
	$("#weather-city-name").html(json.name);
	$("#weather-city-country").html(json.sys.country);
	$("#weather-temp-val").html(kelvinToCelsius(json.main.temp));
	$("#weather-temp-degree").html("o");
	$("#weather-temp-unit").html("C");
	$("#weather-stat-name").html(json.weather.map(function(a){return '<img src="http://openweathermap.org/img/w/' + a.icon + '.png">' + a.description;}).join(', '));
	$("#weather-wind-arrow").css({
			"transform": "rotate(" + json.wind.deg + "deg)",
			"-webkit-transform": "rotate(" + json.wind.deg + "deg)",
			"-ms-transform": "rotate(" + json.wind.deg + "deg)",
	});
	$("#weather-wind-direction").html(windDirection(json.wind.deg));
	$("#weather-wind-power").html(json.wind.speed);
	$("#weather-wind-unit").html("m/s");
}

function kelvinToCelsius(temp){
	return (temp - 273.15).toFixed(1);
}

function windDirection(degree){
	var res = "";
	if (degree < 67.5 || degree > 292.5) res += "N";
	if (degree > 112.5 && degree < 247.5) res += "S";
	if (degree > 22.5 && degree < 157.5) res += "E";
	if (degree > 202.5 && degree < 337.5) res += "W";
	return res;
}

function drawLinks(cityID){
	$("#cities").html("");
	for (var i in cities){
		$("#cities").append('<li ' + (i === cityID ? 'class="active"' : '') + '><a id="' + i + '">' + cities[i] + '</a></li>');
	}
}

function setCity(cityID){
	setBackground(cityID);
	refreshWeather(cityID);
	drawLinks(cityID);
}

$(function(){
	setCity("id498817");
});

$(document).ready(function(){
	$('#cities').on("click", 'li:not(.active) > a[id!="id"]', function(){
		$('li.active').removeClass('active');
		$(this).parent().addClass('active');
		setCity($(this).attr("id"));
	});
});