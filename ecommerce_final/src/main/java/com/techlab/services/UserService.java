package com.techlab.services;

import com.techlab.entities.Usuario;
import com.techlab.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UserService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /** 1. Crear un nuevo usuario (Registro) **/
    public Usuario crearUsuario(Usuario usuario) {
        // En un proyecto real, aquí iría la validación de email duplicado y el hasheo de la contraseña.
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

    /** 4. Actualizar usuario (CRUD Update) **/
    public Usuario actualizarUsuario(Long id, Usuario detallesUsuario) {
        Usuario usuario = obtenerUsuarioPorId(id);

        usuario.setNombre(detallesUsuario.getNombre());
        usuario.setEmail(detallesUsuario.getEmail());
        usuario.setRol(detallesUsuario.getRol());

        // La contraseña se actualizaría en un método separado por seguridad.

        return usuarioRepository.save(usuario);
    }

    /** 5. Eliminar usuario (CRUD Delete) **/
    public void eliminarUsuario(Long id) {
        Usuario usuario = obtenerUsuarioPorId(id); // Verifica existencia
        usuarioRepository.delete(usuario);
    }
}