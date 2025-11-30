package it.wszostak.dswecommerce.ecommerce.controllers

import it.wszostak.dswecommerce.ecommerce.proto.*
import it.wszostak.dswecommerce.ecommerce.service.ProductService
import org.springframework.http.ResponseEntity
import org.springframework.http.codec.multipart.FilePart
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.security.Principal

@RestController
@RequestMapping("/api/products")
class ProductController(private val productService: ProductService) {

    @PostMapping(
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    @PreAuthorize("hasRole('ADMIN')")
    fun createProduct(
        @RequestBody request: CreateProductRequest,
        @AuthenticationPrincipal principal: Principal
    ): Mono<ResponseEntity<ProductResponse>> {
        val adminId = principal.name
        return productService.createProduct(request, adminId)
            .map { response -> ResponseEntity.ok(response) }
    }

    @PostMapping(
        consumes = ["multipart/form-data"],
        produces = ["application/x-protobuf"]
    )
    @PreAuthorize("hasRole('ADMIN')")
    fun createProductWithImages(
        @RequestPart("product") request: CreateProductRequest,
        @RequestPart("images") images: Flux<FilePart>,
        @AuthenticationPrincipal principal: Principal
    ): Mono<ResponseEntity<ProductResponse>> {
        val adminId = principal.name
        return productService.createProductWithImages(request, images, adminId)
            .map { response -> ResponseEntity.ok(response) }
    }

    @PutMapping(
        "/{id}",
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    @PreAuthorize("hasRole('ADMIN')")
    fun updateProduct(@PathVariable id: Long, @RequestBody request: UpdateProductRequest): Mono<ResponseEntity<ProductResponse>> {
        return productService.updateProduct(id, request)
            .map { response -> ResponseEntity.ok(response) }
    }

    @DeleteMapping(
        "/{id}",
        produces = ["application/x-protobuf"]
    )
    @PreAuthorize("hasRole('ADMIN')")
    fun deleteProduct(@PathVariable id: Long): Mono<ResponseEntity<DeleteProductResponse>> {
        return productService.deleteProduct(id)
            .thenReturn(
                ResponseEntity.ok(DeleteProductResponse.newBuilder().setSuccess(true).build())
            )
    }

    @GetMapping(
        "/{id}",
        produces = ["application/x-protobuf"]
    )
    fun getProduct(@PathVariable id: Long): Mono<ResponseEntity<ProductResponse>> {
        return productService.getProductById(id)
            .map { product ->
                val response = ProductResponse.newBuilder().setSuccess(true).setProduct(product).build()
                ResponseEntity.ok(response)
            }
            .defaultIfEmpty(ResponseEntity.notFound().build())
    }

    @GetMapping(
        produces = ["application/x-protobuf"]
    )
    fun getAllProducts(): Mono<ResponseEntity<GetAllProductsResponse>> {
        return productService.getAllProducts().collectList()
            .map { productList ->
                val response = GetAllProductsResponse.newBuilder().addAllProducts(productList).build()
                ResponseEntity.ok(response)
            }
    }
}