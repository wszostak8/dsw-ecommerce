package it.wszostak.dswecommerce.ecommerce.service

import it.wszostak.dswecommerce.ecommerce.document.AddressDocument
import it.wszostak.dswecommerce.ecommerce.proto.Address
import it.wszostak.dswecommerce.ecommerce.proto.AddressResponse
import it.wszostak.dswecommerce.ecommerce.proto.CreateAddressRequest
import it.wszostak.dswecommerce.ecommerce.proto.UpdateAddressRequest
import it.wszostak.dswecommerce.ecommerce.repositories.AddressRepository
import it.wszostak.dswecommerce.ecommerce.utils.toProto
import org.springframework.dao.DuplicateKeyException
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import java.time.Instant

@Service
class AddressService(
    private val addressRepository: AddressRepository
) {

    fun createAddress(request: CreateAddressRequest, userId: String): Mono<AddressResponse> {
        val addressProto = request.address

        val newAddressDoc = AddressDocument(
            userId = userId,
            firstName = addressProto.firstName,
            lastName = addressProto.lastName,
            email = addressProto.email,
            phoneNumber = addressProto.phoneNumber,
            street = addressProto.street,
            houseNumber = addressProto.houseNumber,
            flatNumber = addressProto.flatNumber,
            zipCode = addressProto.zipCode,
            city = addressProto.city,
            country = addressProto.country,
            createdAt = Instant.now(),
            updatedAt = Instant.now()
        )

        return addressRepository.save(newAddressDoc)
            .map { savedAddress ->
                AddressResponse.newBuilder()
                    .setSuccess(true)
                    .setAddress(savedAddress.toProto())
                    .build()
            }
            .onErrorResume {
                Mono.just(
                    AddressResponse.newBuilder()
                        .setSuccess(false)
                        .setErrorCode("ADDRESS_CREATION_FAILED")
                        .build()
                )
            }
    }

    fun updateAddress(request: UpdateAddressRequest, userId: String): Mono<AddressResponse> {
        val addressProto = request.address
        val requestId = request.id

        if (requestId != addressProto.id && addressProto.id.isNotEmpty()) {
            return Mono.just(
                AddressResponse.newBuilder()
                    .setSuccess(false)
                    .setErrorCode("ID_MISMATCH")
                    .build()
            )
        }

        return addressRepository.findById(requestId)
            .flatMap { existingAddress ->
                if (existingAddress.userId != userId) {
                    return@flatMap Mono.error(IllegalAccessException("ACCESS_DENIED"))
                }

                val updatedAddress = existingAddress.copy(
                    firstName = addressProto.firstName,
                    lastName = addressProto.lastName,
                    email = addressProto.email,
                    phoneNumber = addressProto.phoneNumber,
                    street = addressProto.street,
                    houseNumber = addressProto.houseNumber,
                    flatNumber = addressProto.flatNumber,
                    zipCode = addressProto.zipCode,
                    city = addressProto.city,
                    country = addressProto.country,
                    updatedAt = Instant.now()
                )
                addressRepository.save(updatedAddress)
            }
            .map { savedAddress ->
                AddressResponse.newBuilder()
                    .setSuccess(true)
                    .setAddress(savedAddress.toProto())
                    .build()
            }
            .onErrorResume { exception ->
                val errorCode = when (exception) {
                    is IllegalAccessException -> "ACCESS_DENIED"
                    is DuplicateKeyException -> "DUPLICATE_KEY"
                    else -> "ADDRESS_UPDATE_FAILED"
                }
                Mono.just(
                    AddressResponse.newBuilder()
                        .setSuccess(false)
                        .setErrorCode(errorCode)
                        .build()
                )
            }
            .switchIfEmpty(
                Mono.just(
                    AddressResponse.newBuilder()
                        .setSuccess(false)
                        .setErrorCode("ADDRESS_NOT_FOUND")
                        .build()
                )
            )
    }

    fun getAddressByUserId(userId: String): Mono<AddressResponse> {
        return addressRepository.findByUserId(userId)
            .map { addressDoc ->
                AddressResponse.newBuilder()
                    .setSuccess(true)
                    .setAddress(addressDoc.toProto())
                    .build()
            }
            .switchIfEmpty(
                Mono.just(
                    AddressResponse.newBuilder()
                        .setSuccess(false)
                        .setErrorCode("ADDRESS_NOT_FOUND")
                        .build()
                )
            )
    }

    fun getAddressById(id: String): Mono<Address> {
        return addressRepository.findById(id).map { it.toProto() }
    }
}