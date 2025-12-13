// src/services/ProductAdminService.js

import axios from 'axios';
import AuthService from './AuthService'; // Necesitamos al usuario logueado
// URL base de tu controlador de productos
const API_URL = "http://localhost:8080/api/productos"; 

// Función auxiliar para configurar la cabecera de autorización.
// En un sistema de producción, usarías JWT. Por ahora, asumimos que 
// la autenticación es manejada por el contexto o el navegador.
// Dado que Spring Security lo hace con sesiones/cookies o Basic Auth, 
// no es estrictamente necesario, pero es buena práctica en Axios para 
// asegurar que la llamada tiene contexto de autenticación.
const getAuthHeaders = () => {
    // Si usas un sistema basado en tokens (JWT), lo pasarías aquí.
    // Para Spring Security con sesiones, 'withCredentials: true' es clave.
    return {
        // En este caso, solo necesitamos withCredentials: true en la llamada, 
        // pero definimos una función para mantener la estructura limpia.
    };
};

class ProductAdminService {
    
    // Función para obtener todos los productos (ya existe en ProductService, 
    // pero la incluimos para el CRUD por conveniencia)
    async getAllProducts() {
        const response = await axios.get(API_URL);
        return response.data;
    }

    // CREATE: POST /api/productos
    async createProduct(productData) {
        // Enviar la data al backend. El backend verificará el rol ADMIN.
        const response = await axios.post(API_URL, productData, {
            // Esto asegura que las credenciales (cookies de sesión, si existen) 
            // se envíen al backend.
            withCredentials: true 
        });
        return response.data;
    }

    // UPDATE: PUT /api/productos/{id}
    async updateProduct(id, productData) {
        const response = await axios.put(`${API_URL}/${id}`, productData, {
            withCredentials: true
        });
        return response.data;
    }

    // DELETE: DELETE /api/productos/{id}
    async deleteProduct(id) {
        const response = await axios.delete(`${API_URL}/${id}`, {
            withCredentials: true
        });
        return response.data; // Normalmente un 204 No Content
    }
}

export default new ProductAdminService();