package it.wszostak.dswecommerce.ecommerce.service

import it.wszostak.dswecommerce.auth.repositories.UserRepository
import it.wszostak.dswecommerce.ecommerce.document.OrderDocument
import it.wszostak.dswecommerce.ecommerce.enums.OrderStatus
import it.wszostak.dswecommerce.ecommerce.proto.OrderStatus as ProtoOrderStatus
import it.wszostak.dswecommerce.ecommerce.proto.CreateOrderRequest
import it.wszostak.dswecommerce.ecommerce.proto.Order
import it.wszostak.dswecommerce.ecommerce.proto.OrderResponse
import it.wszostak.dswecommerce.ecommerce.repositories.CartRepository
import it.wszostak.dswecommerce.ecommerce.repositories.OrderRepository
import it.wszostak.dswecommerce.ecommerce.repositories.ProductRepository
import it.wszostak.dswecommerce.ecommerce.utils.toDocument
import it.wszostak.dswecommerce.ecommerce.utils.toOrderProto
import it.wszostak.dswecommerce.ecommerce.utils.toProto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Instant

@Service
class OrderService(
    private val orderRepository: OrderRepository,
    private val cartRepository: CartRepository,
    private val productRepository: ProductRepository,
    private val userRepository: UserRepository,
    private val sequenceGenerator: SequenceGeneratorService
) {

    @Transactional
    fun createOrder(request: CreateOrderRequest, currentUserId: String?, sessionId: String?): Mono<OrderResponse> {
        val cartFinder = when {
            currentUserId != null -> cartRepository.findByUserId(currentUserId)
            sessionId != null -> cartRepository.findBySessionId(sessionId)
            else -> Mono.empty()
        }

        return cartFinder
            .switchIfEmpty(Mono.error(IllegalArgumentException("CART_NOT_FOUND")))
            .flatMap { cart ->
                if (cart.items.isEmpty()) {
                    return@flatMap Mono.error(IllegalArgumentException("CART_IS_EMPTY"))
                }

                val totalAmount = cart.items.sumOf { it.price * it.quantity }
                val orderAddress = request.address.toDocument()

                // Szukamy usera po emailu, jeśli zamawia gość
                val orderOwnerMono: Mono<String> = if (currentUserId != null) {
                    Mono.just(currentUserId)
                } else {
                    userRepository.findByEmail(orderAddress.email)
                        .map { user -> user.id ?: "" }
                        .defaultIfEmpty("")
                }

                Mono.zip(orderOwnerMono, sequenceGenerator.getNextOrderNumber())
                    .flatMap { tuple ->
                        val resolvedUserId = tuple.t1
                        val generatedOrderId = tuple.t2
                        val finalUserId = resolvedUserId.ifEmpty { null }

                        val newOrder = OrderDocument(
                            orderId = generatedOrderId,
                            userId = finalUserId,
                            items = cart.items,
                            address = orderAddress,
                            totalAmount = totalAmount,
                            status = OrderStatus.PENDING,
                            createdAt = Instant.now(),
                            updatedAt = Instant.now()
                        )

                        orderRepository.save(newOrder)
                            .flatMap { savedOrder ->
                                val clearedCart = cart.copy(items = emptyList(), updatedAt = Instant.now())
                                cartRepository.save(clearedCart).thenReturn(savedOrder)
                            }
                    }
            }
            .flatMap { savedOrder -> enrichOrderWithDetails(savedOrder) }
            .map { protoOrder ->
                OrderResponse.newBuilder().setSuccess(true).setOrder(protoOrder).build()
            }
            .onErrorResume { e ->
                val errorCode = e.message ?: "ORDER_CREATION_FAILED"
                Mono.just(OrderResponse.newBuilder().setSuccess(false).setErrorCode(errorCode).build())
            }
    }

    fun getOrders(userId: String, isAdmin: Boolean): Flux<Order> {
        val ordersFlux = if (isAdmin) {
            orderRepository.findAllByOrderByCreatedAtDesc()
        } else {
            orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
        }

        return ordersFlux.flatMap { orderDoc -> enrichOrderWithDetails(orderDoc) }
    }

    fun getOrder(orderId: String, userId: String?, isAdmin: Boolean): Mono<Order> {
        return orderRepository.findByOrderId(orderId)
            .filter { order ->
                isAdmin || (userId != null && order.userId == userId)
            }
            .flatMap { orderDoc -> enrichOrderWithDetails(orderDoc) }
    }

    private fun enrichOrderWithDetails(orderDoc: OrderDocument): Mono<Order> {
        if (orderDoc.items.isEmpty()) {
            return Mono.just(orderDoc.toProto(emptyList()))
        }
        return Flux.fromIterable(orderDoc.items)
            .flatMap { cartItem ->
                productRepository.findByProductId(cartItem.productId)
                    .map { productDoc -> cartItem.toOrderProto(productDoc) }
                    .defaultIfEmpty(cartItem.toOrderProto(null))
            }
            .collectList()
            .map { protoItems -> orderDoc.toProto(protoItems) }
    }

    @Transactional
    fun updateOrderStatus(orderId: String, status: ProtoOrderStatus): Mono<OrderResponse> {
        return orderRepository.findByOrderId(orderId)
            .switchIfEmpty(orderRepository.findByOrderId(orderId))
            .flatMap { orderDoc ->
                val domainStatus = try {
                    OrderStatus.valueOf(status.name)
                } catch (e: IllegalArgumentException) {
                    return@flatMap Mono.error(IllegalArgumentException("INVALID_STATUS"))
                }

                val updatedOrder = orderDoc.copy(
                    status = domainStatus,
                    updatedAt = Instant.now()
                )

                orderRepository.save(updatedOrder)
            }
            .flatMap { savedOrder -> enrichOrderWithDetails(savedOrder) }
            .map { protoOrder ->
                OrderResponse.newBuilder()
                    .setSuccess(true)
                    .setOrder(protoOrder)
                    .build()
            }
            .onErrorResume { e ->
                Mono.just(
                    OrderResponse.newBuilder()
                        .setSuccess(false)
                        .setErrorCode(e.message ?: "UPDATE_STATUS_FAILED")
                        .build()
                )
            }
            .switchIfEmpty(
                Mono.just(
                    OrderResponse.newBuilder()
                        .setSuccess(false)
                        .setErrorCode("ORDER_NOT_FOUND")
                        .build()
                )
            )
    }
}