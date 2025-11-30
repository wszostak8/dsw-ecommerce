package it.wszostak.dswecommerce.config

import it.wszostak.dswecommerce.auth.utils.JwtAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.authentication.HttpStatusServerEntryPoint

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
class SecurityConfig {

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun springSecurityFilterChain(
        http: ServerHttpSecurity,
        jwtAuthenticationFilter: JwtAuthenticationFilter
    ): SecurityWebFilterChain {
        http
            .csrf { it.disable() }
            .formLogin { it.disable() }
            .httpBasic { it.disable() }
            .exceptionHandling { handling ->
                handling.authenticationEntryPoint(HttpStatusServerEntryPoint(HttpStatus.UNAUTHORIZED))
            }
            .authorizeExchange { exchanges ->
                exchanges
                    .pathMatchers(HttpMethod.GET, "/images/**").permitAll()
                    .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .pathMatchers("/api/auth/**").permitAll()
                    .pathMatchers("/api/cart/**").permitAll()
                    .pathMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                    .pathMatchers(HttpMethod.POST, "/api/orders").permitAll()
                    .anyExchange().authenticated()
            }
            .addFilterAt(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)

        return http.build()
    }
}