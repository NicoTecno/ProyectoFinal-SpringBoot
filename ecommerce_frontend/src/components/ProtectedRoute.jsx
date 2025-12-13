// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Importamos la lógica de autenticación

/**
 * Componente de guardia de ruta.
 * Redirige al usuario si no cumple con los requisitos de autenticación/rol.
 * * @param {React.ReactNode} children - Los componentes hijos a renderizar (la página protegida).
 * @param {string} [requiredRole=null] - El rol mínimo requerido ('ADMIN', 'CLIENTE', o null para solo autenticado).
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
    // Obtenemos el estado de la sesión y el rol del usuario
    const { isLoggedIn, user, loading } = useAuth();
    
    // Función para verificar si el usuario tiene el rol requerido
    const hasRequiredRole = () => {
        if (!requiredRole) {
            return true; // Si no se requiere rol específico, solo necesita estar logueado
        }
        // Comparamos el rol del usuario (en mayúsculas) con el rol requerido
        return user?.rol?.toUpperCase() === requiredRole.toUpperCase();
    };

    // 1. Si la aplicación aún está cargando la sesión (ej. leyendo localStorage), esperamos
    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando sesión de usuario...</div>; 
    }

    // 2. Verificar si el usuario está logueado
    if (!isLoggedIn) {
        // Si no está logueado, redirigir a la página de login
        // 'replace' evita que el usuario pueda volver a la página protegida con el botón 'atrás'
        return <Navigate to="/login" replace />;
    }

    // 3. Verificar el rol si se requiere uno
    if (requiredRole && !hasRequiredRole()) {
        // Si no cumple con el rol (ej. es CLIENTE y quiere ver ADMIN), denegar acceso
        alert(`Acceso denegado. Se requiere el rol: ${requiredRole}. Tu rol es: ${user.rol}.`);
        return <Navigate to="/productos" replace />; // Redirigir a una página segura (ej: catálogo)
    }

    // Si pasa todas las comprobaciones, renderiza la página solicitada (children)
    return children;
};

export default ProtectedRoute;