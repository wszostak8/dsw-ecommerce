package it.wszostak.dswecommerce.ecommerce.service

import it.wszostak.dswecommerce.ecommerce.document.ProductDocument
import it.wszostak.dswecommerce.ecommerce.enums.StatusType
import it.wszostak.dswecommerce.ecommerce.utils.toProto
import it.wszostak.dswecommerce.ecommerce.proto.CreateProductRequest
import it.wszostak.dswecommerce.ecommerce.proto.Product
import it.wszostak.dswecommerce.ecommerce.proto.ProductResponse
import it.wszostak.dswecommerce.ecommerce.proto.UpdateProductRequest
import it.wszostak.dswecommerce.ecommerce.repositories.ProductRepository
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Value
import org.springframework.dao.DuplicateKeyException
import org.springframework.http.codec.multipart.FilePart
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.nio.file.Files
import java.nio.file.Paths

@Service
class ProductService(
    private val productRepository: ProductRepository,
    private val sequenceGenerator: SequenceGeneratorService,
    @param:Value("\${file.upload-dir}") private val uploadDir: String,
    @param:Value("\${api.base-url}") private val baseUrl: String
) {

    @PostConstruct
    fun init() {
        Files.createDirectories(Paths.get(uploadDir))
    }

    private fun validateAndSaveProduct(request: CreateProductRequest, adminId: String): Mono<ProductDocument> {
        return productRepository.existsByCode(request.code)
            .flatMap { codeExists ->
                if (codeExists) Mono.error(DuplicateKeyException("PRODUCT_CODE_EXISTS"))
                else productRepository.existsByEan(request.ean)
            }
            .flatMap { eanExists ->
                if (eanExists) Mono.error(DuplicateKeyException("PRODUCT_EAN_EXISTS"))
                else {
                    sequenceGenerator.getNextProductId().flatMap { newProductId ->
                        val newProduct = ProductDocument(
                            productId = newProductId,
                            userId = adminId,
                            productName = request.productName,
                            price = request.price,
                            description = request.description,
                            stock = request.stock,
                            code = request.code,
                            ean = request.ean
                        )
                        productRepository.save(newProduct)
                    }
                }
            }
    }

    fun createProduct(request: CreateProductRequest, adminId: String): Mono<ProductResponse> {
        return validateAndSaveProduct(request, adminId)
            .map { savedProduct ->
                ProductResponse.newBuilder().setSuccess(true).setProduct(savedProduct.toProto()).build()
            }
            .onErrorResume(DuplicateKeyException::class.java) { exception ->
                Mono.just(ProductResponse.newBuilder().setSuccess(false).setErrorCode(exception.message).build())
            }
    }

    fun createProductWithImages(request: CreateProductRequest, images: Flux<FilePart>, adminId: String): Mono<ProductResponse> {
        return validateAndSaveProduct(request, adminId)
            .flatMap { savedProduct ->
                val imageUrlsMono = images.flatMap { filePart ->
                    val fileName = "${System.currentTimeMillis()}-${filePart.filename()}"
                    val physicalPath = Paths.get(uploadDir, fileName)
                    val fullPublicUrl = "$baseUrl/images/$fileName"

                    filePart.transferTo(physicalPath).thenReturn(fullPublicUrl)
                }.collectList()

                imageUrlsMono.flatMap { urls ->
                    val productWithImages = savedProduct.copy(images = urls)
                    productRepository.save(productWithImages)
                }
            }
            .map { finalProduct ->
                ProductResponse.newBuilder().setSuccess(true).setProduct(finalProduct.toProto()).build()
            }
            .onErrorResume(DuplicateKeyException::class.java) { exception ->
                Mono.just(ProductResponse.newBuilder().setSuccess(false).setErrorCode(exception.message).build())
            }
    }

    fun updateProduct(productId: Long, request: UpdateProductRequest): Mono<ProductResponse> {
        if (productId != request.id) {
            return Mono.just(ProductResponse.newBuilder().setSuccess(false).setErrorCode("ID_MISMATCH").build())
        }

        return productRepository.findByProductId(productId)
            .flatMap { existingProduct ->
                val updatedProduct = existingProduct.copy(
                    productName = request.productName,
                    price = request.price,
                    description = request.description,
                    stock = request.stock,
                    code = request.code,
                    ean = request.ean
                )
                productRepository.save(updatedProduct)
            }
            .map { savedProduct ->
                ProductResponse.newBuilder().setSuccess(true).setProduct(savedProduct.toProto()).build()
            }
            .onErrorResume(DuplicateKeyException::class.java) { exception ->
                val errorMessage = exception.message ?: ""
                val errorCode = when {
                    "code" in errorMessage -> "PRODUCT_CODE_EXISTS"
                    "ean" in errorMessage -> "PRODUCT_EAN_EXISTS"
                    else -> "DUPLICATE_KEY"
                }
                Mono.just(ProductResponse.newBuilder().setSuccess(false).setErrorCode(errorCode).build())
            }
            .switchIfEmpty(
                Mono.just(ProductResponse.newBuilder().setSuccess(false).setErrorCode("PRODUCT_NOT_FOUND").build())
            )
    }

    fun deleteProduct(id: Long): Mono<Void> {
        return productRepository.deleteByProductId(id)
    }

    fun getProductById(id: Long): Mono<Product> {
        return productRepository.findByProductId(id).map { it.toProto() }
    }

    fun getAllProducts(): Flux<Product> {
        return productRepository.findAll().map { it.toProto() }
    }
}