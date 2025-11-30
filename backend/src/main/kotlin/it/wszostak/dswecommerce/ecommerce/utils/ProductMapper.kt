package it.wszostak.dswecommerce.ecommerce.utils

import it.wszostak.dswecommerce.ecommerce.document.ProductDocument
import it.wszostak.dswecommerce.ecommerce.proto.Product
import it.wszostak.dswecommerce.ecommerce.proto.StatusType

fun ProductDocument.toProto(): Product {
    return Product.newBuilder()
        .setId(this.productId)
        .setUserId(this.userId)
        .setProductName(this.productName)
        .addAllImages(this.images)
        .setPrice(this.price)
        .setDescription(this.description)
        .setStock(stock.toInt())
        .setCode(code)
        .setEan(ean)
        .setStatus(StatusType.valueOf(status.name))
        .build()
}