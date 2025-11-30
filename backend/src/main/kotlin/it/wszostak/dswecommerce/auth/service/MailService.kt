package it.wszostak.dswecommerce.auth.service

import jakarta.mail.internet.MimeMessage
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import org.thymeleaf.TemplateEngine
import org.thymeleaf.context.Context

@Service
class MailService(
    private val mailSender: JavaMailSender,
    private val templateEngine: TemplateEngine,
    @param:Value("\${spring.mail.from}") private val fromEmail: String
) {

    @Async
    fun sendPasswordResetEmail(to: String, name: String, code: String) {
        val title = "Twój kod do resetu hasła"
        val body = "Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta. Użyj poniższego kodu, aby ustawić nowe hasło. Kod jest ważny przez 15 minut."

        sendHtmlEmail(to, name, title, body, code)
    }

    private fun sendHtmlEmail(to: String, name: String, title: String, body: String, code: String?) {
        val context = Context().apply {
            setVariable("name", name)
            setVariable("title", title)
            setVariable("body", body)
            setVariable("code", code)
        }

        val htmlContent = templateEngine.process("email-template.html", context)

        val message: MimeMessage = mailSender.createMimeMessage()
        val helper = MimeMessageHelper(message, true, "UTF-8")

        helper.setFrom(fromEmail)
        helper.setTo(to)
        helper.setSubject(title)
        helper.setText(htmlContent, true)

        mailSender.send(message)
    }
}