package it.wszostak.dswecommerce.ecommerce.repositories

import it.wszostak.dswecommerce.ecommerce.document.AddressDocument
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface AddressRepository : ReactiveMongoRepository<AddressDocument, String> {
    fun findByUserId(userId: String): Mono<AddressDocument>
}