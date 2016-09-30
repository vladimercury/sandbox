projects = {
	"WeatherApp": "weatherapp.html",
	"TwitchApp": "twitchapp.html",
}

$(function(){
	for (var proj in projects){
		var classname = '';
		var href = 'href="' + projects[proj] + '"';
		if(window.location.pathname.endsWith(projects[proj])){
			classname = 'class="active"';
			href = '';
		}
		$("#project-links").append('<li ' + classname + '><a ' + href + '>' + proj + '</a></li>');
	}
});