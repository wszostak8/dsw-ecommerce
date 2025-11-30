package it.wszostak.dswecommerce.ecommerce.repositories

import it.wszostak.dswecommerce.ecommerce.document.CartDocument
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface CartRepository : ReactiveMongoRepository<CartDocument, String> {
    fun findByUserId(userId: String): Mono<CartDocument>
    fun findBySessionId(sessionId: String): Mono<CartDocument>
}