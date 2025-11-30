package it.wszostak.dswecommerce.ecommerce.controllers

import it.wszostak.dswecommerce.ecommerce.proto.CreateOrderRequest
import it.wszostak.dswecommerce.ecommerce.proto.GetUserOrdersResponse
import it.wszostak.dswecommerce.ecommerce.proto.OrderResponse
import it.wszostak.dswecommerce.ecommerce.proto.UpdateOrderStatusRequest
import it.wszostak.dswecommerce.ecommerce.service.OrderService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import java.security.Principal

@RestController
@RequestMapping("/api/orders")
class OrderController(
    private val orderService: OrderService
) {

    @PostMapping(
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun createOrder(
        @RequestBody request: CreateOrderRequest,
        @AuthenticationPrincipal principal: Principal?,
        @CookieValue("guest-cart-id", required = false) sessionId: String?
    ): Mono<ResponseEntity<OrderResponse>> {
        val userId = principal?.name

        if (userId == null && sessionId == null) {
            return Mono.just(
                ResponseEntity.ok(
                    OrderResponse.newBuilder().setSuccess(false).setErrorCode("NO_SESSION_OR_USER").build()
                )
            )
        }

        return orderService.createOrder(request, userId, sessionId)
            .map { ResponseEntity.ok(it) }
    }

    @GetMapping(produces = ["application/x-protobuf"])
    @PreAuthorize("isAuthenticated()")
    fun getOrders(auth: Authentication): Mono<ResponseEntity<GetUserOrdersResponse>> {
        val userId = auth.name
        val isAdmin = auth.authorities.any { it.authority == "ROLE_ADMIN" }

        return orderService.getOrders(userId, isAdmin)
            .collectList()
            .map { orders ->
                ResponseEntity.ok(
                    GetUserOrdersResponse.newBuilder().addAllOrders(orders).build()
                )
            }
    }

    @GetMapping(
        "/{id}",
        produces = ["application/x-protobuf"]
    )
    @PreAuthorize("isAuthenticated()")
    fun getOrderDetails(
        @PathVariable id: String,
        auth: Authentication
    ): Mono<ResponseEntity<OrderResponse>> {
        val userId = auth.name
        val isAdmin = auth.authorities.any { it.authority == "ROLE_ADMIN" }

        return orderService.getOrder(id, userId, isAdmin)
            .map { orderProto ->
                OrderResponse.newBuilder()
                    .setSuccess(true)
                    .setOrder(orderProto)
                    .build()
            }
            .map { ResponseEntity.ok(it) }
            .defaultIfEmpty(ResponseEntity.notFound().build())
    }

    @PutMapping(
        "/{id}/status",
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    @PreAuthorize("hasRole('ADMIN')")
    fun updateOrderStatus(
        @PathVariable id: String,
        @RequestBody(required = false) request: UpdateOrderStatusRequest?
    ): Mono<ResponseEntity<OrderResponse>> {
        val safeRequest = request ?: UpdateOrderStatusRequest.getDefaultInstance()

        return orderService.updateOrderStatus(id, safeRequest.status)
            .map { ResponseEntity.ok(it) }
    }
}