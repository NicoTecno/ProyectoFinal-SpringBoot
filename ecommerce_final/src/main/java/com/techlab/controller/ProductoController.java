package com.techlab.controller;

import com.techlab.entities.Producto;
import com.techlab.services.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/productos") // Prefijo para todos los endpoints: /api/productos
//@CrossOrigin(origins = "http://localhost:5173")
// Permite la comunicación con tu frontend React
public class ProductoController {

    private final ProductoService productoService;

    // 1. Inyección de dependencias por constructor
    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // -------------------------------------------------------------------
    // 2. CREAR (POST /api/productos)
    // -------------------------------------------------------------------
    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto){
        // Llama al método del servicio para crear y guardar
        return this.productoService.guardarProducto(producto);
    }

    // -------------------------------------------------------------------
    // 3. LEER POR ID (GET /api/productos/{id})
    // -------------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id){
        try {
            // Usa el método que maneja la excepción de "no encontrado"
            Producto producto = this.productoService.obtenerProductoPorId(id);
            return ResponseEntity.ok(producto);
        } catch (RuntimeException e) {
            // Devuelve 404 NOT FOUND si el servicio lanza la excepción
            return ResponseEntity.notFound().build();
        }
    }

    // -------------------------------------------------------------------
    // 4. LEER TODOS / FILTRAR (GET /api/productos?name=x&category=y)
    // -------------------------------------------------------------------
    @GetMapping
    public List<Producto> listarProductos(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String categoria) {

        // Llama al método avanzado del servicio para manejar la lógica de filtros
        return this.productoService.buscarProductos(nombre, categoria);
    }

    // -------------------------------------------------------------------
    // 5. ACTUALIZAR (PUT /api/productos/{id})
    // -------------------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<Producto> editarProducto(@PathVariable Long id, @RequestBody Producto dataToEdit){
        try {
            Producto productoActualizado = this.productoService.editarProducto(id, dataToEdit);
            return ResponseEntity.ok(productoActualizado);
        } catch (RuntimeException e) {
            // Devuelve 404 si el producto a editar no existe
            return ResponseEntity.notFound().build();
        }
    }

    // -------------------------------------------------------------------
    // 6. ELIMINAR (DELETE /api/productos/{id})
    // -------------------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id){
        try {
            this.productoService.eliminarProductoPorId(id);
            // Devuelve 204 NO CONTENT si se eliminó correctamente
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            // Devuelve 404 si el producto a eliminar no existe
            return ResponseEntity.notFound().build();
        }
    }
}