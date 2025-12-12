// src/services/AuthService.js

import axios from 'axios';

// Asegúrate que esta URL sea correcta
const API_URL = "http://localhost:8080/api/usuarios"; 

class AuthService {
    
    /**
     * Realiza la llamada al endpoint de login (POST /api/usuarios/login).
     * Guarda el objeto usuario (incluye ID, nombre, email, rol) en localStorage.
     */
    async login(email, password) {
        // Configuramos withCredentials: true para que Axios maneje las cookies (si se usan más adelante)
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password
        }, {
            withCredentials: true 
        });
        
        const user = response.data; 
        
        // Guardamos los datos del usuario para persistencia
        localStorage.setItem('user', JSON.stringify(user));
        
        return user;
    }

    /**
     * Limpia el almacenamiento local para cerrar la sesión.
     */
    logout() {
        localStorage.removeItem('user');
    }

    /**
     * Obtiene el usuario almacenado en localStorage.
     * @returns {object|null} El objeto usuario o null si no hay sesión.
     */
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}

export default new AuthService();