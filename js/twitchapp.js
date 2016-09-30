var twitch = {
	user: 'vladimercury',
	clientID: 'n7z3f45b4160mwkfp0ptukaf7ge3ee3',
	api: 'https://api.twitch.tv/kraken/',
	streams:{
		
	},
	streams_on:{
		
	}
}

function fill_follows(data){
	twitch.streams = {};
	for (var i in data.follows){
		var stream = data.follows[i];
		twitch.streams[stream.channel.name] = {
			user: stream.channel.name,
			name: stream.channel.display_name,
			logo: stream.channel.logo,
			url: stream.channel.url,
		}
	}
}

function twitch_fail(data){
	$("#real-content").html('<div class="panel-danger"><div class="panel-heading"><h3 class="panel-title">Connection error</h3></div></div>');
}

function twitch_success(data){
	twitch.streams_on = {};
	for (var i in data.streams){
		var stream = data.streams[i];
		delete twitch.streams[stream.channel.name];
		twitch.streams_on[stream.channel.name] = {
			user: stream.channel.name,
			name: stream.channel.display_name,
			logo: stream.channel.logo,
			url: stream.channel.url,
			header: stream.channel['status'],
			game: stream.game,
			viewers: stream.viewers,
			preview: stream.preview.medium,
		}
	}
	twitch_draw();
}

function twitch_draw(){
	var offline = Object.keys(twitch.streams);
	var online = Object.keys(twitch.streams_on);
	offline.sort(function(a, b){
		return a.localeCompare(b);
	});
	online.sort(function(a,b){
		return twitch.streams_on[b].viewers - twitch.streams_on[a].viewers;
	});
	var html = '<div class="list-group">';
	for (var i in online){
		html += twitch_html_on(twitch.streams_on[online[i]]);
	}
	for (var i in offline){
		html += twitch_html_off(twitch.streams[offline[i]]);
	}
	html += '</div>';
	$("#real-content").html(html);
	
	$("a#hideOffline").html("Hide offline");
	
	$("a#hideOffline").on("click", function(){
		var group = $(".list-group-item:not(.active)");
		if(group.css("display") === "block"){
			group.css("display",  "none");
			$(this).html("Show offline");
		}
		else{
			group.css("display", "block");
			$(this).html("Hide offline");
		}
	});
	
	$("a#refreshList").css("display", "block");
	
	$("a#refreshList").on("click", function(){
		$("a#hideOffline").unbind("click");
		$("a#refreshList").unbind("click");
		$("a#refreshList").css("display", "none");
		get_follow_data();
	});
}

function twitch_html_off(data){
	return '<a class="list-group-item">' +
			'<img src="' + (data.logo === null ? 'img/nothing.gif' : data.logo) + '" class="img-circle twitch-chan-logo">' +
			'<span>' +
				'<h4 class="list-group-item-heading">OFFLINE</h4>' +
				'<p class="list-group-item-text">' + data.name + '</p>' + 
			'</span>' +
		'</a>';
}

function twitch_html_on(data){
	return '<a href="' + data.url + '" class="list-group-item active" target="_blank">' +
			'<span class="badge">' + data.viewers + '</span>' +
			'<img src="' + data.logo + '" class="img-circle twitch-chan-logo">' +
			'<span>' +
				'<h4 class="list-group-item-heading">' + data.header + '</h4>' +
				'<p class="list-group-item-text">' + data.name + ' <span class="label label-success">' + data.game + '</span></p>' + 
			'</span>' +
		'</a>';
}

function get_follow_data(){
	$.ajax({
		type: 'GET',
		url: twitch.api + 'users/' + twitch.user + '/follows/channels?limit=100',
		headers:{
			'Client-ID': twitch.clientID,
		},
		success: function(data){
			fill_follows(data);
			get_online_data();
		},
		error: twitch_fail,
	});
}

function get_online_data(){
	$.ajax({
		type: 'GET',
		url: twitch.api + 'streams?channel=' + Object.keys(twitch.streams).join(','),
		headers:{
			'Client-ID': twitch.clientID,
		},
		success: twitch_success,
		error: twitch_fail,
	});
}

$(get_follow_data());