package com.techlab.repository;

import com.techlab.entities.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional; // Importación necesaria

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Método eficiente: Busca el pedido más nuevo ordenando por ID de forma descendente y tomando el primero
    // Esto es el reemplazo de usar findAll().stream().max().
    Optional<Pedido> findTopByOrderByIdDesc();

    // Si tienes una columna 'fechaCreacion', usa:
    // Optional<Pedido> findTopByOrderByFechaCreacionDesc();
}