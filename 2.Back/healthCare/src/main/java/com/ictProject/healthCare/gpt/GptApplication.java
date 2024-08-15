package com.ictProject.healthCare.gpt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootApplication
@RestController
public class GptApplication {

    @Value("${chatgpt.api.key}")
    private String chatGptApiKey;

    private final String chatGptEndpoint = "https://api.openai.com/v1/chat/completions";

    public GptApplication() {
    }

    @PostMapping("/consult-health")
    public String consultHealth(@RequestBody Map<String, Object> healthInfoMap) {
        String question = String.format(
                "다음은 나의 건강 정보야: %s.\n" +
                        "이 정보에 따라 나의 건강 상태를 짧게 요약해줄래?",
                healthInfoMap.toString()
        );

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", question);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4-mini");
        requestBody.put("messages", List.of(message));
        requestBody.put("max_tokens", 400);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + chatGptApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<ChatGptResponse> responseEntity = restTemplate.exchange(
                chatGptEndpoint,
                HttpMethod.POST,
                entity,
                ChatGptResponse.class
        );
        ChatGptResponse response = responseEntity.getBody();

        if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
            String reply = response.getChoices().get(0).getMessage().getContent();
            System.out.println(reply); // 응답을 콘솔에 출력
            return reply;
        } else {
            return "ChatGPT에서 응답을 받지 못했습니다.";
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(GptApplication.class, args);
    }
}
