package com.techlab.controller;

import com.techlab.entities.Pedido;
import com.techlab.exceptions.StockInsuficienteException;
import com.techlab.services.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import jakarta.persistence.EntityNotFoundException; // Importar
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    private final PedidoService pedidoService;

    // Inyección de dependencias por constructor
    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // -------------------------------------------------------------------
    // 1. CREAR PEDIDO (POST /api/pedidos)
    // -------------------------------------------------------------------
    // Este método maneja la lógica de stock en el servicio.
    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody Pedido pedido) {
        try {
            Pedido nuevoPedido = pedidoService.crearPedido(pedido);
            // Devuelve 201 CREATED con el objeto del pedido
            return new ResponseEntity<>(nuevoPedido, HttpStatus.CREATED);
        } catch (StockInsuficienteException e) {
            // Maneja el error específico de stock insuficiente y devuelve 400 BAD REQUEST
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            // Maneja otros errores de validación (ej. producto no encontrado) y devuelve 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // -------------------------------------------------------------------
    // 2. LISTAR HISTORIAL (GET /api/pedidos)
    // -------------------------------------------------------------------
    @GetMapping
    public List<Pedido> listarPedidos() {
        return pedidoService.listarPedidos();
    }

    @GetMapping("/carrito")
    @Transactional // <--- ¡AÑADE ESTA ANOTACIÓN AQUÍ!
    public ResponseEntity<Pedido> obtenerCarritoActivo() {
        return pedidoService.obtenerUltimoPedido()
                .map(ResponseEntity::ok) // Si lo encuentra, devuelve 200 OK
                .orElse(ResponseEntity.notFound().build()); // Si no hay pedidos, devuelve 404 NOT FOUND
    }

    // -------------------------------------------------------------------
    // 4. ELIMINAR LÍNEA DE PEDIDO (DELETE /api/pedidos/linea/{lineaPedidoId})
    // -------------------------------------------------------------------
    @DeleteMapping("/linea/{lineaPedidoId}")
    public ResponseEntity<?> eliminarItemDelCarrito(@PathVariable Long lineaPedidoId) {
        try {
            pedidoService.eliminarLineaPedido(lineaPedidoId);
            // Si tiene éxito, devuelve 204 No Content
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            // Devuelve 404 NOT FOUND si la línea o el pedido no existe
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Devuelve 500 INTERNAL SERVER ERROR para cualquier otro fallo
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar la línea: " + e.getMessage());
        }
    }

    // -------------------------------------------------------------------
    // 5. FINALIZAR COMPRA (POST /api/pedidos/finalizar)
    // -------------------------------------------------------------------
    @PostMapping("/finalizar")
    public ResponseEntity<?> finalizarCompra() {
        try {
            Pedido pedidoFinalizado = pedidoService.finalizarPedido();
            // Retornamos el pedido finalizado o un 200 OK con un mensaje
            return ResponseEntity.ok(
                    Map.of("message", "Pedido finalizado con éxito.", "pedidoId", pedidoFinalizado.getId())
            );
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build(); // 404 si no hay carrito
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // 400 si ya estaba finalizado
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al finalizar la compra: " + e.getMessage());
        }
    }
}