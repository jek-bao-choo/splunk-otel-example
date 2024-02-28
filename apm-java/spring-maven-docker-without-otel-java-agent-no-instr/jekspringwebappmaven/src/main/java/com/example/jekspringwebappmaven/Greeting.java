package com.example.jekspringwebappmaven;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Greeting {
    @RequestMapping("/greeting")
    public String getGreeting() {
        return "Hello Jek REST Service Maven";
    }

    @RequestMapping("/jek-error")
    public ResponseEntity<String> getError() {
        // You can customize the error message and HTTP status as needed
        String errorMessage = "Jek custom error message";
        return ResponseEntity
                .status(404) // You can change the status code based on your requirement
                .body(errorMessage);
    }

    @RequestMapping("/jek-forbidden")
    public ResponseEntity<String> getForbidden() {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN) // 403 Forbidden
                .body("Access to this resource is forbidden.");
    }

    @RequestMapping("/jek-server-error")
    public ResponseEntity<String> getServerError() {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR) // 500 Internal Server Error
                .body("An internal server error occurred.");
    }
}
