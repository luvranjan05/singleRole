package com.example.CoreApp.service;

import com.example.CoreApp.entity.UserEntity;
import com.example.CoreApp.io.ProfileRequest;
import com.example.CoreApp.io.ProfileResponse;
import com.example.CoreApp.repository.UserRepostory;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepostory userRepostory;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public ProfileResponse createProfile(ProfileRequest request){
        UserEntity newProfile =convertToUserEntity(request);

        // verify weather the provided email exists or not before going it into database

        if(!userRepostory.existsByEmail(request.getEmail()))
        {
            newProfile=userRepostory.save(newProfile);
            return convertToProfileResponse(newProfile);
        }
        throw  new ResponseStatusException(HttpStatus.CONFLICT,"Email already exists");
    }

    @Override
    public ProfileResponse getProfile(String email) {
       UserEntity existingUser=userRepostory.findByEmail(email)
               .orElseThrow(() -> new UsernameNotFoundException("user not found :" +email));
        return  convertToProfileResponse(existingUser);

    }

    //to send otp to change password
    @Override
    public void sendResetOtp(String email) {
        UserEntity existingEntity=userRepostory.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("user not found"+email));

        //generate the 6 digit otp
      String otp =String.valueOf(ThreadLocalRandom.current().nextInt(100000 ,1000000));

      //calculAate expiry time
        long expiryTime =System.currentTimeMillis()+(15*60*1000);

        //update the profile
        existingEntity.setResetOtp(otp);
        existingEntity.setResetOtpExpireAt(expiryTime);

        //save into the database
        userRepostory.save(existingEntity);

        try{
            emailService.sendResetOtpEmail(existingEntity.getEmail() ,otp);
        } catch (Exception ex){
           throw new RuntimeException("unable to send email");
        }

    }

    @Override
    public void resetPassword(String email, String otp, String newPassword) {
        UserEntity existingUser = userRepostory.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("user not found: " + email));

        if (existingUser.getResetOtp() == null || !existingUser.getResetOtp().equals(otp)) {
            throw new RuntimeException("invalid otp");
        }

        if (existingUser.getResetOtpExpireAt() < System.currentTimeMillis()) {
            throw new RuntimeException("otp expired");
        }

        existingUser.setPassword(passwordEncoder.encode(newPassword));
        existingUser.setResetOtp(null);
        existingUser.setResetOtpExpireAt(0L);

        userRepostory.save(existingUser);
    }

    @Override
    public void sendOtp(String email) {
    UserEntity existingUser = userRepostory.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("user not found" +email));

        if (existingUser.getIsAccountVerified() != null && existingUser.getIsAccountVerified()) {
            return;
        }

        //otherwise generate 6 digit otp

        String otp =String.valueOf(ThreadLocalRandom.current().nextInt(100000 ,1000000));

        //calculAate expiry time
        long expiryTime =System.currentTimeMillis()+(24*60*60*1000);


        //update userEntity

        existingUser.setVerifyOtp(otp);
        existingUser.setVerifyOtpExpireAt(expiryTime);

        //save into the database
        userRepostory.save(existingUser);

        try{
            emailService.sendOtpEmail(existingUser.getEmail(),otp);
        }catch(Exception ex) {
            throw new RuntimeException("unable to send email");
        }


    }

    @Override
    public void verifyOtp(String email, String otp) {
    UserEntity existingUser = userRepostory .findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("user not found" +email));

        if (existingUser.getVerifyOtp() == null || !existingUser.getVerifyOtp().equals(otp)) {
            throw new RuntimeException("invalid otp");
        }

        if(existingUser.getVerifyOtpExpireAt() <System.currentTimeMillis()){
        throw new RuntimeException("otp expired");
    }

    existingUser.setIsAccountVerified(true);
    existingUser.setVerifyOtp(null);
    existingUser.setVerifyOtpExpireAt(0L);

    userRepostory.save(existingUser);

    }

    private ProfileResponse convertToProfileResponse(UserEntity newProfile) {
        return ProfileResponse.builder()
                .name(newProfile.getName())
                .email(newProfile.getEmail())
                .userId(newProfile.getUserId())
                .isAccountVerified(newProfile.getIsAccountVerified())
                .build();
    }
    private UserEntity convertToUserEntity(ProfileRequest request) {
        return UserEntity.builder()
                .email(request.getEmail())
                .userId(UUID.randomUUID().toString())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword())) // ✅ fixed parentheses
                .isAccountVerified(false)
                .resetOtpExpireAt(0L)
                .verifyOtp(null)
                .verifyOtpExpireAt(0L)
                .resetOtp(null)
                .build();
    }


}
