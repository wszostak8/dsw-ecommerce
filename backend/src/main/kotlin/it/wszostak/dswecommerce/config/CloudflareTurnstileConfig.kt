package it.wszostak.dswecommerce.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "security.turnstile")
class TurnstileProperties {
    lateinit var secret: String
}
