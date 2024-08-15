package com.ictProject.healthCare.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class grandmaController {
    @GetMapping("/hello")
    public String hello(Model model){
        return "hello"; // templates html name
    }
}
