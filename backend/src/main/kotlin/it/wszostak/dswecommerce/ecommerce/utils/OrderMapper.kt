package it.wszostak.dswecommerce.ecommerce.utils

import it.wszostak.dswecommerce.ecommerce.document.CartItem
import it.wszostak.dswecommerce.ecommerce.document.OrderAddress
import it.wszostak.dswecommerce.ecommerce.document.OrderDocument
import it.wszostak.dswecommerce.ecommerce.document.ProductDocument
import it.wszostak.dswecommerce.ecommerce.proto.Order
import it.wszostak.dswecommerce.ecommerce.proto.OrderItem
import java.time.Instant
import it.wszostak.dswecommerce.ecommerce.proto.OrderAddress as ProtoAddress
import it.wszostak.dswecommerce.ecommerce.proto.OrderStatus as ProtoOrderStatus

fun ProtoAddress.toDocument(): OrderAddress {
    return OrderAddress(
        firstName = this.firstName,
        lastName = this.lastName,
        email = this.email,
        phoneNumber = this.phoneNumber,
        street = this.street,
        houseNumber = this.houseNumber,
        flatNumber = this.flatNumber,
        zipCode = this.zipCode,
        city = this.city,
        country = this.country,
        createdAt = Instant.now(),
        updatedAt = Instant.now()
    )
}

fun OrderAddress.toProto(): ProtoAddress {
    return ProtoAddress.newBuilder()
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

fun CartItem.toOrderProto(product: ProductDocument?): OrderItem {
    return OrderItem.newBuilder()
        .setProductId(this.productId)
        .setProductName(product?.productName ?: "Brak nazwy")
        .setImageUrl(product?.images?.firstOrNull() ?: "")
        .setQuantity(this.quantity)
        .setPrice(this.price)
        .build()
}

fun OrderDocument.toProto(protoItems: List<OrderItem>): Order {
    return Order.newBuilder()
        .setOrderId(this.orderId)
        .setUserId(this.userId ?: "")
        .setStatus(ProtoOrderStatus.valueOf(this.status.name))
        .setTotalAmount(this.totalAmount)
        .setCreatedAt(this.createdAt.toString())
        .setAddress(this.address.toProto())
        .addAllItems(protoItems)
        .build()
}