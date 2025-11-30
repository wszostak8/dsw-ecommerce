package it.wszostak.dswecommerce.auth.controller

import it.wszostak.dswecommerce.auth.proto.AuthProto.*
import it.wszostak.dswecommerce.auth.service.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping(
        "/register",
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun register(@RequestBody request: RegisterRequest): Mono<ResponseEntity<RegisterResponse>> {
        return authService.register(request).map { response -> ResponseEntity.ok(response) }
    }

    @PostMapping(
        "/login",
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun login(@RequestBody request: LoginRequest, exchange: ServerWebExchange): Mono<ResponseEntity<LoginResponse>> {
        return authService.login(request, exchange).map { response -> ResponseEntity.ok(response) }
    }

    @PostMapping(
        "/refresh",
        produces = ["application/x-protobuf"]
    )
    fun refreshToken(exchange: ServerWebExchange): Mono<ResponseEntity<LoginResponse>> {
        return authService.refreshToken(exchange).map { response -> ResponseEntity.ok(response) }
    }

    @PostMapping(
        "/logout",
        produces = ["application/x-protobuf"]
    )
    fun logout(exchange: ServerWebExchange): Mono<ResponseEntity<LogoutResponse>> {
        return authService.logout(exchange).map { response -> ResponseEntity.ok(response) }
    }

    @PostMapping(
        "/password/request-reset",
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun requestPasswordReset(@RequestBody request: PasswordResetRequest): Mono<ResponseEntity<PasswordResetResponse>> {
        return authService.requestPasswordReset(request).map { response -> ResponseEntity.ok(response) }
    }

    @PostMapping(
        "/password/verify-code",
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun verifyPasswordResetCode(@RequestBody request: VerifyPasswordResetCodeRequest): Mono<ResponseEntity<VerifyPasswordResetCodeResponse>> {
        return authService.verifyPasswordResetCode(request).map { response -> ResponseEntity.ok(response) }
    }

    @PostMapping(
        "/password/perform-reset",
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun performPasswordReset(@RequestBody request: PerformPasswordResetRequest): Mono<ResponseEntity<PerformPasswordResetResponse>> {
        return authService.performPasswordReset(request).map { response -> ResponseEntity.ok(response) }
    }
}