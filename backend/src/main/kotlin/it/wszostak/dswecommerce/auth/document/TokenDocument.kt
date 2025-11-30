package it.wszostak.dswecommerce.auth.document

import it.wszostak.dswecommerce.auth.enums.Token
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "tokens")
data class TokenDocument(
    @Id val id: String? = null,
    val userId: String,
    val type: Token,
    val token: String,
    val expiresAt: Instant
)