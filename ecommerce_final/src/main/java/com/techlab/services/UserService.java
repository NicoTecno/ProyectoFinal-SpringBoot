package com.techlab.services;

import com.techlab.entities.Usuario;
import com.techlab.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// ¡IMPORTACIÓN DE SEGURIDAD!
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {

    private final UsuarioRepository usuarioRepository;
    // Campo para cifrar contraseñas
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder; // Asignación del codificador
    }

    /** 1. Crear un nuevo usuario (Registro) **/
    public Usuario crearUsuario(Usuario usuario) {
        // Cifrar la contraseña antes de guardarla en la base de datos (CRÍTICO)
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        // Asignar el rol por defecto si no viene especificado
        if (usuario.getRol() == null || usuario.getRol().isEmpty()) {
            usuario.setRol("CLIENTE");
        }

        // En un proyecto real, aquí iría la validación de email duplicado.
        return usuarioRepository.save(usuario);
    }

    /** 2. Listar todos los usuarios (CRUD List) **/
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    /** 3. Obtener usuario por ID (CRUD Read) **/
    public Usuario obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + id));
    }

    /** 4. Obtener usuario por Email (Necesario para el Login) **/
    public Optional<Usuario> obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    /** 5. Actualizar usuario (CRUD Update) **/
    public Usuario actualizarUsuario(Long id, Usuario detallesUsuario) {
        Usuario usuario = obtenerUsuarioPorId(id);

        usuario.setNombre(detallesUsuario.getNombre());
        usuario.setEmail(detallesUsuario.getEmail());
        usuario.setRol(detallesUsuario.getRol());

        // Nota: La contraseña no se actualiza con este método CRUD general.

        return usuarioRepository.save(usuario);
    }

    /** 6. Eliminar usuario (CRUD Delete) **/
    public void eliminarUsuario(Long id) {
        Usuario usuario = obtenerUsuarioPorId(id); // Verifica existencia
        usuarioRepository.delete(usuario);
    }

    public Usuario validarLogin(String email, String password) {
        // 1. Buscar el usuario por email
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas: Usuario no encontrado."));

        // 2. Comparar la contraseña plana con la contraseña hasheada
        // Esto lo hace el BCryptPasswordEncoder automáticamente.
        boolean match = passwordEncoder.matches(password, usuario.getPassword());

        if (!match) {
            throw new RuntimeException("Credenciales inválidas: Contraseña incorrecta.");
        }

        // Si llega aquí, el login fue exitoso
        return usuario;
    }
}