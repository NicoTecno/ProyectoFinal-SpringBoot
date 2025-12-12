package com.techlab.repository;

import com.techlab.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Métodoo de consulta personalizado para buscar un usuario por su email.
    // Esto será CRÍTICO para la futura autenticación/login.
    Optional<Usuario> findByEmail(String email);
}