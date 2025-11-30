package it.wszostak.dswecommerce.auth.document

import it.wszostak.dswecommerce.auth.enums.Role
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "users")
data class UserDocument(
    @Id val id: String? = null,
    val name: String,
    @Indexed(unique = true) val email: String,
    val password: String,
    val role: Role = Role.USER,
    val createdAt: Instant = Instant.now(),
)