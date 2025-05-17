package com.example.CoreApp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    //to send the welcome email
    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    public void sendWelcomeEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to My Platform");
        message.setText("Hello " + name + ",\n\n" +
                "You don't have to worry about security—it is properly authenticated.\n\n" +
                "Regards,\nRanjan Pandey");

        mailSender.send(message);
    }

    //to send otp to change password

    public void sendResetOtpEmail(String toEmail ,String otp){
        SimpleMailMessage message =new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("password reset otp");
        message.setText("your otp for resetting the password is : "+otp+ "\n\n use this otp to change your password ");
        mailSender.send(message);

    }

    //to verify email should go there

    public void sendOtpEmail(String toEmail , String otp){
        SimpleMailMessage message =new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Account verification otp");
        message.setText("your otp is: \n\n" +otp + "\n \n verify your account using this otp ");
        mailSender.send(message);
    }
}
