package it.wszostak.dswecommerce.ecommerce.utils

import it.wszostak.dswecommerce.ecommerce.document.AddressDocument
import it.wszostak.dswecommerce.ecommerce.proto.Address

fun AddressDocument.toProto(): Address {
    return Address.newBuilder()
        .setId(this.id ?: "")
        .setUserId(this.userId)
        .setFirstName(this.firstName)
        .setLastName(this.lastName)
        .setEmail(this.email)
        .setPhoneNumber(this.phoneNumber)
        .setStreet(this.street)
        .setHouseNumber(this.houseNumber)
        .setFlatNumber(this.flatNumber)
        .setZipCode(this.zipCode)
        .setCity(this.city)
        .setCountry(this.country)
        .build()
}