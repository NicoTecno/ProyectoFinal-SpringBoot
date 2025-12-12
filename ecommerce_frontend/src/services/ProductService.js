// src/services/ProductService.js
import axios from 'axios';

// URL base de tu backend Spring Boot (Puerto 8080)
const API_URL = "http://localhost:8080/api/productos"; 

class ProductService {

    // GET: Obtener todos los productos (para la página de catálogo)
    getAllProducts() {
        // Implementación de conexión (se activa después)
        return axios.get(API_URL); 
    }

    // GET: Obtener un solo producto por ID (para la página de detalle)
    getProductById(id) {
        // Implementación de conexión (se activa después)
        return axios.get(`${API_URL}/${id}`); 
    }

    // POST: Crear un nuevo producto (Usado por un formulario de administración)
    createProduct(product) {
        return axios.post(API_URL, product);
    }
}

export default new ProductService();