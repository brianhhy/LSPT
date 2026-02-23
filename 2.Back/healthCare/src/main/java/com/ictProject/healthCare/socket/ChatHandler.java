package com.ictProject.healthCare.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

public class ChatHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
    private final Map<String, String> sessionUserMap = new ConcurrentHashMap<>(); // 세션 ID와 사용자 이름 매핑
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        String displayName = (String) session.getAttributes().get("displayName");

        if (displayName != null) {
            sessionUserMap.put(session.getId(), displayName); // 사용자 이름 저장
            broadcastUserList(); // 사용자 목록 갱신
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        sessionUserMap.remove(session.getId()); // 세션 종료 시 사용자 이름 제거
        broadcastUserList(); // 사용자 목록 갱신
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String payload = message.getPayload();
        MessageData messageData = objectMapper.readValue(payload, MessageData.class);

        if (messageData.getRecipient() != null) {
            // 1대1 메시지 전송
            sendPrivateMessage(session, messageData);
        } else {
            // 전체 메시지 전송
            broadcastMessage(session, messageData);
        }
    }

    private void sendPrivateMessage(WebSocketSession senderSession, MessageData messageData) throws IOException {
        String sender = sessionUserMap.get(senderSession.getId());
        messageData.setSender(sender); // sender 설정
        String recipient = messageData.getRecipient();

        // 특정 수신자에게만 메시지 전송
        for (WebSocketSession session : sessions) {
            if (sessionUserMap.get(session.getId()).equals(recipient)) {
                session.sendMessage(new TextMessage(objectMapper.writeValueAsString(messageData))); // JSON 형식으로 전송
                break;
            }
        }

        // 메시지 전송 후 확인 메시지를 발신자에게도 전송
        senderSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(messageData)));
    }

    private void broadcastMessage(WebSocketSession senderSession, MessageData messageData) throws IOException {
        String sender = sessionUserMap.get(senderSession.getId());
        messageData.setSender(sender); // sender 설정

        String messageJson = objectMapper.writeValueAsString(messageData);

        for (WebSocketSession session : sessions) {
            session.sendMessage(new TextMessage(messageJson));
        }
    }

    private void broadcastUserList() throws IOException {
        String userListJson = objectMapper.writeValueAsString(sessionUserMap.values());
        for (WebSocketSession session : sessions) {
            session.sendMessage(new TextMessage("{\"type\":\"userList\",\"users\":" + userListJson + "}"));
        }
    }

    // Inner class to handle message data
    private static class MessageData {
        private String message;
        private String recipient;
        private String sender; // 추가된 필드

        // Getters and Setters
        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getRecipient() {
            return recipient;
        }

        public void setRecipient(String recipient) {
            this.recipient = recipient;
        }

        public String getSender() {
            return sender;
        }

        public void setSender(String sender) {
            this.sender = sender;
        }
    }
}
