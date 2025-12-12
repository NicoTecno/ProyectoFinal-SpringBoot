// src/services/UserService.js

import axios from 'axios';

// URL base para el controlador de usuarios en Spring Boot
const API_URL = "http://localhost:8080/api/usuarios";

class UserService {
    
    // 1. GET: Obtener todos los usuarios (para la tabla de administración)
    getAllUsers() {
        return axios.get(API_URL);
    }
    
    // 2. POST: Crear un nuevo usuario
    createUser(userData) {
        // userData debe contener nombre, email, password, y rol
        return axios.post(API_URL, userData);
    }
    
    // 3. DELETE: Eliminar usuario por ID
    deleteUser(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
    
    // 4. PUT: Actualizar usuario (si se requiere)
    updateUser(id, userData) {
        return axios.put(`${API_URL}/${id}`, userData);
    }
}

export default new UserService();