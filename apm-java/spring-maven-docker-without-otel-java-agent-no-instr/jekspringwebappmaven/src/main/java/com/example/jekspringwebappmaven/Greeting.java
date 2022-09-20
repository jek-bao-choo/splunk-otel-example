package com.example.jekspringwebappmaven;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Greeting {
    @RequestMapping("/greeting")
    public String getGreeting() {
        return "Hello Jek REST Service Maven";
    }
}
