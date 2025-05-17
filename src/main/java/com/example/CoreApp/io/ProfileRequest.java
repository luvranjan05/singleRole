package com.example.CoreApp.io;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileRequest {

    @NotBlank(message = "nam rakhna yaar !")
    private String name;

    @Email(message = "valid email hunu paryo")
    @NotNull(message = "thait ram ram bina email ko pani hunxa ra !")
    private String email;

    @Size(min = 6,message="kam se kam 6 digit ko hunu paryo !")
    private String password;

}
