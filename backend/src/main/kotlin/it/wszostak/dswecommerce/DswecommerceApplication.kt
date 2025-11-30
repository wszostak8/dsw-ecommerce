package it.wszostak.dswecommerce

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableAsync

@SpringBootApplication(exclude = [JacksonAutoConfiguration::class])
@EnableAsync
class DswecommerceApplication

fun main(args: Array<String>) {
	runApplication<DswecommerceApplication>(*args)
}
