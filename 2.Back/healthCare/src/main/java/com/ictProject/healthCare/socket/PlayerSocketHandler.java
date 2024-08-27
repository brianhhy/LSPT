package com.ictProject.healthCare.socket;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.UUID;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;


public class PlayerSocketHandler extends TextWebSocketHandler {

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, String> sessionToPlayerId = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String playerId = UUID.randomUUID().toString();
        sessions.put(playerId, session);
        sessionToPlayerId.put(session.getId(), playerId);
        String responseMessage = String.format("{\"type\":\"clientId\",\"playerId\":\"%s\"}", playerId);
        session.sendMessage(new TextMessage(responseMessage));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String playerId = sessionToPlayerId.get(session.getId());
        String payload = message.getPayload();
        String updatedMessage = String.format("{\"playerId\":\"%s\",%s", playerId, payload.substring(1));
        for (WebSocketSession wsSession : sessions.values()) {
            if (wsSession.isOpen()) {
                wsSession.sendMessage(new TextMessage(updatedMessage));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String playerId = sessionToPlayerId.remove(session.getId());
        sessions.remove(playerId);
        String removeMessage = String.format("{\"type\":\"removePlayer\",\"playerId\":\"%s\"}", playerId);
        for (WebSocketSession wsSession : sessions.values()) {
            if (wsSession.isOpen()) {
                wsSession.sendMessage(new TextMessage(removeMessage));
            }
        }
    }
}
