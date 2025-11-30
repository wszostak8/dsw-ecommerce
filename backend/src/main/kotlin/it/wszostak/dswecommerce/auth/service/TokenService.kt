package it.wszostak.dswecommerce.auth.service

import it.wszostak.dswecommerce.auth.document.TokenDocument
import it.wszostak.dswecommerce.auth.enums.Token
import it.wszostak.dswecommerce.auth.repositories.TokenRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import java.security.SecureRandom
import java.time.Instant
import java.util.UUID

@Service
class TokenService(
    private val tokenRepository: TokenRepository,
    private val passwordEncoder: PasswordEncoder,
    @param:Value("\${token.password-reset.expiration-ms:900000}") private val expirationMs: Long,
    @param:Value("\${token.verification.expiration-ms:600000}") private val verificationExpirationMs: Long
) {
    private val secureRandom = SecureRandom()

    fun generateAndSaveToken(userId: String, type: Token): Mono<String> {
        val rawToken = String.format("%06d", secureRandom.nextInt(999999))
        val hashedToken = passwordEncoder.encode(rawToken)

        val tokenDocument = TokenDocument(
            userId = userId,
            type = type,
            token = hashedToken,
            expiresAt = Instant.now().plusMillis(expirationMs)
        )

        return tokenRepository.deleteAllByUserIdAndType(userId, type)
            .then(tokenRepository.save(tokenDocument))
            .thenReturn(rawToken)
    }

    fun verifyToken(userId: String, type: Token, rawToken: String): Mono<Boolean> {
        return tokenRepository.findByUserIdAndType(userId, type)
            .flatMap { tokenDocument ->
                if (tokenDocument.expiresAt.isBefore(Instant.now())) {
                    return@flatMap tokenRepository.delete(tokenDocument).thenReturn(false)
                }

                if (passwordEncoder.matches(rawToken, tokenDocument.token)) {
                    tokenRepository.delete(tokenDocument).thenReturn(true)
                } else {
                    Mono.just(false)
                }
            }
            .defaultIfEmpty(false)
    }

    fun verifyAndIssueVerificationToken(userId: String, rawCode: String): Mono<String> {
        return verifyToken(userId, Token.RESET_PASSWORD, rawCode)
            .flatMap { isCodeValid ->
                if (isCodeValid) {
                    val rawVerificationToken = UUID.randomUUID().toString()
                    val hashedVerificationToken = passwordEncoder.encode(rawVerificationToken)
                    val tokenDocument = TokenDocument(
                        userId = userId,
                        type = Token.RESET_PASSWORD_VERIFICATION,
                        token = hashedVerificationToken,
                        expiresAt = Instant.now().plusMillis(verificationExpirationMs)
                    )
                    tokenRepository.save(tokenDocument).thenReturn(rawVerificationToken)
                } else {
                    Mono.empty()
                }
            }
    }

    fun verifyVerificationTokenAndGetUserId(rawToken: String): Mono<String> {
        return tokenRepository.findAll()
            .filter { doc ->
                doc.type == Token.RESET_PASSWORD_VERIFICATION &&
                        passwordEncoder.matches(rawToken, doc.token)
            }
            .next()
            .flatMap { tokenDoc ->
                if (tokenDoc.expiresAt.isBefore(Instant.now())) {
                    tokenRepository.delete(tokenDoc).then(Mono.empty())
                } else {
                    tokenRepository.delete(tokenDoc).thenReturn(tokenDoc.userId)
                }
            }
    }
}