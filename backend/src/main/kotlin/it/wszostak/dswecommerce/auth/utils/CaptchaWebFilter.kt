package it.wszostak.dswecommerce.auth.utils

import it.wszostak.dswecommerce.auth.service.CloudflareTurnstileService
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono

@Component
class CaptchaWebFilter(
    private val turnstile: CloudflareTurnstileService
) : WebFilter {

    private val protectedPaths = listOf("/api/auth/login", "/api/auth/register")
    private val headerName = "X-Captcha-Token"

    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        val path = exchange.request.path.value()

        if (protectedPaths.none { path.endsWith(it) }) {
            return chain.filter(exchange)
        }

        if (exchange.request.method == HttpMethod.OPTIONS) {
            return chain.filter(exchange)
        }

        val token = exchange.request.headers.getFirst(headerName)
        if (token.isNullOrBlank()) {
            return deny(exchange, "CAPTCHA_MISSING")
        }

        val clientIp = clientIpFrom(exchange)

        return turnstile.verify(token, clientIp).flatMap { ok ->
            if (ok) chain.filter(exchange) else deny(exchange, "CAPTCHA_FAILED")
        }
    }

    private fun deny(exchange: ServerWebExchange, message: String): Mono<Void> {
        exchange.response.statusCode = HttpStatus.BAD_REQUEST
        exchange.response.headers.contentType = MediaType.TEXT_PLAIN
        val buffer = exchange.response.bufferFactory().wrap(message.toByteArray())
        return exchange.response.writeWith(Mono.just(buffer))
    }

    private fun clientIpFrom(exchange: ServerWebExchange): String? {
        val headers = exchange.request.headers
        val cf = headers.getFirst("CF-Connecting-IP")
        if (!cf.isNullOrBlank()) return cf
        val xff = headers.getFirst("X-Forwarded-For")?.split(",")?.firstOrNull()?.trim()
        if (!xff.isNullOrBlank()) return xff
        return exchange.request.remoteAddress?.address?.hostAddress
    }
}