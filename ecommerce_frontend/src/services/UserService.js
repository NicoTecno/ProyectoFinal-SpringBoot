// src/services/UserService.js

import axios from 'axios';

// URL base para el controlador de usuarios en Spring Boot
const API_URL = "http://localhost:8080/api/admin/usuarios";

class UserService {
    
    // 1. GET: Obtener todos los usuarios (para la tabla de administración)
    getAllUsers() {
        // La petición requiere autenticación (rol ADMIN), por lo que DEBE enviar la cookie de sesión.
        return axios.get(API_URL, {
            withCredentials: true // <--- ¡Añadido!
        });
    }
    
    // 2. POST: Crear un nuevo usuario (requiere ADMIN)
    createUser(userData) {
        // La petición requiere autenticación (rol ADMIN).
        return axios.post(API_URL, userData, {
            withCredentials: true // <--- ¡Añadido!
        });
    }
    
    // 3. DELETE: Eliminar usuario por ID (requiere ADMIN)
    deleteUser(id) {
        // La petición requiere autenticación (rol ADMIN).
        return axios.delete(`${API_URL}/${id}`, {
            withCredentials: true // <--- ¡Añadido!
        });
    }
    
    // 4. PUT: Actualizar usuario (requiere ADMIN)
    updateUser(id, userData) {
        // La petición requiere autenticación (rol ADMIN).
        return axios.put(`${API_URL}/${id}`, userData, {
            withCredentials: true // <--- ¡Añadido!
        });
    }
}

export default new UserService();