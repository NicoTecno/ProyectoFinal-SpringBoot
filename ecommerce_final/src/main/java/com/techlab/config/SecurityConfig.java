package com.techlab.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

// Habilita la configuración de seguridad
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // -------------------------------------------------------------------
    // 1. Password Encoder (Ya lo tenías, lo mantenemos)
    // -------------------------------------------------------------------
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // -------------------------------------------------------------------
    // 2. Definición del Filtro de Seguridad (CRÍTICO)
    // -------------------------------------------------------------------
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Habilitar CORS usando la configuración que definiremos abajo
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Deshabilitar CSRF (esencial para APIs REST sin sesiones de navegador)
                .csrf(AbstractHttpConfigurer::disable)

                // Configurar la autorización de peticiones
                .authorizeHttpRequests(authorize -> authorize
                        // Permitir todas las peticiones a nuestra API sin autenticación
                        .requestMatchers("/api/**").permitAll()
                        // Cualquier otra petición (ej. estáticos) requiere autenticación
                        .anyRequest().authenticated()
                );

        // Retorna la cadena de filtros configurada
        return http.build();
    }

    // -------------------------------------------------------------------
    // 3. Configuración CORS específica para Spring Security
    // -------------------------------------------------------------------
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Incluye los mismos puertos que en WebConfig.java
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}