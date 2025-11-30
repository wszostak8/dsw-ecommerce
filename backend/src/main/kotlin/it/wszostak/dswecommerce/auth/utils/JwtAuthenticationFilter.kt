package it.wszostak.dswecommerce.auth.utils

import it.wszostak.dswecommerce.auth.service.JwtService
import org.springframework.http.HttpCookie
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono

@Component
class JwtAuthenticationFilter(private val jwtService: JwtService) : WebFilter {

    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        val accessTokenCookie: HttpCookie =
            exchange.request.cookies.getFirst("accessToken") ?: return chain.filter(exchange)

        val token = accessTokenCookie.value
        try {
            val claims = jwtService.extractAllClaims(token)
            val userId = claims.subject
            val role = claims.get("role", String::class.java)

            val authorities = listOf(SimpleGrantedAuthority("ROLE_$role"))

            val authentication = UsernamePasswordAuthenticationToken(userId, null, authorities)

            return chain.filter(exchange)
                .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authentication))

        } catch (e: Exception) {
            return chain.filter(exchange)
        }
    }
}