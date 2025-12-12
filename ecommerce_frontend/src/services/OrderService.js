// src/services/OrderService.js

import axios from 'axios';

// La URL base para el controlador de pedidos en Spring Boot (puerto 8080)
const API_URL = "http://localhost:8080/api/pedidos";
class OrderService {
    
    // 1. POST: Simular la Creación de un Pedido (Añadir al Carrito)
    // Recibe el ID del producto que se compra y la cantidad (por defecto 1)
    simularCreacionDePedido(productoId, cantidad = 1) {
        
        // 1. Construir la LineaPedido
        const lineaPedido = {
            // ¡CLAVE! El backend espera el objeto "producto" con su "id" dentro, 
            // ya que Java tiene una entidad Producto anidada.
            producto: { id: productoId }, 
            cantidad: cantidad 
        };

        // 2. Construir el objeto Pedido completo
        // En este ejemplo, el pedido solo contiene una línea
        const pedidoData = {
            lineasPedido: [lineaPedido],
            // Spring Boot completará el costoTotal y el estado en el backend.
        };

        return axios.post(API_URL, pedidoData);
    }
    
    // 2. GET: Obtener el carrito/pedido activo (READ)
    getCart() {
        // Llama al endpoint que devuelve el último pedido (nuestro carrito)
        // Llama a: http://localhost:8080/api/pedidos/carrito
        return axios.get(`${API_URL}/carrito`);
    }

    // Nota: Aquí se agregarían funciones para actualizar (PUT) o eliminar (DELETE) líneas de pedido.
    // 3. DELETE: Eliminar una línea de pedido por su ID
    deleteLineItem(lineaPedidoId) {
        // Llama a: http://localhost:8080/api/pedidos/linea/{lineaPedidoId}
        return axios.delete(`${API_URL}/linea/${lineaPedidoId}`);
    }
}

export default new OrderService();