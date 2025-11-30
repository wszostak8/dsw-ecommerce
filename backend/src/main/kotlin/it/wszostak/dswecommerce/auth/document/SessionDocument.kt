package it.wszostak.dswecommerce.auth.document

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "sessions")
data class SessionDocument(
    @Id val id: String? = null,
    val userId: String,
    val currentRefreshTokenId: String,
    val expiresAt: Instant,
    val ipAddress: String?,
    val userAgent: String?,
    val impersonatorUserId: String? = null,
    val createdAt: Instant = Instant.now()
)