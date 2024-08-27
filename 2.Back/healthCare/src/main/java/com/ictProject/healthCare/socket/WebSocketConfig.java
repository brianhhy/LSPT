package com.ictProject.healthCare.socket;



import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new PlayerSocketHandler(), "/ws/player")
                .setAllowedOrigins("*");

        // ChatHandler 핸들러를 추가
        registry.addHandler(new ChatHandler(), "/chat")
                .setAllowedOrigins("*"); // CORS 설정
    }


}

