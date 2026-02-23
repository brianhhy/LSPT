package com.ictProject.healthCare.socket;



import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new PlayerSocketHandler(), "/ws/player")
                .setAllowedOrigins("*");

        // ChatHandler 핸들러를 추가하고 HttpSessionHandshakeInterceptor를 추가
        registry.addHandler(new ChatHandler(), "/chat")
                .addInterceptors(new HttpSessionHandshakeInterceptor()) // 세션 속성 전달을 위해 인터셉터 추가
                .setAllowedOrigins("*"); // CORS 설정
    }
}

