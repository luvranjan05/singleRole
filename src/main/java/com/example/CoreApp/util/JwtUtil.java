package com.example.CoreApp.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.antlr.v4.runtime.Token;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("{jwt.secret.key}")
    private String SECRET_KEY;

    public String generateToken(UserDetails userDetails){
        Map<String ,Object> cliams =new HashMap<>();
        return createToken(cliams ,userDetails.getUsername());
    }

    private String createToken(Map<String, Object> cliams, String email) {

        return Jwts.builder()
                .setClaims(cliams)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+1000*60*60*10)) //10 hours time
                .signWith(SignatureAlgorithm.HS256,SECRET_KEY)
                .compact();
    }

    //to extract all clients

    private Claims extractAllClaims(String token){
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extractClaim(String token , Function<Claims ,T>claimsResolver){
        final Claims claims =extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    //to extract the email from the token

    public String extractEmail(String token){
         return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token){
        return extractClaim(token ,Claims::getExpiration);
    }

      private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public  Boolean validateToken(String token , UserDetails userDetails){
        final String email =extractEmail(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

}
