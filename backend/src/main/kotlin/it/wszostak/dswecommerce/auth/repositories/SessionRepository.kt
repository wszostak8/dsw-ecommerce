package it.wszostak.dswecommerce.auth.repositories

import it.wszostak.dswecommerce.auth.document.SessionDocument
import org.springframework.data.mongodb.repository.ReactiveMongoRepository

interface SessionRepository : ReactiveMongoRepository<SessionDocument, String> {
}