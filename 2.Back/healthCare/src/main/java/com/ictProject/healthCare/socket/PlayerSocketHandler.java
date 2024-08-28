package com.ictProject.healthCare.socket;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.*;
import java.util.Map;
import java.util.UUID;


public class PlayerSocketHandler extends TextWebSocketHandler {

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, String> sessionToPlayerId = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private final BlockingQueue<String> messageQueue = new LinkedBlockingQueue<>();


    public PlayerSocketHandler() {
        // 메시지를 큐에서 꺼내서 전송하는 스레드 시작
        Thread senderThread = new Thread(() -> {
            while (true) {
                try {
                    String message = messageQueue.take(); // 큐에서 메시지 꺼내기
                    for (WebSocketSession wsSession : sessions.values()) {
                        if (wsSession.isOpen()) {
                            synchronized (wsSession) {
                                wsSession.sendMessage(new TextMessage(message));
                            }
                        }
                    }
                } catch (InterruptedException | IOException e) {
                    e.printStackTrace(); // 에러 처리
                }
            }
        });
        senderThread.setDaemon(true);
        senderThread.start();
    }
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

        // 메시지를 큐에 추가
        messageQueue.add(updatedMessage);
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
