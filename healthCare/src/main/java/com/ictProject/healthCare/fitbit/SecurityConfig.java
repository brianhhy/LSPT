package com.ictProject.healthCare.fitbit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.registration.*;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${fitbit.client-id}")
    private String clientId;

    @Value("${fitbit.client-secret}")
    private String clientSecret;

    @Value("${fitbit.redirect-uri}")
    private String redirectUri;

    @Value("${fitbit.authorization-uri}")
    private String authorizationUri;

    @Value("${fitbit.token-uri}")
    private String tokenUri;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/", "/api/**", "/callback", "/authorize").permitAll()
                                .anyRequest().authenticated()
                )
                .oauth2Login(oauth2Login ->
                        oauth2Login
                                .defaultSuccessUrl("/api/profile", true)
                )
                .logout(logout ->
                        logout
                                .logoutSuccessUrl("/")
                );
        return http.build();
    }


    @Bean
    public ReactiveClientRegistrationRepository reactiveClientRegistrationRepository() {
        return new InMemoryReactiveClientRegistrationRepository(this.fitbitClientRegistration());
    }

    private ClientRegistration fitbitClientRegistration() {
        return ClientRegistration.withRegistrationId("fitbit")
                .clientId(clientId)
                .clientSecret(clientSecret)
                .scope("activity", "heartrate", "location", "nutrition", "oxygen_saturation", "profile", "respiratory_rate", "settings", "sleep", "social", "temperature", "weight")
                .authorizationUri(authorizationUri)
                .tokenUri(tokenUri)
                .redirectUri(redirectUri)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .build();
    }

}