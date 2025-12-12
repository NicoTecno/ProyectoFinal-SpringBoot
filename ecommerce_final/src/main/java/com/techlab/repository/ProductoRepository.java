package com.techlab.repository;

import com.techlab.entities.Producto; // Usamos tu entidad 'Producto'
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Métodoo para buscar productos por nombre (no distingue mayúsculas/minúsculas)
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    // Métodoo para buscar productos por categoría (no distingue mayúsculas/minúsculas)
    List<Producto> findByCategoriaContainingIgnoreCase(String categoria);

    // Métodoo para buscar productos por nombre Y categoría
    List<Producto> findByNombreContainingIgnoreCaseAndCategoriaContainingIgnoreCase(String nombre, String categoria);
}