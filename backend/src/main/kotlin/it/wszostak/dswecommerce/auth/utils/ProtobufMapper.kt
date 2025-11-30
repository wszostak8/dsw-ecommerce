package it.wszostak.dswecommerce.auth.utils

import it.wszostak.dswecommerce.auth.document.UserDocument
import it.wszostak.dswecommerce.auth.proto.AuthProto.UserInfo
import it.wszostak.dswecommerce.auth.proto.AuthProto.Role

fun UserDocument.toUserInfo(): UserInfo {
    return UserInfo.newBuilder()
        .setId(this.id ?: "")
        .setName(this.name)
        .setEmail(this.email)
        .setRole(Role.valueOf(this.role.name))
        .setCreatedAt(this.createdAt.toString())
        .build()
}