package it.wszostak.dswecommerce.auth.service

import it.wszostak.dswecommerce.auth.document.SessionDocument
import it.wszostak.dswecommerce.auth.document.UserDocument
import it.wszostak.dswecommerce.auth.enums.Role
import it.wszostak.dswecommerce.auth.enums.Token
import it.wszostak.dswecommerce.auth.proto.AuthProto.*
import it.wszostak.dswecommerce.auth.repositories.SessionRepository
import it.wszostak.dswecommerce.auth.repositories.UserRepository
import it.wszostak.dswecommerce.auth.utils.toUserInfo
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseCookie
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import java.time.Duration
import java.time.Instant
import java.util.UUID

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val sessionRepository: SessionRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
    private val tokenService: TokenService,
    private val mailService: MailService,
    @param:Value("\${jwt.access-expiration-ms}") private val accessExpirationMs: Long,
    @param:Value("\${jwt.refresh-expiration-ms}") private val refreshExpirationMs: Long,
    @param:Value("\${jwt.cookie.secure:false}") private val secureCookie: Boolean
) {

    fun register(request: RegisterRequest): Mono<RegisterResponse> {
        return userRepository.findByEmail(request.email)
            .flatMap {
                Mono.just(RegisterResponse.newBuilder().setSuccess(false).setErrorCode("EMAIL_EXISTS").build())
            }
            .switchIfEmpty(Mono.defer {
                val userDocument = UserDocument(
                    name = request.name,
                    email = request.email,
                    password = passwordEncoder.encode(request.password),
                    role = Role.USER,
                )
                userRepository.save(userDocument)
                    .map { savedUser ->
                        RegisterResponse.newBuilder()
                            .setSuccess(true)
                            .setErrorCode("REGISTER_SUCCESS")
                            .setUser(savedUser.toUserInfo())
                            .build()
                    }
            })
    }

    fun login(request: LoginRequest, exchange: ServerWebExchange): Mono<LoginResponse> {
        return userRepository.findByEmail(request.email)
            .flatMap { user ->
                if (passwordEncoder.matches(request.password, user.password)) {
                    val refreshTokenId = UUID.randomUUID().toString()
                    val newSession = SessionDocument(
                        userId = user.id!!,
                        currentRefreshTokenId = refreshTokenId,
                        expiresAt = Instant.now().plusMillis(refreshExpirationMs),
                        ipAddress = exchange.request.remoteAddress?.address?.hostAddress,
                        userAgent = exchange.request.headers.getFirst("User-Agent")
                    )

                    sessionRepository.save(newSession).flatMap { savedSession ->
                        val accessToken = jwtService.generateAccessToken(user)
                        val refreshToken = jwtService.generateRefreshToken(user.id, refreshTokenId, savedSession.id!!)

                        setAccessTokenCookie(exchange, accessToken)
                        setRefreshTokenCookie(exchange, refreshToken)

                        Mono.just(
                            LoginResponse.newBuilder()
                                .setSuccess(true)
                                .setErrorCode("LOGIN_SUCCESS")
                                .setUser(user.toUserInfo())
                                .build()
                        )
                    }
                } else {
                    Mono.just(LoginResponse.newBuilder().setSuccess(false).setErrorCode("INVALID_PASSWORD").build())
                }
            }
            .switchIfEmpty(Mono.just(LoginResponse.newBuilder().setSuccess(false).setErrorCode("INVALID_EMAIL").build()))
    }

    fun refreshToken(exchange: ServerWebExchange): Mono<LoginResponse> {
        val oldRefreshToken = exchange.request.cookies.getFirst("refreshToken")?.value
            ?: return Mono.just(LoginResponse.newBuilder().setSuccess(false).setErrorCode("MISSING_REFRESH_TOKEN").build())

        val sessionId = jwtService.extractSessionId(oldRefreshToken)
        val tokenId = jwtService.extractTokenId(oldRefreshToken)
        if (sessionId == null || tokenId == null) {
            return Mono.just(LoginResponse.newBuilder().setSuccess(false).setErrorCode("INVALID_REFRESH_TOKEN").build())
        }

        return sessionRepository.findById(sessionId)
            .flatMap { session ->
                if (session.currentRefreshTokenId != tokenId) {
                    return@flatMap sessionRepository.delete(session)
                        .then(Mono.just(LoginResponse.newBuilder().setSuccess(false).setErrorCode("INVALID_REFRESH_TOKEN").build()))
                }
                if (session.expiresAt.isBefore(Instant.now())) {
                    return@flatMap sessionRepository.delete(session)
                        .then(Mono.just(LoginResponse.newBuilder().setSuccess(false).setErrorCode("SESSION_EXPIRED").build()))
                }

                userRepository.findById(session.userId).flatMap { user ->
                    val newRefreshTokenId = UUID.randomUUID().toString()
                    val updatedSession = session.copy(currentRefreshTokenId = newRefreshTokenId)

                    sessionRepository.save(updatedSession).flatMap { savedSession ->
                        val newAccessToken = jwtService.generateAccessToken(user)
                        val newRefreshToken = jwtService.generateRefreshToken(user.id!!, newRefreshTokenId, savedSession.id!!)

                        setAccessTokenCookie(exchange, newAccessToken)
                        setRefreshTokenCookie(exchange, newRefreshToken)

                        Mono.just(
                            LoginResponse.newBuilder()
                                .setSuccess(true)
                                .setErrorCode("REFRESH_SUCCESS")
                                .setUser(user.toUserInfo())
                                .build()
                        )
                    }
                }
            }
            .switchIfEmpty(Mono.just(LoginResponse.newBuilder().setSuccess(false).setErrorCode("INVALID_REFRESH_TOKEN").build()))
    }

    fun logout(exchange: ServerWebExchange): Mono<LogoutResponse> {
        val refreshToken = exchange.request.cookies.getFirst("refreshToken")?.value
        val sessionId = refreshToken?.let { jwtService.extractSessionId(it) }

        val deleteSessionMono = sessionId?.let { sessionRepository.deleteById(it) } ?: Mono.empty()

        val responseMono = Mono.fromRunnable<LogoutResponse> { clearCookies(exchange) }
            .thenReturn(
                LogoutResponse.newBuilder()
                    .setSuccess(true)
                    .setErrorCode("LOGOUT_SUCCESS")
                    .build()
            )

        return deleteSessionMono.then(responseMono)
    }

    private fun clearCookies(exchange: ServerWebExchange) {
        val accessCookie = ResponseCookie.from("accessToken", "").maxAge(0).path("/").build()
        val refreshCookie = ResponseCookie.from("refreshToken", "").maxAge(0).path("/api/auth").build()
        exchange.response.addCookie(accessCookie)
        exchange.response.addCookie(refreshCookie)
    }

    private fun setAccessTokenCookie(exchange: ServerWebExchange, accessToken: String) {
        val cookie = ResponseCookie.from("accessToken", accessToken)
            .httpOnly(true)
            .path("/")
            .maxAge(Duration.ofMillis(accessExpirationMs))
            .secure(secureCookie)
            .sameSite("Strict")
            .build()
        exchange.response.addCookie(cookie)
    }

    private fun setRefreshTokenCookie(exchange: ServerWebExchange, refreshToken: String) {
        val cookie = ResponseCookie.from("refreshToken", refreshToken)
            .httpOnly(true)
            .path("/api/auth")
            .maxAge(Duration.ofMillis(refreshExpirationMs))
            .secure(secureCookie)
            .sameSite("Strict")
            .build()
        exchange.response.addCookie(cookie)
    }

    fun requestPasswordReset(request: PasswordResetRequest): Mono<PasswordResetResponse> {
        return userRepository.findByEmail(request.email)
            .flatMap { user ->
                tokenService.generateAndSaveToken(user.id!!, Token.RESET_PASSWORD)
                    .flatMap { rawToken ->
                        mailService.sendPasswordResetEmail(user.email, user.name, rawToken)
                        Mono.just(
                            PasswordResetResponse.newBuilder()
                                .setSuccess(true)
                                .setErrorCode("RESET_CODE_SENT")
                                .build()
                        )
                    }
            }
            .switchIfEmpty(
                Mono.just(
                    PasswordResetResponse.newBuilder()
                        .setSuccess(false)
                        .setErrorCode("USER_NOT_FOUND")
                        .build()
                )
            )
    }

    fun verifyPasswordResetCode(request: VerifyPasswordResetCodeRequest): Mono<VerifyPasswordResetCodeResponse> {
        return userRepository.findByEmail(request.email)
            .flatMap { user ->
                tokenService.verifyAndIssueVerificationToken(user.id!!, request.token)
                    .map { verificationToken ->
                        VerifyPasswordResetCodeResponse.newBuilder()
                            .setSuccess(true)
                            .setToken(verificationToken)
                            .setErrorCode("CODE_VERIFIED")
                            .build()
                    }
            }
            .switchIfEmpty(
                Mono.just(VerifyPasswordResetCodeResponse.newBuilder().setSuccess(false).setErrorCode("INVALID_OR_EXPIRED_TOKEN").build())
            )
    }

    fun performPasswordReset(request: PerformPasswordResetRequest): Mono<PerformPasswordResetResponse> {
        return tokenService.verifyVerificationTokenAndGetUserId(request.token)
            .flatMap { userId ->
                userRepository.findById(userId)
                    .flatMap { user ->
                        val updatedUser = user.copy(password = passwordEncoder.encode(request.newPassword))
                        userRepository.save(updatedUser)
                            .thenReturn(
                                PerformPasswordResetResponse.newBuilder()
                                    .setSuccess(true)
                                    .setErrorCode("PASSWORD_RESET_SUCCESS")
                                    .build()
                            )
                    }
            }
            .switchIfEmpty(
                Mono.just(PerformPasswordResetResponse.newBuilder().setSuccess(false).setErrorCode("INVALID_OR_EXPIRED_TOKEN").build())
            )
    }
}