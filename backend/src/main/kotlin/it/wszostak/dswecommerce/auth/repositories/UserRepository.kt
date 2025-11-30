package it.wszostak.dswecommerce.auth.repositories

import it.wszostak.dswecommerce.auth.document.UserDocument
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface UserRepository : ReactiveMongoRepository<UserDocument, String> {
    fun findByEmail(email: String): Mono<UserDocument>
}