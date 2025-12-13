// src/pages/AdminProductsPage.jsx
import React, { useState, useEffect } from 'react';
import ProductAdminService from '../services/ProductAdminService';

const initialFormState = {
    id: null,
    nombre: '',
    precio: 0.0,
    stock: 0,
    categoria: ''
    // Agrega aquí cualquier otro campo de tu entidad Producto
};

const AdminProductsPage = () => {
    const [productos, setProductos] = useState([]);
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Cargar productos al iniciar el componente
    const fetchProductos = async () => {
        try {
            setLoading(true);
            // Usamos el servicio para la lectura
            const data = await ProductAdminService.getAllProducts();
            setProductos(data);
            setError(null);
        } catch (err) {
            console.error("Error al cargar productos:", err);
            setError("Error al cargar los productos. ¿Está el backend activo?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    // 2. Manejo de cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // 3. Manejo de envío del formulario (Crear o Editar)
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditing && formData.id) {
                // EDITAR producto
                await ProductAdminService.updateProduct(formData.id, formData);
                alert(`Producto '${formData.nombre}' actualizado con éxito.`);
            } else {
                // CREAR producto
                await ProductAdminService.createProduct(formData);
                alert(`Producto '${formData.nombre}' creado con éxito.`);
            }

            // Limpiar formulario y recargar la lista
            setFormData(initialFormState);
            setIsEditing(false);
            fetchProductos();

        } catch (err) {
            console.error("Error al guardar producto:", err);
            // Esto es crucial para la seguridad: Si no eres ADMIN, aquí recibirás un 403
            if (err.response && err.response.status === 403) {
                setError("Acceso Denegado. No tienes permisos de ADMINISTRADOR para esta acción.");
            } else {
                 setError(`Error al guardar: ${err.message}. Revisa la consola.`);
            }
        }
    };

    // 4. Iniciar modo edición
    const handleEdit = (producto) => {
        setFormData(producto);
        setIsEditing(true);
        setError(null);
        // Opcional: scroll al formulario para facilitar la edición
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // 5. Cancelar edición
    const handleCancelEdit = () => {
        setFormData(initialFormState);
        setIsEditing(false);
    };

    // 6. Eliminar producto
    const handleDelete = async (id, nombre) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar el producto: ${nombre}?`)) {
            return;
        }

        try {
            await ProductAdminService.deleteProduct(id);
            alert(`Producto '${nombre}' eliminado.`);
            fetchProductos(); // Recargar la lista
        } catch (err) {
            console.error("Error al eliminar producto:", err);
            if (err.response && err.response.status === 403) {
                setError("Acceso Denegado. No tienes permisos de ADMINISTRADOR para eliminar.");
            } else {
                setError(`Error al eliminar: ${err.message}. Revisa la consola.`);
            }
        }
    };

    if (loading) return <div>Cargando productos...</div>;
    if (error) return <div style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <h1>Panel de Administración de Productos</h1>
            
            {/* -------------------- FORMULARIO CRUD -------------------- */}
            <div style={styles.formContainer}>
                <h2>{isEditing ? `Editar Producto: ${formData.nombre}` : 'Crear Nuevo Producto'}</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Nombre del Producto"
                        required
                        style={styles.input}
                    />
                    <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        placeholder="Precio"
                        required
                        min="0"
                        step="0.01"
                        style={styles.input}
                    />
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="Stock"
                        required
                        min="0"
                        style={styles.input}
                    />
                    <input
                        type="text"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        placeholder="Categoría (ej: Hardware, Periférico)"
                        required
                        style={styles.input}
                    />
                    {/* Agrega aquí más campos del formulario según tu entidad Producto */}
                    
                    <button type="submit" style={styles.submitButton}>
                        {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={handleCancelEdit} style={styles.cancelButton}>
                            Cancelar Edición
                        </button>
                    )}
                </form>
            </div>

            {/* -------------------- LISTA DE PRODUCTOS -------------------- */}
            <h2 style={{ marginTop: '40px' }}>Lista de Productos ({productos.length})</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Precio</th>
                        <th style={styles.th}>Stock</th>
                        <th style={styles.th}>Categoría</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id}>
                            <td style={styles.td}>{producto.id}</td>
                            <td style={styles.td}>{producto.nombre}</td>
                            <td style={styles.td}>${producto.precio.toFixed(2)}</td>
                            <td style={styles.td}>{producto.stock}</td>
                            <td style={styles.td}>{producto.categoria}</td>
                            <td style={styles.td}>
                                <button onClick={() => handleEdit(producto)} style={styles.editButton}>
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(producto.id, producto.nombre)} style={styles.deleteButton}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Estilos básicos para hacerlo visualmente agradable (opcional)
const styles = {
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '20px',
    },
    formContainer: {
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '40px',
        backgroundColor: '#f9f9f9',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '10px',
        borderRadius: '3px',
        border: '1px solid #ddd',
    },
    submitButton: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    cancelButton: {
        padding: '10px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        marginTop: '5px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
        backgroundColor: '#343a40',
        color: 'white',
    },
    td: {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
    },
    editButton: {
        marginRight: '5px',
        padding: '5px 10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
    }
};

export default AdminProductsPage;