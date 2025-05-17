package com.example.CoreApp.service;

import com.example.CoreApp.io.ProfileRequest;
import com.example.CoreApp.io.ProfileResponse;

public interface ProfileService {

    ProfileResponse createProfile(ProfileRequest request);

     ProfileResponse getProfile(String email);

     void sendResetOtp(String email);

     void resetPassword(String email,String otp ,String newPassword);

     //to verify email

    void sendOtp(String email);

    void verifyOtp(String email ,String otp);


}
