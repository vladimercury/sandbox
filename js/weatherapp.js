var cityId = 498817;

var webappWebResource = "http://api.openweathermap.org/data/2.5/weather?id=498817&appid=c8e9fe9958edb2d21b01a90fbb1262d2";

function refreshWeather(){
	$.getJSON(webappWebResource, function(json) {
		printWeatherData(json);
	});
}

function setBackground(){
	$(".jumbotron").css("background", 'url("img/city/' + cityId + '.jpg") round');
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

$(function(){
	setBackground();
	refreshWeather();
});