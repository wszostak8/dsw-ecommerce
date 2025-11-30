package it.wszostak.dswecommerce.ecommerce.document

import it.wszostak.dswecommerce.ecommerce.enums.OrderStatus
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "orders")
data class OrderDocument(
    @Id val id: String? = null,
    @Indexed(unique = true) val orderId: String,
    @Indexed val userId: String? = null,
    val items: List<CartItem>,
    val address: OrderAddress,
    val totalAmount: Double,
    val status: OrderStatus,
    val createdAt: Instant,
    val updatedAt: Instant,
)

data class OrderAddress(
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