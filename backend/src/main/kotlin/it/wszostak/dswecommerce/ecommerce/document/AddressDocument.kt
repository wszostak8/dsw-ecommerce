package it.wszostak.dswecommerce.ecommerce.document

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "address")
data class AddressDocument(
    @Id val id: String? = null,
    val userId: String,
    val firstName: String,
    val lastName: String,
    val email: String,
    val phoneNumber: String,
    val street: String,
    val houseNumber: String,
    val flatNumber: String,
    val zipCode: String,
    val city: String,
    val country: String,
    val createdAt: Instant,
    val updatedAt: Instant,
)