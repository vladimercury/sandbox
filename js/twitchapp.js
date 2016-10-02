var twitch = {
	user: 'vladimercury',
	clientID: 'n7z3f45b4160mwkfp0ptukaf7ge3ee3',
	api: 'https://api.twitch.tv/kraken/',
	player: 'http://player.twitch.tv/?channel=',
	chat: 'http://twitch.tv/chat/embed?channel=',
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
	$("#real-content").show("fade", {}, 250);

	$("a#hideOffline").on("click", function(){
		var group = $(".list-group-item:not(.active)");
			group.toggle("highlight", {}, 500);
	});
	
	$("a#refreshList").show("fade", 250);
	
	$("a#refreshList").on("click", function(){
		$("a#hideOffline").unbind("click");
		$("a#refreshList").unbind("click");
		$("a#refreshList").hide("fade", 250);
		$("#real-content").hide("fade", {}, 250);
		get_follow_data();
	});

	$("a.link-stream").on("click", function(){
		run_stream($(this).attr("channel"));
	});

	$("li#close-player").on("click", close_stream);
	$("li#toggle-chat").on("click", toggle_chat);
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
	return '<a class="link-stream list-group-item active" channel="' + data.user + '">' +
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

function run_stream(channel){
	$("#twitchapp .overlay").css("display", "block");
	$("#twitchapp").addClass("overlayed");
	$("#close-player").css("display", "block");
	$("#toggle-chat").css("display", "block");
	$("#twitch-chat").attr("src", twitch.chat + channel);
	$("#twitch-player").attr("src", twitch.player + channel);
}

function close_stream(){
	$("#twitch-player").attr("src", "");
	$("#twitch-chat").attr("src", "");
	$("#close-player").css("display", "none");
	$("#toggle-chat").css("display", "none");
	$("#twitchapp .overlay").css("display", "none");
	$("#twitchapp").removeClass("overlayed");
}

function toggle_chat(){
	if ($("#twitch-chat").css("display") === "none"){
		$("#twitch-player").css("width", "77%");
		$("#twitch-chat").css("display", "block");
	}
	else{
		$("#twitch-chat").css("display", "none");
		$("#twitch-player").css("width", "100%");
	}
}

$(get_follow_data());