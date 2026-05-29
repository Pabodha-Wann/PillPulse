package com.pillpulse.alert_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailNotificationService {

    private final JavaMailSender mailSender;

    public void sendSubscriptionConfirmationEmail(String toEmail, String medicineName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("💊 PillPulse Alert Activated: " + medicineName);
            
            String text = String.format(
                    "Hello,\n\n" +
                    "You have successfully subscribed to stock alerts for: %s.\n" +
                    "We will notify you immediately via email and SMS as soon as this medicine " +
                    "is restocked at any of our partner pharmacies.\n\n" +
                    "Thank you for choosing PillPulse.",
                    medicineName
            );
            message.setText(text);
            mailSender.send(message);
            log.info("Subscription confirmation email successfully sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send subscription confirmation email to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendRestockAlertEmail(String toEmail, String medicineName, String pharmacyName, int quantity) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("🔔 PillPulse Stock Alert: " + medicineName + " Restocked!");
            
            String text = String.format(
                    "Great news!\n\n" +
                    "The medicine you are watching, %s, has been restocked!\n\n" +
                    "🏥 Pharmacy: %s\n" +
                    "📦 Quantity available: %d units\n\n" +
                    "Please visit PillPulse search page to view directions and locate it.",
                    medicineName, pharmacyName, quantity
            );
            message.setText(text);
            mailSender.send(message);
            log.info("Restock alert email successfully sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send restock alert email to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendUnsubscriptionConfirmationEmail(String toEmail, String medicineName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("🔕 PillPulse Alert Deactivated: " + medicineName);
            
            String text = String.format(
                    "Hello,\n\n" +
                    "This email confirms you have unsubscribed from stock alerts for: %s.\n" +
                    "You will no longer receive stock notifications for this medicine.\n\n" +
                    "If this was a mistake, you can subscribe again anytime on our website.",
                    medicineName
            );
            message.setText(text);
            mailSender.send(message);
            log.info("Unsubscription confirmation email successfully sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send unsubscription confirmation email to {}: {}", toEmail, e.getMessage());
        }
    }
}
