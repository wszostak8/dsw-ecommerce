package it.wszostak.dswecommerce.auth.service

import com.fasterxml.jackson.annotation.JsonProperty
import it.wszostak.dswecommerce.config.TurnstileProperties
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono

@Service
class CloudflareTurnstileService(
    private val props: TurnstileProperties
) {
    private val client = WebClient.create("https://challenges.cloudflare.com")

    data class VerifyResponse(
        val success: Boolean,
        @param:JsonProperty("error-codes") val errorCodes: List<String>? = null,
        val action: String? = null,
        @param:JsonProperty("challenge_ts") val challengeTs: String? = null,
        val hostname: String? = null
    )

    fun verify(token: String, remoteIp: String?): Mono<Boolean> {
        val form = LinkedMultiValueMap<String, String>().apply {
            add("secret", props.secret)
            add("response", token)
            if (!remoteIp.isNullOrBlank()) add("remoteip", remoteIp)
        }
        return client.post()
            .uri("/turnstile/v0/siteverify")
            .body(BodyInserters.fromFormData(form))
            .retrieve()
            .bodyToMono(VerifyResponse::class.java)
            .map { it.success }
            .onErrorReturn(false)
    }
}