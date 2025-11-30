package it.wszostak.dswecommerce.ecommerce.repositories

import it.wszostak.dswecommerce.ecommerce.document.OrderDocument
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface OrderRepository : ReactiveMongoRepository<OrderDocument, String> {
    fun findAllByUserIdOrderByCreatedAtDesc(userId: String): Flux<OrderDocument>
    fun findAllByOrderByCreatedAtDesc(): Flux<OrderDocument>
    fun findByOrderId(orderId: String): Mono<OrderDocument>
}