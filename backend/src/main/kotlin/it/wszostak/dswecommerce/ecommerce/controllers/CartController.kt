package it.wszostak.dswecommerce.ecommerce.controllers

import it.wszostak.dswecommerce.ecommerce.proto.AddItemRequest
import it.wszostak.dswecommerce.ecommerce.proto.CartResponse
import it.wszostak.dswecommerce.ecommerce.proto.UpdateItemQuantityRequest
import it.wszostak.dswecommerce.ecommerce.service.CartService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import java.security.Principal

@RestController
@RequestMapping("/api/cart")
class CartController(private val cartService: CartService) {

    @GetMapping(produces = ["application/x-protobuf"])
    fun getCart(
        @AuthenticationPrincipal principal: Principal?,
        @CookieValue("guest-cart-id", required = false) sessionId: String?
    ): Mono<ResponseEntity<CartResponse>> {
        val userId = principal?.name
        return cartService.getCart(userId, sessionId)
            .map { ResponseEntity.ok(it) }
    }

    @PostMapping(
        "/items",
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun addItem(
        @RequestBody request: AddItemRequest,
        @AuthenticationPrincipal principal: Principal?,
        @CookieValue("guest-cart-id", required = false) sessionId: String?
    ): Mono<ResponseEntity<CartResponse>> {
        val userId = principal?.name
        return cartService.addItem(userId, sessionId, request.productId, request.quantity)
            .map { ResponseEntity.ok(it) }
    }

    @PutMapping(
        "/items/{productId}",
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun updateItemQuantity(
        @PathVariable productId: Long,
        @RequestBody(required = false) request: UpdateItemQuantityRequest?,
        @AuthenticationPrincipal principal: Principal?,
        @CookieValue("guest-cart-id", required = false) sessionId: String?
    ): Mono<ResponseEntity<CartResponse>> {
        val userId = principal?.name

        val quantity = request?.newQuantity ?: 0

        return cartService.updateItemQuantity(userId, sessionId, productId, quantity)
            .map { ResponseEntity.ok(it) }
    }

    @DeleteMapping(
        "/items/{productId}",
        produces = ["application/x-protobuf"]
    )
    fun removeItem(
        @PathVariable productId: Long,
        @AuthenticationPrincipal principal: Principal?,
        @CookieValue("guest-cart-id", required = false) sessionId: String?
    ): Mono<ResponseEntity<CartResponse>> {
        val userId = principal?.name
        return cartService.removeItem(userId, sessionId, productId)
            .map { ResponseEntity.ok(it) }
    }

    @PostMapping(
        "/merge",
        produces = ["application/x-protobuf"]
    )
    @PreAuthorize("isAuthenticated()")
    fun mergeCart(
        @AuthenticationPrincipal principal: Principal,
        @CookieValue("guest-cart-id") sessionId: String
    ): Mono<ResponseEntity<CartResponse>> {
        return cartService.mergeCarts(principal.name, sessionId)
            .map { ResponseEntity.ok(it) }
    }

    @DeleteMapping(produces = ["application/x-protobuf"])
    fun clearCart(
        @AuthenticationPrincipal principal: Principal?,
        @CookieValue("guest-cart-id", required = false) sessionId: String?
    ): Mono<ResponseEntity<CartResponse>> {
        val userId = principal?.name
        return cartService.clearCart(userId, sessionId)
            .map { ResponseEntity.ok(it) }
    }
}