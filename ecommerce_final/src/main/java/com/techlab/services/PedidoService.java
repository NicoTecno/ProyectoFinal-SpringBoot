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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;

    // Constante para definir el estado del carrito activo
    private static final String ESTADO_ACTIVO = "ACTIVO";
    private static final String ESTADO_CONFIRMADO = "CONFIRMADO";

    // Inyección de dependencias por constructor
    @Autowired
    public PedidoService(PedidoRepository pedidoRepository, ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
    }

    // -------------------------------------------------------------------
    // MÉTODOS AUXILIARES
    // -------------------------------------------------------------------

    // Método auxiliar (private) para recalcular el costo total
    private void recalcularCostoTotal(Pedido pedido) {
        double nuevoTotal = 0.0;
        for (LineaPedido linea : pedido.getLineasPedido()) {
            nuevoTotal += linea.getPrecioUnitario() * linea.getCantidad();
        }
        pedido.setCostoTotal(nuevoTotal);
    }

    // -------------------------------------------------------------------
    // 1. CREAR PEDIDO (Añadir al Carrito)
    // -------------------------------------------------------------------

    @Transactional
    public Pedido crearPedido(Pedido pedido) {
        double total = 0.0;

        for (LineaPedido linea : pedido.getLineasPedido()) {

            if (linea.getProducto() == null || linea.getProducto().getId() == null) {
                throw new IllegalArgumentException("El producto en la línea de pedido es nulo o no tiene ID.");
            }

            Optional<Producto> productoOpt = productoRepository.findById(linea.getProducto().getId());
            if (productoOpt.isEmpty()) {
                throw new IllegalArgumentException("Producto no encontrado con ID: " + linea.getProducto().getId());
            }

            Producto producto = productoOpt.get();

            // Validación de Stock
            if (linea.getCantidad() > producto.getStock()) {
                throw new StockInsuficienteException(
                        "Stock insuficiente para el producto: " + producto.getNombre() +
                                ". Stock actual: " + producto.getStock()
                );
            }

            // Descuento de Stock y Guardar Producto
            producto.setStock(producto.getStock() - linea.getCantidad());
            productoRepository.save(producto);

            // Configurar la línea de pedido
            linea.setProducto(producto);
            linea.setPrecioUnitario(producto.getPrecio());
            total += linea.getCantidad() * producto.getPrecio();
            linea.setPedido(pedido);
        }

        // 5. Configurar y Guardar el Pedido FINAL
        pedido.setCostoTotal(total);

        // **********************************************
        // CORRECCIÓN CLAVE: Debe ser ACTIVO al crear el carrito
        pedido.setEstado(ESTADO_ACTIVO);
        // **********************************************

        return pedidoRepository.save(pedido);
    }

    // -------------------------------------------------------------------
    // 2. LISTAR PEDIDOS
    // -------------------------------------------------------------------

    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    // -------------------------------------------------------------------
    // 3. OBTENER CARRITO ACTIVO (GET /carrito)
    // -------------------------------------------------------------------
    @Transactional
    public Optional<Pedido> obtenerUltimoPedido() {

        // Busca solo el último pedido en estado ACTIVO
        Optional<Pedido> pedidoOpt = pedidoRepository.findTopByEstadoOrderByIdDesc(ESTADO_ACTIVO);

        if (pedidoOpt.isPresent()) {
            Pedido pedido = pedidoOpt.get();

            // Lógica de inicialización EAGER
            pedido.getLineasPedido().forEach(linea -> {
                if (linea.getProducto() != null) {
                    linea.getProducto().getNombre();
                }
            });
            return Optional.of(pedido);
        }
        return Optional.empty();
    }


    // -------------------------------------------------------------------
    // 4. ELIMINAR LÍNEA DE PEDIDO (DELETE)
    // -------------------------------------------------------------------
    @Transactional
    public void eliminarLineaPedido(Long lineaPedidoId) {

        // Busca el carrito ACTIVO
        Pedido pedido = pedidoRepository.findTopByEstadoOrderByIdDesc(ESTADO_ACTIVO)
                .orElseThrow(() -> new EntityNotFoundException("No hay un carrito activo para eliminar la línea."));

        // Busca la línea
        Optional<LineaPedido> lineaOpt = pedido.getLineasPedido().stream()
                .filter(linea -> linea.getId().equals(lineaPedidoId))
                .findFirst();

        if (lineaOpt.isEmpty()) {
            throw new EntityNotFoundException("Línea de pedido no encontrada con ID: " + lineaPedidoId);
        }

        LineaPedido lineaAEliminar = lineaOpt.get();

        // Devolver Stock
        Producto producto = lineaAEliminar.getProducto();
        int cantidadDevuelta = lineaAEliminar.getCantidad();

        if (producto != null) {
            producto.setStock(producto.getStock() + cantidadDevuelta);
            productoRepository.save(producto);
        }

        // Eliminar y Recalcular
        pedido.getLineasPedido().remove(lineaAEliminar);
        lineaAEliminar.setPedido(null);

        this.recalcularCostoTotal(pedido);
        pedidoRepository.save(pedido);
    }

    // -------------------------------------------------------------------
    // 5. FINALIZAR PEDIDO (POST /finalizar)
    // -------------------------------------------------------------------
    @Transactional
    public Pedido finalizarPedido() {

        // Busca el carrito ACTIVO
        Pedido pedido = pedidoRepository.findTopByEstadoOrderByIdDesc(ESTADO_ACTIVO)
                .orElseThrow(() -> new EntityNotFoundException("No hay un carrito activo para finalizar."));

        // Cambiar el estado a CONFIRMADO
        pedido.setEstado(ESTADO_CONFIRMADO);
        pedido.setFechaCreacion(LocalDateTime.now());

        return pedidoRepository.save(pedido);
    }
}