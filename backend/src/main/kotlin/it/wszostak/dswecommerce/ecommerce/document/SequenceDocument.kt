package it.wszostak.dswecommerce.ecommerce.document

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "sequences")
data class SequenceDocument(
    @Id val id: String, // Nazwa licznika, np. "products_sequence"
    val value: Long
)