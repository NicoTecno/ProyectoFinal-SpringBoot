// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Importamos el hook de autenticación

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth(); // Obtenemos la función de login del contexto
    const navigate = useNavigate();

    // Estilos CSS simples para el formulario
    const formContainerStyle = {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #444',
        borderRadius: '8px',
        backgroundColor: '#222',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
        color: '#fff',
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        boxSizing: 'border-box',
        border: '1px solid #555',
        borderRadius: '4px',
        backgroundColor: '#333',
        color: '#fff'
    };
    
    const buttonStyle = {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '15px'
    };

    const errorStyle = {
        color: '#ff4d4d',
        marginTop: '10px',
        textAlign: 'center'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Limpiar errores anteriores

        try {
            await login(email, password);
            
            // Si el login es exitoso, navegar al catálogo
            navigate('/productos'); 

        } catch (err) {
            console.error("Fallo de login:", err);
            
            // Verificamos si es un error de respuesta HTTP del backend (ej. 401 Unauthorized)
            if (err.response && err.response.data && err.response.data.message) {
                 setError(err.response.data.message); // Usar el mensaje específico del backend
            } else if (err.message === 'Network Error') {
                 setError('Error de red. Asegúrate que el servidor Spring Boot esté corriendo.');
            } else {
                 setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
            }
        }
    };

    return (
        <div style={formContainerStyle}>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                />
                <button type="submit" style={buttonStyle}>
                    Login
                </button>
                {error && <div style={errorStyle}>{error}</div>}
            </form>
        </div>
    );
}

export default LoginPage;