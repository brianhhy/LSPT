package com.ictProject.healthCare.gpt;

public class ChatGptRequest {
    private String prompt;
    private int max_tokens;

    public ChatGptRequest(String prompt) {
        this.prompt = prompt;
        this.max_tokens = 400; // 예시로 최대 토큰 수를 설정합니다. 실제 API 요청에 맞게 수정해야 합니다.
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public int getMax_tokens() {
        return max_tokens;
    }

    public void setMax_tokens(int max_tokens) {
        this.max_tokens = max_tokens;
    }
}