import com.google.protobuf.gradle.proto

plugins {
    kotlin("jvm") version "1.9.25"
    kotlin("plugin.spring") version "1.9.25"
    id("org.springframework.boot") version "3.5.6"
    id("io.spring.dependency-management") version "1.1.7"
    id("com.google.protobuf") version "0.9.4"
}

group = "it.wszostak"
version = "0.0.1"
description = "dsw-ecommerce"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

// ---------------- Dependencies ----------------
dependencies {
    // email
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")

    // JWT Support
    implementation("io.jsonwebtoken:jjwt-api:0.12.5")
    implementation("io.jsonwebtoken:jjwt-impl:0.12.5")
    implementation("io.jsonwebtoken:jjwt-jackson:0.12.5")

    // Protobuf
    api("com.google.protobuf:protobuf-java:3.24.3")
    api("com.google.protobuf:protobuf-kotlin:3.24.3")

    // Spring Boot + Reactive MongoDB + OAuth2
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")

    // Kotlin + Reactor
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
    implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    // Tests
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.projectreactor:reactor-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test")
    testImplementation("org.springframework.security:spring-security-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

// ---------------- Protobuf ----------------
protobuf {
    protoc {
        artifact = "com.google.protobuf:protoc:3.24.3"
    }

    generateProtoTasks {
        all().forEach { task ->
            task.builtins {
                create("kotlin") { }
            }
        }
    }
}

sourceSets {
    val main by getting {
        proto {
            srcDir("src/main/proto")
        }
    }
}

configurations.all {
    exclude(group = "io.grpc")
}


// ---------------- Tests ----------------
tasks.withType<Test> {
    useJUnitPlatform()
}

// ---------------- JAR ----------------
tasks.withType<Jar> {
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
}

tasks.bootJar {
    archiveClassifier.set("")
    enabled = true
}

tasks.jar {
    enabled = false
}


tasks.withType<Copy> {
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
}