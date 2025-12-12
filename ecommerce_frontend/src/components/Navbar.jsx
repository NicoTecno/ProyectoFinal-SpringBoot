// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Usamos Link para navegar sin recargar

function Navbar() {
    return (
        <nav style={navbarStyle}>
            <div style={logoStyle}>
                <Link to="/" style={linkStyle}>🛒 Tech Lab Store</Link>
            </div>
            <div style={linksContainerStyle}>
                <Link to="/" style={linkStyle}>Inicio</Link>
                <Link to="/productos" style={linkStyle}>Catálogo</Link>
                <Link to="/builder" style={linkStyle}>Armar PC</Link>
                <Link to="/carrito" style={cartLinkStyle}>
                    🛒 Carrito (0)
                </Link>
            </div>
        </nav>
    );
}

// Estilos
const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    backgroundColor: '#1E1E1E', // Fondo oscuro
    color: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
};

const logoStyle = {
    fontSize: '1.5em',
    fontWeight: 'bold',
};

const linksContainerStyle = {
    display: 'flex',
    gap: '30px',
};

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.1em',
    padding: '5px 10px',
    transition: 'color 0.3s',
};

const cartLinkStyle = {
    ...linkStyle,
    color: '#FFD700', // Dorado para destacar el carrito
};

export default Navbar;