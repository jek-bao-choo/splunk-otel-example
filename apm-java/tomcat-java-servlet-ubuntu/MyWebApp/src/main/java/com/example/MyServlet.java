package com.example;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/hello")
public class MyServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            String name = request.getParameter("name");
            name = (name != null && !name.trim().isEmpty()) ? name.trim() : "World";
            request.setAttribute("name", name);
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        } catch (Exception e) {
            // Log the exception
            getServletContext().log("An error occurred in MyServlet", e);
            // Set error message attribute
            request.setAttribute("error", "An unexpected error occurred. Please try again.");
            // Forward to error page or back to the index page
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
    }
}