package com.techlab.services;

import com.techlab.entities.Producto;
import com.techlab.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired; // Aun se usa para el constructor
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    // 1. Inyección de dependencias por campo (usando @Autowired en el constructor)
    private final ProductoRepository productoRepository;

    // Inyección de dependencias por constructor (método preferido en Spring)
    @Autowired
    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // -------------------------------------------------------------------
    // MÉTODOS DE LECTURA (Adaptados del ejemplo del profesor)
    // -------------------------------------------------------------------

    // Obtener un producto por ID con manejo de error
    public Producto obtenerProductoPorId(Long id) {
        Optional<Producto> productoOptional = this.productoRepository.findById(id);

        if (productoOptional.isEmpty()){
            // Lanza una excepción si el producto no existe
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }

        return productoOptional.get();
    }

    // Método de búsqueda avanzada (Basado en el findAllProducts del profesor)
    public List<Producto> buscarProductos(String nombre, String categoria) {
        // Validación de parámetros de búsqueda
        boolean hasNombre = nombre != null && !nombre.trim().isEmpty();
        boolean hasCategoria = categoria != null && !categoria.trim().isEmpty();

        if (hasNombre && hasCategoria) {
            // Buscar por nombre Y categoría (Requiere el método personalizado en el Repository)
            return this.productoRepository.findByNombreContainingIgnoreCaseAndCategoriaContainingIgnoreCase(nombre, categoria);
        }

        if (hasNombre) {
            // Buscar solo por nombre
            return this.productoRepository.findByNombreContainingIgnoreCase(nombre);
        }

        if (hasCategoria) {
            // Buscar solo por categoría
            return this.productoRepository.findByCategoriaContainingIgnoreCase(categoria);
        }

        // Si no hay filtros, devuelve todos los productos
        return this.productoRepository.findAll();
    }


    // -------------------------------------------------------------------
    // MÉTODOS DE ESCRITURA (CRUD)
    // -------------------------------------------------------------------

    // Crear o actualizar un producto
    public Producto guardarProducto(Producto producto) {
        return this.productoRepository.save(producto);
    }

    // Editar un producto por ID (Adaptación del editProductById del profesor)
    public Producto editarProducto(Long id, Producto datosNuevos) {
        // Primero, aseguramos que el producto exista
        Producto productoExistente = this.obtenerProductoPorId(id);

        // Lógica de edición simple: solo actualiza si el campo no viene vacío
        if (datosNuevos.getNombre() != null && !datosNuevos.getNombre().trim().isEmpty()) {
            productoExistente.setNombre(datosNuevos.getNombre());
        }
        if (datosNuevos.getPrecio() != null) {
            productoExistente.setPrecio(datosNuevos.getPrecio());
        }
        if (datosNuevos.getStock() != null) {
            productoExistente.setStock(datosNuevos.getStock());
        }
        // ... (Se pueden agregar otros campos: descripcion, categoria, etc.)

        return this.productoRepository.save(productoExistente);
    }

    // Eliminar un producto (se usará el delete físico simple)
    public void eliminarProductoPorId(Long id){
        // Verifica que el producto exista antes de borrar
        Producto producto = this.obtenerProductoPorId(id);
        this.productoRepository.delete(producto);
    }
}