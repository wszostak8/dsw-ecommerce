package it.wszostak.dswecommerce.auth.service

import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtParser
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import it.wszostak.dswecommerce.auth.document.UserDocument
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.Date
import javax.crypto.SecretKey

@Service
class JwtService(
    @param:Value("\${jwt.secret}") private val secret: String,
    @param:Value("\${jwt.access-expiration-ms}") private val accessExpirationMs: Long,
    @param:Value("\${jwt.refresh-expiration-ms}") private val refreshExpirationMs: Long
) {
    private val signingKey: SecretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret))
    private val jwtParser: JwtParser = Jwts.parser().verifyWith(signingKey).build()

    fun generateAccessToken(user: UserDocument): String {
        val claims = mapOf(
            "name" to user.name,
            "email" to user.email,
            "role" to user.role.name
        )
        return generateToken(user.id!!, accessExpirationMs, claims)
    }

    fun generateRefreshToken(userId: String, tokenId: String, sessionId: String): String {
        val claims = mapOf(
            "tokenId" to tokenId,
            "sessionId" to sessionId
        )
        return generateToken(userId, refreshExpirationMs, claims)
    }

    private fun generateToken(userId: String, expirationMs: Long, claims: Map<String, Any>): String {
        val now = Date()
        val expiryDate = Date(now.time + expirationMs)
        return Jwts.builder()
            .subject(userId)
            .issuedAt(now)
            .expiration(expiryDate)
            .claims(claims)
            .signWith(signingKey)
            .compact()
    }

    fun extractAllClaims(token: String): Claims = jwtParser.parseSignedClaims(token).payload
    fun extractTokenId(token: String): String? = extractAllClaims(token).get("tokenId", String::class.java)
    fun extractSessionId(token: String): String? = extractAllClaims(token).get("sessionId", String::class.java)
}