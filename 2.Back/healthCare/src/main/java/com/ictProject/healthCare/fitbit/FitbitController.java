package com.ictProject.healthCare.fitbit;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
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

import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;

@Controller
public class FitbitController {

    private final WebClient webClient;
    private final String clientId;
    private final String clientSecret;
    private final String tokenUri;
    private final String redirectUri;

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
            session.setAttribute("access_token", accessToken);

            //세션에 사용자 이름 저장
            // 2. Fitbit API에 GET 요청
            Map<String, Object> profileResponse = webClient.get()
                    .uri("https://api.fitbit.com/1/user/-/profile.json") // Fitbit의 사용자 프로필 엔드포인트
                    .header("Authorization", "Bearer " + accessToken) // 엑세스 토큰을 헤더에 추가
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (profileResponse == null || !profileResponse.containsKey("user")) {
                redirectAttributes.addFlashAttribute("error", "Failed to retrieve profile information.");
                return "redirect:/error";
            }

        // Fitbit API 응답에서 사용자 이름 가져오기
            Map<String, Object> user = (Map<String, Object>) profileResponse.get("user");
            String displayName = (String) user.get("displayName");
            session.setAttribute("displayName", displayName);
            System.out.println("name: " + displayName);

            return "redirect:http://localhost:3000/UserMetaverse";
        } catch (WebClientResponseException e) {
            redirectAttributes.addFlashAttribute("error", "Error during token request: " + e.getResponseBodyAsString());
            return "redirect:/error";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "An unexpected error occurred: " + e.getMessage());
            return "redirect:/error";
        }
    }

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

    @GetMapping("/authorize")
    public String authorize(HttpServletRequest request) throws NoSuchAlgorithmException {
        String codeVerifier = PKCEUtil.generateCodeVerifier();
        String codeChallenge = PKCEUtil.generateCodeChallenge(codeVerifier);

        HttpSession session = request.getSession();
        String accessToken = (String) session.getAttribute("access_token");
        // 이미 엑세스 토큰이 있는 경우 리다이렉트 방지
        if (accessToken != null) {
            return "redirect:http://localhost:3000/UserMetaverse";
        }
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

    @GetMapping("/error")
    public String error(Model model) {
        return "error";
    }
}
