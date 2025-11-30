package it.wszostak.dswecommerce.ecommerce.utils

import it.wszostak.dswecommerce.ecommerce.document.CartDocument
import it.wszostak.dswecommerce.ecommerce.document.ProductDocument
import it.wszostak.dswecommerce.ecommerce.proto.Cart
import it.wszostak.dswecommerce.ecommerce.proto.CartItem

fun it.wszostak.dswecommerce.ecommerce.document.CartItem.toProto(product: ProductDocument): CartItem {
    return CartItem.newBuilder()
        .setProductId(this.productId)
        .setProductName(product.productName)
        .setImageUrl(product.images.firstOrNull() ?: "")
        .setQuantity(this.quantity)
        .setPrice(this.price)
        .build()
}

fun toProto(document: CartDocument, protoItems: List<CartItem>): Cart {
    val totalPrice = protoItems.sumOf { it.price * it.quantity }

    return Cart.newBuilder()
        .setId(document.id ?: "")
        .addAllItems(protoItems)
        .setTotalPrice(totalPrice)
        .build()
}