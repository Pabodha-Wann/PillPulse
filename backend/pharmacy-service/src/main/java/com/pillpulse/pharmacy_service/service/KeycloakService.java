package com.pillpulse.pharmacy_service.service;

import com.pillpulse.pharmacy_service.dto.request.PharmacyRegisterRequest;
import com.pillpulse.pharmacy_service.exception.DuplicateResourceException;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class KeycloakService {

    @Value("${keycloak.auth-server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;


    private Keycloak getKeycloakInstance(){
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .grantType("client_credentials")
                .clientId(clientId)
                .clientSecret(clientSecret)
                .build();
    }

    public void createKeycloakUser(PharmacyRegisterRequest request){
        Keycloak keycloak = getKeycloakInstance();


        //define user profile
        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(request.getEmail());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getName());
        user.setEmailVerified(true);

        //set password
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setTemporary(false);
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(request.getPassword());
        user.setCredentials(Collections.singletonList(credential));

        //Post user to keycloak
        Response response = keycloak.realm(realm)
                .users()
                .create(user);

        if(response.getStatus() == 201){

            log.info("Successfully created Keycloak user with ID: {}",  request.getEmail());

            //assign the PHARMACY_ADMIN rle for user
            String userId = extractUserIdFromResponse(response);
            assignRole(keycloak,userId,"PHARMACY_ADMIN");


            log.info("Assigned PHARMACY_ADMIN role to Keycloak user: {}", request.getEmail());

        }else if(response.getStatus() == 409){
            throw new DuplicateResourceException("Email already registered inside Keycloak identity network.");

        }else{
            log.error("Keycloak user creation failed.Status code {}",response.getStatus());
            throw new RuntimeException("Failed to register account with identity network provider.");
        }



    }

    public void assignRole(Keycloak keycloak,String userId,String roleName){

        try{
        RoleRepresentation role = keycloak.realm(realm)
                .roles()
                .get(roleName)
                .toRepresentation();

        //assign role
        keycloak.realm(realm)
                .users()
                .get(userId)
                .roles()
                .realmLevel()
                .add(List.of(role));
        } catch (Exception e) {
            // THIS WILL REVEAL THE CULPRIT!
            log.error("CRASH IN ASSIGN ROLE! Error from Keycloak: {}", e.getMessage());
            throw e; // Re-throw so the database rollback still works
        }
        log.info("Assigned role {} to user {}",roleName,userId);
    }

    public String extractUserIdFromResponse(Response response){
        // Location header contains user ID
        // Format: http://localhost:8180/admin/realms/pillpulse/users/{id}
        String location = response.getHeaderString("Location");

        return location.substring(location.lastIndexOf("/")+1);
    }

    public void deletePharmacyUser(String email){
        Keycloak keycloak = getKeycloakInstance();

        //find user
        List<UserRepresentation> users = keycloak.realm(realm)
                .users()
                .searchByEmail(email,true);

        if(!users.isEmpty()){
            keycloak.realm(realm)
                    .users()
                    .delete(users.get(0).getId());
            log.info("Deleted Keycloak user:{}",email);
        }
    }
}
