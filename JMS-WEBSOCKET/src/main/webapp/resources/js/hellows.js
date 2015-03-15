var wsUri = wsUri = "ws://" + document.location.host + "/JMS-WEBSOCKET/simplemessages";
var websocket = new WebSocket(wsUri);
function init() {
	$("#connect").prop('disabled', true);
    $("#disconnect").prop('disabled', false);
    $("#sendMessage").prop('disabled', false);
    $("#txtSendMessage").prop('disabled', false);
	$("#response").empty();
     $("#txtSendMessage").val("");
    $("#txtSendMessage").focus();
    $("#txtSendMessage").select();
	websocket.onopen = function(evt) {
		
		onOpen(evt);
	};
	
	websocket.onclose = function(evt) {
		onClose(evt);
	};

	websocket.onmessage = function(evt) {
		onMessage(evt);
	};

	websocket.onerror = function(evt) {
		onError(evt);
	};
}
function logoutmessage(name) {
	websocket.send(name+ "is desconnected");
}
function sendMessage(message) {
	websocket.send(message);
}

function onOpen(evt) {
	
}

function onClose(evt) {

}

function onMessage(evt) {
	
	
	var servermessage = evt.data;
    var decoded = $("<div/>").html(servermessage).text();

    var tmp = "";
    var serverResponse = document.getElementById("response");
    var p = document.createElement('p');
    p.style.wordWrap = 'break-word';

    
        p.style.color = '#006600';
        tmp = "<span class='glyphicon glyphicon-dashboard'></span> " + decoded + " (Browser time:" + getCurrentDateTime() + ")";
    
    //Assigning the decoded HTML to the <p> element
    p.innerHTML = tmp;
    serverResponse.appendChild(p);
	
	
}

function onError(evt) {

}

function  disconnect(username)
{

$("#connect").prop('disabled', false);
$("#disconnect").prop('disabled', true);
$("#sendMessage").prop('disabled', true);
$("#txtSendMessage").prop('disabled', true);
$("#response").empty();
$("#txtSendMessage").val("");
$("#formAlert").slideUp(400);
$("#formInfoAlert").slideUp(400);
//websocket.send(username+" is deconnected ");
//websocket.close();
}


function getCurrentDateTime() {
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    return n + " @ " + time;
}

