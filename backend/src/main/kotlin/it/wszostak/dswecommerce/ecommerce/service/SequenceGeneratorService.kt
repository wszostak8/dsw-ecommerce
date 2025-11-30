package it.wszostak.dswecommerce.ecommerce.service

import it.wszostak.dswecommerce.ecommerce.document.SequenceDocument
import org.springframework.data.mongodb.core.FindAndModifyOptions
import org.springframework.data.mongodb.core.ReactiveMongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.Update
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class SequenceGeneratorService(private val mongoTemplate: ReactiveMongoTemplate) {

    fun getNextProductId(): Mono<Long> {
        return getNextSequence("products_sequence")
    }

    fun getNextOrderNumber(): Mono<String> {
        return getNextSequence("orders_sequence")
            .map { "ZAM-$it" }
    }

    private fun getNextSequence(seqName: String): Mono<Long> {
        val query = Query(Criteria.where("_id").`is`(seqName))
        val update = Update().inc("value", 1)
        val options = FindAndModifyOptions.options().returnNew(true).upsert(true)

        return mongoTemplate.findAndModify(query, update, options, SequenceDocument::class.java)
            .map { it.value }
    }
}