<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib uri='http://java.sun.com/jsp/jstl/core' prefix='c'%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0">
<!--  Bootstrap related -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Latest compiled and minified Bootstrap CSS -->
<link rel="stylesheet" href="<c:url value="/resources/js/bootstrap/css/bootstrap.min.css"/>">
<title>Demo JMS and Websockets</title>
<!-- WebSocket related javascript includes -->
<script src="<c:url value="/resources/js/sockjs-0.3.4.min.js"/>"></script>
<script src="<c:url value="/resources/js/stomp.js"/>"></script>
<script src="<c:url value="/resources/js/hellows.js"/>"></script>
</head>
<body>
<input type="hidden" id="contextPath" value="${pageContext.request.contextPath}"/>
  <noscript>
    <h2 style="color: #ff0000">enable javascript and reload this page</h2>
  </noscript>
  <c:url var="imageUrl" value="/resources/images/user01.png" />
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <!-- WebSocket related Twitter Bootstrap 3.0 based UI elements -->
        <div id="heading" class="masthead">
          <div class="pull-right">
          <input type="hidden" value="${username}" id="username"/>
            Logged In: <strong>${username}</strong> | ${time } | <a href="${pageContext.request.contextPath}/tologout">Logout&nbsp;<span class="glyphicon glyphicon-remove"></span></a>
          </div>
          <h3 class="muted">
            <img src="${imageUrl}" />Welcome to JMS websocket demo
          </h3>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6">
        <p>&nbsp;</p>
       <div class="panel">
          <button id="connect" class="btn btn-success btn-sm">Connect</button>
          <button id="disconnect" class="btn btn-danger btn-sm">Disconnect</button>
        </div>
        <p />
        <div class="panel panel-default">
          <div class="panel-heading">Send Messages To Controller</div>
          <div class="panel-body" id="conversationDiv">
            <div class="input-group">
              <input type="text" class="form-control" id="txtSendMessage" placeholder="Enter message"> <span class="input-group-btn">
                <button id="sendMessage" class="btn btn-primary">
                  <span class="glyphicon glyphicon-share-alt"></span>&nbsp;Send
                </button>
              </span>
            </div>
            <!-- Error alert -->
            <div class="alert alert-danger alert-dismissable" id="formAlert">
              <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
              <strong>Error!</strong> Message cannot be blank.
            </div>
            <!-- /Error alert -->
            <!-- Info alert -->
            <div class="alert alert-info alert-dismissable" id="formInfoAlert">
              <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
              <strong>Message Sent!</strong> <br />Your message has been sent to the server. you will receive more detail 
            </div>
            <!-- /Info alert -->
            <!-- .input-group -->
          </div>
          <!-- .panel-body -->
          <div class="panel-body" id="response"></div>
          <!-- Div to show the server responses -->
        </div>
        <!-- .panel -->
      </div>
    </div>
  </div>
 
  <script src="<c:url value="/resources/js/jquery-1.10.2.min.js"/>"></script>
  <script src="<c:url value="/resources/js/bootstrap/js/bootstrap.min.js"/>"></script>
  <script src="<c:url value="/resources/js/knockout-3.0.0.js"/>"></script>
 <c:url value="/simplemessages" var="socketDest" />
  <script type="text/javascript">
            
            $(document).ready(function() {
               
                $("#disconnect").prop('disabled', true);
                $("#txtSendMessage").prop('disabled', true);
                $("#sendMessage").prop('disabled', true);
 				$("#txtSendMessage").val("");
                $("#response").empty();
                $(".alert").hide();
                $("#connect").on("click", function(e) {
               $("#formAlert").slideUp(400);
                    init();
                });

                // Event handler: Disconnect button 
                $("#disconnect").on("click", function(e) {
                  $("#formAlert").slideUp(400);
                    var username = $('#username').val();
                    disconnect(username);
                });
               
               

               
                $("#sendMessage").on("click", function(e) {

                    // Find the input text element for the server message
                    var messageForServer = $("#txtSendMessage").val();

                    if (messageForServer === "") {

                        // If message is empty prevent submission and show the alert
                        e.preventDefault();
                        $("#formAlert").slideDown(400);

                    } else {

                       
                        $("#formAlert").slideUp(400);
						$("#formInfoAlert").slideDown(400);
						if(request)
			    		{
			    		request.abort();
			    		
			    		}
			    		var url = $('#contextPath').val()+'/jms?message='+messageForServer;
			        	console.log(url);
			        	var request = $.ajax({ 
			        		url: url,
			        		type : 'GET',
			        		success: function (data, status, xhr) {
			        			console.log('data '+data);
			        		},
			        		error:function(info){
			        			console.log('error '+info);
			        		}
			        		
			        	  });

                        
                    }
                });
            });
  </script>
</body>
</html>