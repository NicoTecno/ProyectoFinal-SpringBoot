package com.techlab.controller;

import com.techlab.dto.LoginRequest;
import com.techlab.entities.Usuario;
import com.techlab.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/usuarios") // Ruta base: /api/usuarios
// Necesario para conectar tu frontend React (puerto 5174, si usas Vite)
//@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // -------------------------------------------------------------------
    // 1. CREAR / REGISTRAR USUARIO (POST /api/usuarios)
    // -------------------------------------------------------------------
    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = userService.crearUsuario(usuario);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    // -------------------------------------------------------------------
    // 2. LISTAR TODOS LOS USUARIOS (GET /api/usuarios)
    // Esto será útil para la vista de Administración.
    // -------------------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = userService.listarUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    // -------------------------------------------------------------------
    // 3. OBTENER USUARIO POR ID (GET /api/usuarios/{id})
    // -------------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id) {
        try {
            Usuario usuario = userService.obtenerUsuarioPorId(id);
            return ResponseEntity.ok(usuario);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // -------------------------------------------------------------------
    // 4. ACTUALIZAR USUARIO (PUT /api/usuarios/{id})
    // -------------------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {
        try {
            Usuario usuario = userService.actualizarUsuario(id, usuarioActualizado);
            return ResponseEntity.ok(usuario);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // -------------------------------------------------------------------
    // 5. ELIMINAR USUARIO (DELETE /api/usuarios/{id})
    // -------------------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        try {
            userService.eliminarUsuario(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // -------------------------------------------------------------------
    // 6. LOGIN (POST /api/usuarios/login)
    // Devuelve el objeto Usuario si las credenciales son válidas.
    // -------------------------------------------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Usuario usuarioAutenticado = userService.validarLogin(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
            );

            // Retornamos el objeto completo, que incluye el ID y el rol.
            return ResponseEntity.ok(usuarioAutenticado);

        } catch (RuntimeException e) {
            // Manejamos errores de credenciales inválidas (Usuario no encontrado/Contraseña incorrecta)
            // Se usa HttpStatus.UNAUTHORIZED (401) para indicar fallo de autenticación.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
}