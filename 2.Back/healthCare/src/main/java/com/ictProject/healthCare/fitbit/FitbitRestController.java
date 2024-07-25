package com.ictProject.healthCare.fitbit;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
public class FitbitRestController {
    private final WebClient webClient;

    public FitbitRestController(WebClient.Builder webClientBuilder,
                                @Value("${fitbit.client-id}") String clientId,
                                @Value("${fitbit.client-secret}") String clientSecret,
                                @Value("${fitbit.token-uri}") String tokenUri,
                                @Value("${fitbit.redirect-uri}") String redirectUri) {
        this.webClient = webClientBuilder.build();
    }

    @GetMapping("/api/activities")
    public Mono<String> getActivities(HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        System.out.println("엑세스토근"+accessToken);
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/activities.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    @GetMapping("/api/heartrate")
    public Mono<String> getHeartrate(HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    // 다른 API 엔드포인트들도 비슷하게 구현
    @GetMapping("/api/location")
    public Mono<String> getLocation(HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/activities/location.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    @GetMapping("/api/nutrition")
    public Mono<String> getNutrition(@RequestParam("access_token") String accessToken) {
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/foods/log/date/today.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    @GetMapping("/api/oxygen_saturation")
    public Mono<String> getOxygenSaturation(HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/spo2/date/today.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    @GetMapping("/api/profile")
    public Mono<String> getProfile(HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/profile.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    @GetMapping("/api/respiratory_rate")
    public Mono<String> getRespiratoryRate(HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/respiratory_rate/date/today/1d.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    @GetMapping("/api/settings")
    public Mono<String> getSettings(HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/settings.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    @GetMapping("/api/sleep")
    public Mono<String> getSleep(HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1.2/user/-/sleep/date/today.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    @GetMapping("/api/social")
    public Mono<String> getSocial(HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/friends.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    @GetMapping("/api/temperature")
    public Mono<String> getTemperature(HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/body/temperature.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    @GetMapping("/api/weight")
    public Mono<String> getWeight(HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/body/log/weight/date/today.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }
}
