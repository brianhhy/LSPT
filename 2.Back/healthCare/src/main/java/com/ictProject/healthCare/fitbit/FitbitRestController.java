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

    // 사용자의 날짜별 활동 요약 가져오기
    @GetMapping("/api/activities")
    public Mono<String> getActivities(@RequestParam("date") String date, HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        System.out.println("엑세스토큰: " + accessToken);
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/activities/date/" + date + ".json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    // 날짜별 심박수 시계열 가져오기
    @GetMapping("/api/heartrate/time")
    public Mono<String> getHeartrateTime(@RequestParam("date") String date, HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/activities/heart/date/" + date + "/1d/1sec.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    // 날짜별 심박수 변화도 가져오기
    @GetMapping("/api/heartrate/variability")
    public Mono<String> getHeartrateVariability(@RequestParam("date") String date, HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/hrv/date/" + date + ".json")
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

    // 날짜별 산소포화도 가져오기
    @GetMapping("/api/oxygen_saturation")
    public Mono<String> getOxygenSaturation(@RequestParam("date") String date, HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/spo2/date/" + date + ".json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    // 날짜별 호흡율 가져오기
    @GetMapping("/api/breathing_rate")
    public Mono<String> getRespiratoryRate(@RequestParam("date") String date, HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/br/date/" + date + ".json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    // 날짜별 수면 기록 가져오기
    @GetMapping("/api/sleep")
    public Mono<String> getSleep(@RequestParam("date") String date, HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1.2/user/-/sleep/date/" + date + ".json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    // 날짜별 코어 온도 가져오기
    @GetMapping("/api/temperature/core")
    public Mono<String> getTemperatureCore(@RequestParam("date") String date, HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/temp/core/date/" + date + ".json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);
    }

    // 날짜별 피부 온도 가져오기
    @GetMapping("/api/temperature/skin")
    public Mono<String> getTemperatureSkin(@RequestParam("date") String date, HttpSession session) {
        String accessToken = (String) session.getAttribute("access_token");
        if (accessToken == null) {
            return Mono.just("Access token is missing.");
        }
        return webClient.get()
                .uri("https://api.fitbit.com/1/user/-/temp/skin/date/" + date + ".json")
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

    //친구 리스트 가져오기
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
}
