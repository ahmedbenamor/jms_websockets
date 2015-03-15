<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib uri='http://java.sun.com/jsp/jstl/core' prefix='c'%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<!--  Bootstrap related -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="<c:url value="/resources/js/bootstrap/css/bootstrap.min.css"/>">
<%-- <link href="<c:url value="/resources/css/login.css"/>" rel="stylesheet"> --%>
<title>Login : Demo JMS and Websockets</title>
</head>
<body>
  <div class="container">
    <div class="span12">
      <div id="heading" class="masthead">
        <h3 class="muted">Login</h3>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <div class="panel panel-default">
            <div class="panel-body">
              <form action="${pageContext.request.contextPath}/tologin" method="post" 
                  class="form-signin" role="form">
                <div class="form-group">
                  <label for="username">User name:</label> 
                  <input type="text" name="username" id="username" class="form-control" 
                    placeholder="User name" required autofocus />
                </div>
                <div class="form-group">
                  <label for="password">Password:</label> <input type="password" name="password" id="password"
                    class="form-control" placeholder="Password" required>
                </div>
                <input name="submit" type="submit" value="Submit" class="btn btn-success">
              </form>
              <c:if test="${'fail' eq param.auth}">
                <p>
                <div class="alert alert-danger">Login Failed :
                  ${sessionScope["SPRING_SECURITY_LAST_EXCEPTION"].message}</div>
              </c:if>
            </div>
          </div>
        </div>
        <!-- .panel-body -->
      </div>
      <!-- .panel -->
    </div>
    <!-- .span12 -->
  </div>
  
  <script src="<c:url value="/resources/js/jquery-1.10.2.min.js"/>"></script>
  <script src="<c:url value="/resources/js/bootstrap/js/bootstrap.min.js"/>"></script>
</body>
</html>