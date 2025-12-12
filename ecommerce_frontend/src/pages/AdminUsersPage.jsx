// src/pages/AdminUsersPage.jsx

import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
// Reutilizamos estilos comunes para la tabla
import { tdStyle, thStyle, tableStyle, containerStyle, loadingStyle, errorStyle, deleteButtonStyle, checkoutButtonStyle } from './CartPage'; 

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para el formulario de nuevo usuario (simulación de registro)
    const [newUser, setNewUser] = useState({ nombre: '', email: '', password: '', rol: 'CLIENTE' });

    // =========================================================
    // Función de carga (fetch) de usuarios
    // =========================================================
    const fetchUsers = () => {
        setLoading(true);
        UserService.getAllUsers()
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar usuarios:", err);
                setError("Error de conexión con el backend de usuarios.");
                setLoading(false);
            });
    };
    
    useEffect(() => {
        fetchUsers();
    }, []); 

    // =========================================================
    // Manejo de Formulario (Input Changes)
    // =========================================================
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // =========================================================
    // Crear Nuevo Usuario (POST)
    // =========================================================
    const handleCreateUser = (e) => {
        e.preventDefault();
        
        UserService.createUser(newUser)
            .then(() => {
                alert(`Usuario ${newUser.nombre} creado con éxito.`);
                setNewUser({ nombre: '', email: '', password: '', rol: 'CLIENTE' }); // Limpiar formulario
                fetchUsers(); // Recargar la lista
            })
            .catch(err => {
                console.error("Error al crear usuario:", err);
                alert("Error al crear el usuario. Verifique el email.");
            });
    };

    // =========================================================
    // Eliminar Usuario (DELETE)
    // =========================================================
    const handleDeleteUser = (id, nombre) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${nombre}?`)) {
            return;
        }

        UserService.deleteUser(id)
            .then(() => {
                alert(`Usuario ${nombre} eliminado.`);
                fetchUsers(); // Recargar la lista
            })
            .catch(err => {
                console.error("Error al eliminar usuario:", err);
                alert("Error al eliminar el usuario. Intente más tarde.");
            });
    };

    // --- Renderizado Condicional ---

    if (loading) {
        return <div style={loadingStyle}>Cargando panel de administración...</div>;
    }

    if (error) {
        return <div style={errorStyle}>Error: {error}</div>;
    }

    // --- Renderizado Principal ---

    return (
        <div style={containerStyle}>
            <h1>Panel de Administración de Usuarios</h1>
            
            {/* ------------------------------------ */}
            {/* Formulario de Creación de Usuario */}
            {/* ------------------------------------ */}
            <h3 style={{ marginTop: '40px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                Crear Nuevo Usuario (Registro)
            </h3>
            <form onSubmit={handleCreateUser} style={formStyle}>
                <input 
                    type="text" 
                    name="nombre" 
                    placeholder="Nombre" 
                    value={newUser.nombre} 
                    onChange={handleInputChange} 
                    required 
                    style={inputStyle}
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={newUser.email} 
                    onChange={handleInputChange} 
                    required 
                    style={inputStyle}
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Contraseña" 
                    value={newUser.password} 
                    onChange={handleInputChange} 
                    required 
                    style={inputStyle}
                />
                <select name="rol" value={newUser.rol} onChange={handleInputChange} style={selectStyle}>
                    <option value="CLIENTE">CLIENTE</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
                <button type="submit" style={{ ...checkoutButtonStyle, marginTop: '0' }}>
                    Registrar Usuario
                </button>
            </form>

            {/* ------------------------------------ */}
            {/* Tabla de Listado de Usuarios */}
            {/* ------------------------------------ */}
            <h3 style={{ marginTop: '40px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                Usuarios Registrados ({users.length})
            </h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Nombre</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Rol</th>
                        <th style={thStyle}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td style={tdStyle}>{user.id}</td>
                            <td style={tdStyle}>{user.nombre}</td>
                            <td style={tdStyle}>{user.email}</td>
                            <td style={tdStyle}>{user.rol}</td>
                            <td style={tdStyle}>
                                <button 
                                    style={deleteButtonStyle}
                                    onClick={() => handleDeleteUser(user.id, user.nombre)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Estilos específicos para el formulario de administración
const formStyle = {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '8px'
};

const inputStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    flexGrow: 1
};

const selectStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
};


export default AdminUsersPage;