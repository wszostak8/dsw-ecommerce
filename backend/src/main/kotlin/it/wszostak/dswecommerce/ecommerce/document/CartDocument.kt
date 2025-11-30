package it.wszostak.dswecommerce.ecommerce.document

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "carts")
data class CartDocument (
    @Id val id: String? = null,
    @Indexed(unique = true, sparse = true) val userId: String? = null,
    @Indexed(unique = true, sparse = true) val sessionId: String? = null,
    val items: List<CartItem>,
    val createdAt: Instant,
    val updatedAt: Instant,
)

// klasa pomocnicza
data class CartItem(
    @Id val id: String? = null,
    val productId: Long,
    val quantity: Int,
    val price: Double,
)