<%--
  Created by IntelliJ IDEA.
  Date: 19/8/24
  Time: 1:52 pm
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>My Web App</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body>
<% if (request.getAttribute("error") != null) { %>
<div class="error">
    <%= request.getAttribute("error") %>
</div>
<% } else { %>
<h1>Hello, ${name}!</h1>
<% } %>
<form action="hello" method="get">
    <label for="name">Enter your name:</label>
    <input type="text" id="name" name="name">
    <input type="submit" value="Submit">
</form>
</body>
</html>
