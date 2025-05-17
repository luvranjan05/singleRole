package com.example.CoreApp.config;

import com.example.CoreApp.io.AuthRequest;
import com.example.CoreApp.io.AuthResponse;
import com.example.CoreApp.io.ResetPasswordRequest;
import com.example.CoreApp.service.AppUserDetailsService;
import com.example.CoreApp.service.ProfileService;
import com.example.CoreApp.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final JwtUtil jwtUtil;
    private final ProfileService profileService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request){
       try {
           authenticate(request.getEmail(),request.getPassword());


           // for generating Jwt token
           final UserDetails userDetails =appUserDetailsService.loadUserByUsername(request.getEmail());
           final String jwtToken =jwtUtil.generateToken(userDetails);


           //after creating the token we have to add it to the cookie

           ResponseCookie cookie =ResponseCookie.from("jwt" ,jwtToken)
                   .httpOnly(true)
                   .path("/")
                   .maxAge(Duration.ofDays(1))
                   .sameSite("Strict")
                   .build();

           return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE ,cookie.toString())
                   .body(new AuthResponse(request.getEmail(),jwtToken));

       }
       catch (BadCredentialsException ex){
           Map<String ,Object> error =new HashMap<>();
           error.put("error" ,true);
           error.put("message" ,"Email or Password is incorrect");
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
       }
       catch (DisabledException ex){
           Map<String ,Object> error =new HashMap<>();
           error.put("error" ,true);
           error.put("message" ,"Account is disabled");
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
       }
       catch (Exception ex){
           Map<String ,Object> error =new HashMap<>();
           error.put("error" ,true);
           error.put("message" ,"Authentication Failed");
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
       }

    }

    private void authenticate(String email, String password) {
        // inside this method we need to call authentication manager
      authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email ,password));
    }

    //to check authenticated or not

    @GetMapping("/is-authenticated")
    public ResponseEntity<Boolean> isAuthenticated(@CurrentSecurityContext(expression = "authentication?.name")String email){
        return ResponseEntity.ok(email !=null);
    }

    @PostMapping("/send-reset-otp")
    public void sendResetOtp(@RequestParam String email){
      try{
          profileService.sendResetOtp(email);
      } catch (Exception ex){
          throw  new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR ,ex.getMessage());
      }
    }

    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request){

        try{
        profileService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        }catch(Exception ex){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,ex.getMessage());
        }
    }
    @PostMapping("/send-otp")
    public  void sendVerifyOtp(@CurrentSecurityContext(expression = "authentication?.name") String email){
        try{
            profileService.sendOtp(email);

        } catch (Exception ex){
           throw  new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR ,ex.getMessage());
        }
    }

    // to handle email verification
    @PostMapping("/verify-otp")
    public void verifyEmail(@RequestBody Map<String ,Object> request,
                            @CurrentSecurityContext(expression = "authentication?.name")String email){

        if(request.get("otp").toString() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST ,"missing details");
        }

        //if otp is present then we pass it to verify otp handler
        try{
            profileService.verifyOtp(email,request.get("otp").toString());
        }catch (Exception ex){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,ex.getMessage());

        }
    }

    //to handle logout

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response){
    //here we replace cookievalue with empty
    ResponseCookie cookie = ResponseCookie.from("jwt" , "")
            .httpOnly(true)
            .secure(false)
            .path("/")
            .maxAge(0)
            .sameSite("Strict")
            .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE,cookie.toString())
                    .body("logged out successfully");
    }
}
