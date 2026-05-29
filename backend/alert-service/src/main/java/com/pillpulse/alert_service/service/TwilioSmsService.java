package com.pillpulse.alert_service.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TwilioSmsService {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.phone-number}")
    private String twilioPhoneNumber;

    public void sendAlert(String phoneNumber,String medicineName,String pharmacyName,int quantity){
        try{
            //initialize twillio
            Twilio.init(accountSid, authToken);

            String messageBody = String.format(
                    "💊 PillPulse Alert!\n\n" +
                            "Good news! %s is now available.\n\n" +
                            "🏥 Pharmacy: %s\n" +
                            "📦 Quantity: %d units\n\n" +
                            "Visit PillPulse to find it near you!",
                    medicineName,
                    pharmacyName,
                    quantity
            );

            //send SMS
            Message message = Message.creator(
                    new PhoneNumber(phoneNumber), // TO (user's number)
                    new PhoneNumber(twilioPhoneNumber), // FROM (Twilio number)
                    messageBody // BODY
            ).create();

            log.info("SMS Sent to recipient: {}", message.getSid());

        } catch (Exception e) {
            log.error("Failed to send SMS to {}: {}", phoneNumber, e.getMessage());
        }
    }
}
