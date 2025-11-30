package it.wszostak.dswecommerce.ecommerce.repositories

import it.wszostak.dswecommerce.ecommerce.document.ProductDocument
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface ProductRepository : ReactiveMongoRepository<ProductDocument, String> {
    fun existsByCode(code: String): Mono<Boolean>
    fun existsByEan(ean: String): Mono<Boolean>
    fun findByProductId(productId: Long): Mono<ProductDocument>
    fun deleteByProductId(productId: Long): Mono<Void>
}