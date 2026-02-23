package com.ictProject.healthCare.fitbit;

import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.security.oauth2.client.ReactiveOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServerOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.security.oauth2.client.web.server.ServerOAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.server.WebSessionServerOAuth2AuthorizedClientRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.result.method.annotation.ArgumentResolverConfigurer;
import org.springframework.security.oauth2.client.web.reactive.result.method.annotation.OAuth2AuthorizedClientArgumentResolver;
import org.springframework.web.server.WebFilter;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import javax.net.ssl.SSLException;

@Configuration
public class WebClientConfig implements WebFluxConfigurer {

    @Bean
    public WebClient webClient(ReactiveClientRegistrationRepository clientRegistrationRepository,
                               ServerOAuth2AuthorizedClientRepository customAuthorizedClientRepository) {
        HttpClient httpClient = HttpClient.create()
                .secure(sslContextSpec -> {
                    try {
                        sslContextSpec.sslContext(
                                SslContextBuilder.forClient().trustManager(InsecureTrustManagerFactory.INSTANCE).build()
                        );
                    } catch (SSLException e) {
                        throw new RuntimeException(e);
                    }
                });

        ServerOAuth2AuthorizedClientExchangeFilterFunction oauth2Client =
                new ServerOAuth2AuthorizedClientExchangeFilterFunction(clientRegistrationRepository, customAuthorizedClientRepository);

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
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