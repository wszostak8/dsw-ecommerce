package it.wszostak.dswecommerce.ecommerce.document

import it.wszostak.dswecommerce.ecommerce.enums.StatusType
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "products")
data class ProductDocument(
    @Id val id: String? = null,
    @Indexed(unique = true) val productId: Long,
    val userId: String,
    val productName: String,
    val images: List<String> = emptyList(),
    val price: Double,
    val description: String,
    val stock: Number,
    @Indexed(unique = true) val code: String,
    @Indexed(unique = true) val ean: String,
    val status: StatusType = StatusType.ACTIVE,
)