package it.wszostak.dswecommerce.ecommerce.controllers

import it.wszostak.dswecommerce.ecommerce.proto.AddressResponse
import it.wszostak.dswecommerce.ecommerce.proto.CreateAddressRequest
import it.wszostak.dswecommerce.ecommerce.proto.UpdateAddressRequest
import it.wszostak.dswecommerce.ecommerce.service.AddressService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import java.security.Principal

@RestController
@RequestMapping("/api/address")
class AddressController(private val addressService: AddressService) {

    @PostMapping(
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    @PreAuthorize("isAuthenticated()")
    fun createAddress(
        @RequestBody request: CreateAddressRequest,
        @AuthenticationPrincipal principal: Principal
    ): Mono<ResponseEntity<AddressResponse>> {
        val userId = principal.name
        return addressService.createAddress(request, userId)
            .map { response -> ResponseEntity.ok(response) }
    }

    @PutMapping(
        "/{id}",
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    @PreAuthorize("isAuthenticated()")
    fun updateAddress(
        @PathVariable id: String,
        @RequestBody request: UpdateAddressRequest,
        @AuthenticationPrincipal principal: Principal
    ): Mono<ResponseEntity<AddressResponse>> {
        val userId = principal.name

        return addressService.updateAddress(request, userId)
            .map { response -> ResponseEntity.ok(response) }
    }

    @GetMapping(
        "/me",
        produces = ["application/x-protobuf"]
    )
    @PreAuthorize("isAuthenticated()")
    fun getMyAddress(
        @AuthenticationPrincipal principal: Principal
    ): Mono<ResponseEntity<AddressResponse>> {
        val userId = principal.name
        return addressService.getAddressByUserId(userId)
            .map { response -> ResponseEntity.ok(response) }
    }

    @GetMapping(
        "/{id}",
        produces = ["application/x-protobuf"]
    )
    @PreAuthorize("hasRole('ADMIN')")
    fun getAddressById(@PathVariable id: String): Mono<ResponseEntity<AddressResponse>> {
        return addressService.getAddressById(id)
            .map { address ->
                val response = AddressResponse.newBuilder()
                    .setSuccess(true)
                    .setAddress(address)
                    .build()
                ResponseEntity.ok(response)
            }
            .defaultIfEmpty(ResponseEntity.notFound().build())
    }
}