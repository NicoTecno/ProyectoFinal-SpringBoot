// src/components/Navbar.jsx (Ajusta los imports según tu estructura)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Importamos el hook

function Navbar() {
    // Usamos el hook para acceder al estado y funciones de Auth
    const { isLoggedIn, isAdmin, logout, user } = useAuth();
    const navigate = useNavigate();

    // Estilos de ejemplo para la Navbar
    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#1e1e1e', // Fondo oscuro
        color: '#fff',
        borderBottom: '2px solid #007bff'
    };

    const linkContainerStyle = {
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
    };

    const linkStyle = {
        color: '#fff',
        textDecoration: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        transition: 'background-color 0.3s'
    };

    const activeLinkStyle = {
        ...linkStyle,
        backgroundColor: '#007bff'
    };
    
    const userGreetingStyle = {
        color: '#ccc',
        fontSize: '0.9em'
    };

    const handleLogout = () => {
        logout(); // Llama a la función de logout del contexto
        navigate('/'); // Redirige al inicio después del logout
    };

    return (
        <nav style={navStyle}>
            {/* Enlaces Principales */}
            <div style={linkContainerStyle}>
                <Link to="/" style={linkStyle}>Inicio</Link>
                <Link to="/productos" style={linkStyle}>Productos</Link>
                <Link to="/carrito" style={linkStyle}>Carrito</Link>
                {/* Enlace de Administrador - Solo visible para ADMINS */}
                {isAdmin && (
                    <Link to="/admin/usuarios" style={activeLinkStyle}>
                        Panel Admin
                    </Link>
                )}
                 {isAdmin && (
                    <Link to="admin/productos" style={activeLinkStyle}>
                        Crear Productos
                    </Link>
                )}
            </div>

            {/* Enlaces de Autenticación/Perfil */}
            <div style={linkContainerStyle}>
                {isLoggedIn ? (
                    <>
                        {/* Mensaje de Bienvenida */}
                        <span style={userGreetingStyle}>
                            Hola, {user?.nombre || user?.email} ({user?.rol})
                        </span>
                        
                        {/* Botón de Logout */}
                        <button 
                            onClick={handleLogout} 
                            style={{ ...linkStyle, cursor: 'pointer', backgroundColor: '#dc3545' }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    // Botón de Login si no está logueado
                    <Link to="/login" style={{ ...linkStyle, backgroundColor: '#28a745' }}>
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;