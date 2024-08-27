package com.ictProject.healthCare.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ChatController {

    @GetMapping("/talk")
    public ModelAndView chat(@RequestParam(name = "name", defaultValue = "Anonymous") String name) {
        ModelAndView modelAndView = new ModelAndView("talk");
        modelAndView.addObject("name", name);
        return modelAndView;
    }
}


