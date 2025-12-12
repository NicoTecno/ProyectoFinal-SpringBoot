package com.techlab.services;

import com.techlab.entities.Pedido;
import com.techlab.entities.LineaPedido;
import com.techlab.entities.Producto;
import com.techlab.exceptions.StockInsuficienteException;
import com.techlab.repository.PedidoRepository;
import com.techlab.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityNotFoundException; // Importar

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;

    // Inyección de dependencias por constructor
    @Autowired
    public PedidoService(PedidoRepository pedidoRepository, ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
    }

    // -------------------------------------------------------------------
    // 1. CREAR PEDIDO (Lógica Transaccional y de Stock)
    // -------------------------------------------------------------------

    @Transactional // Asegura que si algo falla, todos los cambios se revierten (rollback)
    public Pedido crearPedido(Pedido pedido) {
        double total = 0.0;

        for (LineaPedido linea : pedido.getLineasPedido()) {

            if (linea.getProducto() == null || linea.getProducto().getId() == null) {
                throw new IllegalArgumentException("El producto en la línea de pedido es nulo o no tiene ID.");
            }

            // 1. Obtener Producto y verificar existencia
            Optional<Producto> productoOpt = productoRepository.findById(linea.getProducto().getId());

            if (productoOpt.isEmpty()) {
                throw new IllegalArgumentException("Producto no encontrado con ID: " + linea.getProducto().getId());
            }

            Producto producto = productoOpt.get();

            // 2. Validación de Stock
            if (linea.getCantidad() > producto.getStock()) {
                // Lanza la excepción personalizada si no hay suficiente stock
                throw new StockInsuficienteException(
                        "Stock insuficiente para el producto: " + producto.getNombre() +
                                ". Stock actual: " + producto.getStock()
                );
            }

            // 3. Descuento de Stock y Guardar Producto
            producto.setStock(producto.getStock() - linea.getCantidad());
            productoRepository.save(producto); // Actualiza el stock en la base de datos

            // 4. Configurar la línea de pedido
            linea.setProducto(producto); // <-- CORRECCIÓN AÑADIDA: Asigna el objeto Producto completo
            linea.setPrecioUnitario(producto.getPrecio());
            total += linea.getCantidad() * producto.getPrecio();
            linea.setPedido(pedido); // Establece la relación bidireccional
        }

        // 5. Configurar y Guardar el Pedido Final
        pedido.setCostoTotal(total);
        pedido.setEstado("confirmado");
        return pedidoRepository.save(pedido);
    }

    // -------------------------------------------------------------------
    // 2. LISTAR PEDIDOS
    // -------------------------------------------------------------------

    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    public Optional<Pedido> obtenerUltimoPedido() {
        Optional<Pedido> pedidoOpt = pedidoRepository.findTopByOrderByIdDesc();

        if (pedidoOpt.isPresent()) {
            Pedido pedido = pedidoOpt.get();

            // --- ¡AÑADE ESTE BLOQUE DE CÓDIGO! ---
            // Esto asegura que la colección y la entidad Producto anidada se carguen
            // completamente antes de que la transacción termine y Jackson serialice.
            pedido.getLineasPedido().forEach(linea -> {
                // Forzamos la carga tocando una propiedad del objeto Producto
                // Si el producto no es null, se carga completamente.
                if (linea.getProducto() != null) {
                    linea.getProducto().getNombre();
                }
            });
            // -------------------------------------

            return Optional.of(pedido);
        }

        return Optional.empty();
    }

    private void recalcularCostoTotal(Pedido pedido) {
        double nuevoTotal = 0.0;
        for (LineaPedido linea : pedido.getLineasPedido()) {
            nuevoTotal += linea.getPrecioUnitario() * linea.getCantidad();
        }
        pedido.setCostoTotal(nuevoTotal);
    }

    // -------------------------------------------------------------------
    // 3. ELIMINAR LÍNEA DE PEDIDO (Lógica Transaccional)
    // -------------------------------------------------------------------
    @Transactional
    public void eliminarLineaPedido(Long lineaPedidoId) {
        // 1. Encontrar el Pedido que contiene esta Línea
        // Usamos el PedidoRepository para encontrar el último pedido (el carrito activo)
        Pedido pedido = pedidoRepository.findTopByOrderByIdDesc()
                .orElseThrow(() -> new EntityNotFoundException("No hay un carrito activo para eliminar la línea."));

        // 2. Buscar la línea de pedido dentro de la colección del pedido
        Optional<LineaPedido> lineaOpt = pedido.getLineasPedido().stream()
                .filter(linea -> linea.getId().equals(lineaPedidoId))
                .findFirst();

        if (lineaOpt.isEmpty()) {
            throw new EntityNotFoundException("Línea de pedido no encontrada con ID: " + lineaPedidoId);
        }

        LineaPedido lineaAEliminar = lineaOpt.get();

        Producto producto = lineaAEliminar.getProducto();
        int cantidadDevuelta = lineaAEliminar.getCantidad();

        if (producto != null) {
            // 3.1 Aumentar el stock del producto
            producto.setStock(producto.getStock() + cantidadDevuelta);

            // 3.2 Guardar el producto con el stock actualizado
            productoRepository.save(producto);
        }

        // 4. Eliminar la línea de la colección del Pedido
        pedido.getLineasPedido().remove(lineaAEliminar);
        lineaAEliminar.setPedido(null);

        // 5. Recalcular el costo total del pedido
        this.recalcularCostoTotal(pedido);

        // 6. Guardar el pedido actualizado (manejo implícito por @Transactional)
        pedidoRepository.save(pedido);
    }
}