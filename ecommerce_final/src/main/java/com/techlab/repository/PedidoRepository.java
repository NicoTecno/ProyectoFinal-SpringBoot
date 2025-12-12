// src/main/java/com/techlab/repository/PedidoRepository.java

package com.techlab.repository;

import com.techlab.entities.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Método 1 (Original, que no filtra por estado):
    Optional<Pedido> findTopByOrderByIdDesc();

    // =======================================================
    // MÉTODO 2: EL CRÍTICO PARA EL CARRITO ACTIVO
    // Busca el último pedido que tenga el estado especificado (e.g., "ACTIVO")
    // =======================================================
    Optional<Pedido> findTopByEstadoOrderByIdDesc(String estado);

    // =======================================================
    // MÉTODO 3: EL CRÍTICO PARA EL HISTORIAL DE PEDIDOS
    // Obtiene todos los pedidos con un estado específico, ordenados por fecha de creación descendente
    // =======================================================
    List<Pedido> findByEstadoOrderByFechaCreacionDesc(String estado);
}