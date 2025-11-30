package it.wszostak.dswecommerce.config

import com.google.protobuf.Message
import org.reactivestreams.Publisher
import org.springframework.core.ResolvableType
import org.springframework.core.codec.Encoder
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.core.io.buffer.DataBufferFactory
import org.springframework.util.MimeType
import reactor.core.publisher.Flux

class ProtobufEncoder : Encoder<Message> {

    override fun getEncodableMimeTypes(): List<MimeType> {
        return listOf(MimeType.valueOf("application/x-protobuf"))
    }

    override fun canEncode(elementType: ResolvableType, mimeType: MimeType?): Boolean {
        return Message::class.java.isAssignableFrom(elementType.toClass()) &&
                getEncodableMimeTypes().any { it.isCompatibleWith(mimeType) }
    }

    override fun encode(
        inputStream: Publisher<out Message>,
        bufferFactory: DataBufferFactory,
        elementType: ResolvableType,
        mimeType: MimeType?,
        hints: MutableMap<String, Any>?
    ): Flux<DataBuffer> {
        return Flux.from(inputStream).map { message ->
            val bytes = message.toByteArray()
            bufferFactory.wrap(bytes)
        }
    }
}