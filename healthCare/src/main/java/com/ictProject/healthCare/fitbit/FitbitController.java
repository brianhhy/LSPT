package com.ictProject.healthCare.fitbit;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Map;

@Controller
public class FitbitController {

    private final WebClient webClient;
    private final String clientId;
    private final String clientSecret;
    private final String tokenUri;
    private final String redirectUri;

    // 생성자를 통해 필요한 값들을 주입받습니다.
    public FitbitController(WebClient.Builder webClientBuilder,
                            @Value("${fitbit.client-id}") String clientId,
                            @Value("${fitbit.client-secret}") String clientSecret,
                            @Value("${fitbit.token-uri}") String tokenUri,
                            @Value("${fitbit.redirect-uri}") String redirectUri) {
        this.webClient = webClientBuilder.build();
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.tokenUri = tokenUri;
        this.redirectUri = redirectUri;
    }

    // Fitbit API에서 데이터를 가져와서 모델에 추가하는 메서드입니다.
    @GetMapping("/start")
    public String start(@RequestParam("access_token") String accessToken, Model model) {
        // 여러 Fitbit API 호출을 비동기로 수행합니다.
        Mono<String> activities = webClient.get()
                .uri("https://api.fitbit.com/1/user/-/activities.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);

        Mono<String> heartrate = webClient.get()
                .uri("https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);

        // 추가적인 API 호출
        Mono<String> location = webClient.get()
                .uri("https://api.fitbit.com/1/user/-/activities/location.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);

        Mono<String> nutrition = webClient.get()
                .uri("https://api.fitbit.com/1/user/-/foods/log/date/today.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);

        Mono<String> oxygenSaturation = webClient.get()
                .uri("https://api.fitbit.com/1/user/-/spo2/date/today.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);

        Mono<String> profile = webClient.get()
                .uri("https://api.fitbit.com/1/user/-/profile.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);

        Mono<String> respiratoryRate = webClient.get()
                .uri("https://api.fitbit.com/1/user/-/respiratory_rate/date/today/1d.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);

        Mono<String> settings = webClient.get()
                .uri("https://api.fitbit.com/1/user/-/settings.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);

        Mono<String> sleep = webClient.get()
                .uri("https://api.fitbit.com/1.2/user/-/sleep/date/today.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);

        Mono<String> social = webClient.get()
                .uri("https://api.fitbit.com/1/user/-/friends.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);

        Mono<String> temperature = webClient.get()
                .uri("https://api.fitbit.com/1/user/-/body/temperature.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);

        Mono<String> weight = webClient.get()
                .uri("https://api.fitbit.com/1/user/-/body/log/weight/date/today.json")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class);


        // 결과를 모델에 추가하고 반환합니다.
        return Mono.zip(activities, heartrate,location,nutrition,oxygenSaturation)
                .map(tuple -> {
                    model.addAttribute("activities", tuple.getT1());
                    model.addAttribute("heartrate", tuple.getT2());
                    model.addAttribute("location", tuple.getT3());
                    model.addAttribute("nutrition", tuple.getT4());
                    model.addAttribute("oxygenSaturation",tuple.getT5());
                    return "start";
                })
                .block();
    }

    // Fitbit로부터 콜백을 처리하고 토큰을 교환하는 메서드입니다.
    @GetMapping("/callback")
    public String callback(@RequestParam("code") String code, HttpServletRequest request, RedirectAttributes redirectAttributes) {
        HttpSession session = request.getSession();
        String codeVerifier = (String) session.getAttribute("code_verifier");

        if (codeVerifier == null) {
            redirectAttributes.addFlashAttribute("error", "Session expired or invalid state.");
            return "redirect:/error";
        }

        try {
            Map<String, Object> response = webClient.post()
                    .uri(tokenUri)
                    .header("Authorization", "Basic " + Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8)))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .bodyValue(buildTokenRequest(code, codeVerifier))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null || !response.containsKey("access_token")) {
                redirectAttributes.addFlashAttribute("error", "Failed to retrieve access token.");
                return "redirect:/error";
            }

            String accessToken = (String) response.get("access_token");
            redirectAttributes.addAttribute("access_token", accessToken);
            return "redirect:/start";
        } catch (WebClientResponseException e) {
            redirectAttributes.addFlashAttribute("error", "Error during token request: " + e.getResponseBodyAsString());
            return "redirect:/error";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "An unexpected error occurred: " + e.getMessage());
            return "redirect:/error";
        }
    }

    // 토큰 요청을 위한 폼 데이터를 생성하는 메서드입니다.
    private MultiValueMap<String, String> buildTokenRequest(String code, String codeVerifier) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add(OAuth2ParameterNames.CLIENT_ID, clientId);
        formData.add(OAuth2ParameterNames.CLIENT_SECRET, clientSecret);
        formData.add(OAuth2ParameterNames.GRANT_TYPE, AuthorizationGrantType.AUTHORIZATION_CODE.getValue());
        formData.add(OAuth2ParameterNames.CODE, code);
        formData.add(OAuth2ParameterNames.REDIRECT_URI, redirectUri);
        formData.add("code_verifier", codeVerifier);
        return formData;
    }

    // 사용자 인증을 시작하는 엔드포인트입니다.
    @GetMapping("/authorize")
    public String authorize(HttpServletRequest request) throws NoSuchAlgorithmException {
        String codeVerifier = PKCEUtil.generateCodeVerifier();
        String codeChallenge = PKCEUtil.generateCodeChallenge(codeVerifier);

        HttpSession session = request.getSession();
        session.setAttribute("code_verifier", codeVerifier);

        String authorizationRequestUri = UriComponentsBuilder.fromUriString("https://www.fitbit.com/oauth2/authorize")
                .queryParam("response_type", "code")
                .queryParam("client_id", clientId)
                .queryParam("scope", "activity+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight")
                .queryParam("code_challenge", codeChallenge)
                .queryParam("code_challenge_method", "S256")
                .queryParam("redirect_uri", redirectUri)
                .build().toUriString();

        return "redirect:" + authorizationRequestUri;
    }

    // 에러 페이지를 처리하는 엔드포인트입니다.
    @GetMapping("/error")
    public String error(Model model) {
        return "error";
    }
}
