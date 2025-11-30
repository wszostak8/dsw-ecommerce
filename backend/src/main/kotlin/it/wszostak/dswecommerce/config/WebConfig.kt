package it.wszostak.dswecommerce.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.http.codec.ServerCodecConfigurer
import org.springframework.web.reactive.config.CorsRegistry
import org.springframework.web.reactive.config.EnableWebFlux
import org.springframework.web.reactive.config.ResourceHandlerRegistry
import org.springframework.web.reactive.config.WebFluxConfigurer
import java.nio.file.Paths

@Configuration
@EnableWebFlux
class WebConfig : WebFluxConfigurer {

    @Value("\${file.upload-dir}")
    private lateinit var uploadDir: String

    override fun configureHttpMessageCodecs(configurer: ServerCodecConfigurer) {
        configurer.customCodecs().register(ProtobufDecoder())
        configurer.customCodecs().register(ProtobufEncoder())
    }

    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOrigins(
                "https://localhost:3000",
                "https://dsw-ecommerce.wszostak.it",
                )
            .allowedMethods("*")
            .allowedHeaders("*")
            .allowCredentials(true)
    }

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        val absoluteUploadPath = Paths.get(uploadDir).toFile().absolutePath
        registry.addResourceHandler("/images/**")
            .addResourceLocations("file:$absoluteUploadPath/")
    }
}