package com.ictProject.healthCare.fitbit;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.ReactiveOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServerOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.security.oauth2.client.web.server.ServerOAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.server.WebSessionServerOAuth2AuthorizedClientRepository;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.result.method.annotation.ArgumentResolverConfigurer;
import org.springframework.security.oauth2.client.web.reactive.result.method.annotation.OAuth2AuthorizedClientArgumentResolver;
@Configuration
public class WebClientConfig implements WebFluxConfigurer {

    @Bean
    public WebClient webClient(ReactiveClientRegistrationRepository clientRegistrationRepository,
                               ServerOAuth2AuthorizedClientRepository customAuthorizedClientRepository) {
        ServerOAuth2AuthorizedClientExchangeFilterFunction oauth2Client =
                new ServerOAuth2AuthorizedClientExchangeFilterFunction(clientRegistrationRepository, customAuthorizedClientRepository);
        return WebClient.builder()
                .filter(oauth2Client)
                .build();
    }

    @Bean(name = "customAuthorizedClientRepository")
    public ServerOAuth2AuthorizedClientRepository customAuthorizedClientRepository() {
        return new WebSessionServerOAuth2AuthorizedClientRepository();
    }

    @Override
    public void configureArgumentResolvers(ArgumentResolverConfigurer configurer) {
        configurer.addCustomResolver(new OAuth2AuthorizedClientArgumentResolver((ReactiveOAuth2AuthorizedClientManager) customAuthorizedClientRepository()));
    }
}