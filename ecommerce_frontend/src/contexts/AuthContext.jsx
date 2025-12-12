// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor
export const AuthProvider = ({ children }) => {
    // Estado del usuario logueado
    const [user, setUser] = useState(null);
    // Estado de carga inicial (para evitar que la app renderice sin revisar localStorage)
    const [loading, setLoading] = useState(true);

    // =========================================================
    // Inicialización: Cargar la sesión desde localStorage al montar
    // =========================================================
    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    // =========================================================
    // Funciones de Autenticación
    // =========================================================

    const login = async (email, password) => {
        try {
            const loggedInUser = await AuthService.login(email, password);
            setUser(loggedInUser);
            return loggedInUser;
        } catch (error) {
            // Re-lanzar el error para que LoginPage pueda manejarlo y mostrar un mensaje
            throw error; 
        }
    };

    const logout = () => {
        AuthService.logout();
        setUser(null); // Limpiar el estado global
    };

    // =========================================================
    // Funciones de Utilidad (Roles y Estado)
    // =========================================================

    // Verifica si el usuario actual tiene el rol 'ADMIN'
    const isAdmin = user && user.rol === 'ADMIN';

    // Booleano simple
    const isLoggedIn = !!user; 

    // =========================================================
    // Objeto de Valor del Contexto
    // =========================================================
    const value = {
        user,
        isAdmin, 
        isLoggedIn, 
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Solo renderiza la aplicación una vez que se ha comprobado el estado de carga */}
            {!loading && children}
        </AuthContext.Provider>
    );
};