package com.ictProject.healthCare.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ChatController {

    @GetMapping("/talk")
    public ModelAndView chat(HttpSession session) {
        ModelAndView modelAndView = new ModelAndView("talk");

        // 세션에서 displayName을 가져옵니다.
        String displayName = (String) session.getAttribute("displayName");

        // displayName이 세션에 없는 경우 기본값으로 설정합니다.
        if (displayName == null || displayName.isEmpty()) {
            displayName = "Anonymous"; // 또는 다른 기본값 설정
            session.setAttribute("displayName", displayName);
        }

        modelAndView.addObject("name", displayName);
        return modelAndView;
    }
}

