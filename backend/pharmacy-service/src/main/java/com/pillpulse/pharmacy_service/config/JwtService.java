package com.pillpulse.pharmacy_service.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${spring.application.jwt.secret}")
    private String secretKey;

    @Value("${spring.application.jwt.expiration}")
    private Long jwtExpiration;

    //generate token with email
    public String generateToken(String email){
        return generateToken(new HashMap<>(),email);
    }

    //generate token with extra data
    public String generateToken(Map<String, Object> extraClaims, String email){
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();

    }

    //get email from token
    public String extractEmail(String token){
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token,String email){
        final String extractedEmail = extractEmail(token);
        return extractedEmail.equals(email) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token){
        return extractClaim(token,Claims::getExpiration);
    }

    //extract any piece of data from token
    private <T> T extractClaim(String token, java.util.function.Function<Claims,T> claimsResolver){
        final Claims claims = Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();              //get data inside
        return claimsResolver.apply(claims);
    }

    // Used to sign and verify tokens
    private SecretKey getSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }


}
