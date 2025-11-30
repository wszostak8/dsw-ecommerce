package it.wszostak.dswecommerce.config

import com.google.protobuf.Message
import org.springframework.core.ResolvableType
import org.springframework.core.codec.Decoder
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.util.MimeType
import org.reactivestreams.Publisher
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.io.IOException

class ProtobufDecoder : Decoder<Message> {

    override fun getDecodableMimeTypes(): List<MimeType> {
        return listOf(MimeType.valueOf("application/x-protobuf"))
    }

    override fun canDecode(elementType: ResolvableType, mimeType: MimeType?): Boolean {
        return Message::class.java.isAssignableFrom(elementType.toClass()) &&
                getDecodableMimeTypes().any { it.isCompatibleWith(mimeType) }
    }

    override fun decodeToMono(
        inputStream: Publisher<DataBuffer>,
        elementType: ResolvableType,
        mimeType: MimeType?,
        hints: MutableMap<String, Any>?
    ): Mono<Message> {
        return DataBufferUtils.join(inputStream)
            .map { dataBuffer ->
                try {
                    val parser = elementType.toClass().getMethod("parser").invoke(null)

                    val parseMethod = parser.javaClass.getMethod("parseFrom", ByteArray::class.java)

                    val bytes = ByteArray(dataBuffer.readableByteCount())
                    dataBuffer.read(bytes)

                    parseMethod.invoke(parser, bytes) as Message
                } catch (e: Exception) {
                    throw IOException("Błąd podczas deserializacji wiadomości Protobuf", e)
                } finally {
                    DataBufferUtils.release(dataBuffer)
                }
            }
    }

    override fun decode(
        inputStream: Publisher<DataBuffer>,
        elementType: ResolvableType,
        mimeType: MimeType?,
        hints: MutableMap<String, Any>?
    ): Flux<Message> {
        return Flux.from(decodeToMono(inputStream, elementType, mimeType, hints))
    }
}