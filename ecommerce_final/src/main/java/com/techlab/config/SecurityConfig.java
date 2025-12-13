package com.techlab.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
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
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // -------------------------------------------------------------------
    // 1. Password Encoder
    // -------------------------------------------------------------------
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // -------------------------------------------------------------------
    // 2. Configuración CORS (NECESARIO para React/Vite)
    // -------------------------------------------------------------------
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Permite la comunicación con el frontend de React/Vite
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174", "http://localhost:3000"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));

        // CRÍTICO: Permite que se envíen las cookies de sesión (credenciales)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // -------------------------------------------------------------------
    // 3. Definición del Filtro de Seguridad y Autorización
    // -------------------------------------------------------------------
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Deshabilitar CSRF (para API REST)
                .csrf(AbstractHttpConfigurer::disable)

                // CRÍTICO: Aplica la configuración CORS definida arriba
                .cors(Customizer.withDefaults())

                // Configuración de Autorización de Peticiones
                .authorizeHttpRequests(auth -> auth

                        // Rutas PÚBLICAS (No necesitan autenticación)
                        .requestMatchers("/api/usuarios/login", "/api/usuarios/registrar").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll() // Listar productos es público

                        // RUTAS DE ADMINISTRACIÓN (Requieren rol ADMIN)
                        // Productos CRUD
                        .requestMatchers(HttpMethod.POST, "/api/productos").hasAuthority("ADMIN") // Crear
                        .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasAuthority("ADMIN")  // Editar
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasAuthority("ADMIN") // Eliminar

                        // Usuarios CRUD
                        .requestMatchers(HttpMethod.GET, "/api/usuarios").hasAuthority("ADMIN") // Listar (CORRECCIÓN CRÍTICA)
                        .requestMatchers(HttpMethod.POST, "/api/usuarios").hasAuthority("ADMIN") // Crear (Si usas un endpoint admin)
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasAuthority("ADMIN")

                        // RUTAS AUTENTICADAS (Requieren estar logueado, ADMIN o CLIENTE)
                        .requestMatchers("/api/pedidos/**", "/api/carrito/**").authenticated()

                        // Cualquier otra petición que no se haya definido arriba, requiere autenticación
                        .anyRequest().authenticated()
                )
                // Usamos HTTP Basic para que Spring pueda autenticar con las credenciales
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}