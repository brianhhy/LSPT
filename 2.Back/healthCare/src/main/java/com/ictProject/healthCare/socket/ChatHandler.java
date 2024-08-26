package com.ictProject.healthCare.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

public class ChatHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        // Deserialize the incoming message
        String payload = message.getPayload();
        MessageData messageData = objectMapper.readValue(payload, MessageData.class);

        // Broadcast the message to all connected clients
        String formattedMessage = messageData.getName() + ": " + messageData.getMessage();
        for (WebSocketSession s : sessions) {
            s.sendMessage(new TextMessage(formattedMessage));
        }
    }

    // Inner class to handle message data
    private static class MessageData {
        private String name;
        private String message;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
