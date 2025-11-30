package it.wszostak.dswecommerce.ecommerce.service

import it.wszostak.dswecommerce.ecommerce.document.CartDocument
import it.wszostak.dswecommerce.ecommerce.document.CartItem
import it.wszostak.dswecommerce.ecommerce.proto.Cart
import it.wszostak.dswecommerce.ecommerce.proto.CartResponse
import it.wszostak.dswecommerce.ecommerce.repositories.CartRepository
import it.wszostak.dswecommerce.ecommerce.repositories.ProductRepository
import it.wszostak.dswecommerce.ecommerce.utils.toProto
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Instant

@Service
class CartService(
    private val cartRepository: CartRepository,
    private val productRepository: ProductRepository
) {

    fun getCart(userId: String?, sessionId: String?): Mono<CartResponse> {
        return findOrCreateCart(userId, sessionId)
            .flatMap { cartDocument -> enrichCartWithProductDetails(cartDocument) }
            .map { protoCart -> successResponse(protoCart) }
    }

    fun addItem(userId: String?, sessionId: String?, productId: Long, quantity: Int): Mono<CartResponse> {
        return productRepository.findByProductId(productId)
            .flatMap { product ->
                findOrCreateCart(userId, sessionId)
                    .flatMap { cart ->
                        val updatedItems = cart.items.toMutableList()
                        val existingItem = updatedItems.find { it.productId == productId }

                        if (existingItem != null) {
                            val index = updatedItems.indexOf(existingItem)
                            updatedItems[index] = existingItem.copy(quantity = existingItem.quantity + quantity)
                        } else {
                            updatedItems.add(CartItem(
                                productId = productId,
                                quantity = quantity,
                                price = product.price
                            ))
                        }
                        cartRepository.save(cart.copy(items = updatedItems, updatedAt = Instant.now()))
                    }
            }
            .flatMap { cartDocument -> enrichCartWithProductDetails(cartDocument) }
            .map { protoCart -> successResponse(protoCart) }
            .switchIfEmpty(Mono.just(errorResponse("PRODUCT_NOT_FOUND")))
    }

    fun updateItemQuantity(userId: String?, sessionId: String?, productId: Long, newQuantity: Int): Mono<CartResponse> {
        if (newQuantity <= 0) {
            return removeItem(userId, sessionId, productId)
        }

        return findOrCreateCart(userId, sessionId)
            .flatMap { cart ->
                if (cart.items.none { it.productId == productId }) {
                    return@flatMap Mono.just(errorResponse("PRODUCT_NOT_IN_CART"))
                }

                val updatedItems = cart.items.map {
                    if (it.productId == productId) it.copy(quantity = newQuantity) else it
                }
                cartRepository.save(cart.copy(items = updatedItems, updatedAt = Instant.now()))
                    .flatMap { savedCart -> enrichCartWithProductDetails(savedCart) }
                    .map { protoCart -> successResponse(protoCart) }
            }
    }

    fun removeItem(userId: String?, sessionId: String?, productId: Long): Mono<CartResponse> {
        return findOrCreateCart(userId, sessionId)
            .flatMap { cart ->
                val updatedItems = cart.items.filter { it.productId != productId }
                cartRepository.save(cart.copy(items = updatedItems, updatedAt = Instant.now()))
            }
            .flatMap { cartDocument -> enrichCartWithProductDetails(cartDocument) }
            .map { protoCart -> successResponse(protoCart) }
    }

    fun mergeCarts(userId: String, sessionId: String): Mono<CartResponse> {
        val guestCartMono = cartRepository.findBySessionId(sessionId)
        val userCartMono = findOrCreateCart(userId, null)

        return userCartMono.flatMap { userCart ->
            guestCartMono.flatMap { guestCart ->
                val mergedItems = (userCart.items + guestCart.items)
                    .groupBy { it.productId }
                    .mapValues { (_, items) -> items.reduce { acc, item -> acc.copy(quantity = acc.quantity + item.quantity) } }
                    .values.toList()

                val finalCart = userCart.copy(items = mergedItems, updatedAt = Instant.now())
                cartRepository.save(finalCart)
                    .flatMap { savedCart -> cartRepository.delete(guestCart).thenReturn(savedCart) }
            }.defaultIfEmpty(userCart)
        }
            .flatMap { cartDocument -> enrichCartWithProductDetails(cartDocument) }
            .map { protoCart -> successResponse(protoCart) }
    }

    fun clearCart(userId: String?, sessionId: String?): Mono<CartResponse> {
        return findOrCreateCart(userId, sessionId)
            .flatMap { cart ->
                if (cart.items.isEmpty()) {
                    return@flatMap Mono.just(cart)
                }
                cartRepository.save(cart.copy(items = emptyList(), updatedAt = Instant.now()))
            }
            .flatMap { clearedCartDoc -> enrichCartWithProductDetails(clearedCartDoc) }
            .map { protoCart -> successResponse(protoCart) }
    }

    private fun findOrCreateCart(userId: String?, sessionId: String?): Mono<CartDocument> {
        val cartFinder = when {
            userId != null -> cartRepository.findByUserId(userId)
            sessionId != null -> cartRepository.findBySessionId(sessionId)
            else -> Mono.empty()
        }
        return cartFinder.switchIfEmpty(Mono.defer {
            cartRepository.save(createEmptyCart(userId, sessionId))
        })
    }

    private fun enrichCartWithProductDetails(cartDoc: CartDocument): Mono<Cart> {
        if (cartDoc.items.isEmpty()) {
            return Mono.just(toProto(cartDoc, emptyList()))
        }
        return Flux.fromIterable(cartDoc.items)
            .flatMap { cartItem ->
                productRepository.findByProductId(cartItem.productId)
                    .map { productDoc -> cartItem.toProto(productDoc) }
                    .switchIfEmpty(Mono.empty())
            }
            .collectList()
            .map { protoItems ->
                toProto(cartDoc, protoItems)
            }
    }

    private fun createEmptyCart(userId: String?, sessionId: String?): CartDocument {
        val now = Instant.now()
        return CartDocument(userId = userId, sessionId = sessionId, items = emptyList(), createdAt = now, updatedAt = now)
    }

    private fun successResponse(cart: Cart): CartResponse =
        CartResponse.newBuilder().setSuccess(true).setCart(cart).build()

    private fun errorResponse(errorCode: String): CartResponse =
        CartResponse.newBuilder().setSuccess(false).setErrorCode(errorCode).build()
}