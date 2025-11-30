package it.wszostak.dswecommerce.auth.repositories

import it.wszostak.dswecommerce.auth.document.TokenDocument
import it.wszostak.dswecommerce.auth.enums.Token
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import reactor.core.publisher.Mono

interface TokenRepository : ReactiveMongoRepository<TokenDocument, String> {
    fun findByUserIdAndType(userId: String, type: Token): Mono<TokenDocument>
    fun deleteAllByUserIdAndType(userId: String, type: Token): Mono<Void>
}