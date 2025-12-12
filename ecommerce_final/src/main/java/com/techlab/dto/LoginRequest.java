package com.techlab.dto;

/**
 * Clase para recibir el cuerpo JSON de una solicitud de login.
 */
public class LoginRequest {
    private String email;
    private String password;

    // Constructores
    public LoginRequest() {}

    // Getters y Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}