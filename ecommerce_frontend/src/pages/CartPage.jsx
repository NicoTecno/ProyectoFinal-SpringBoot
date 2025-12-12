import React, { useState, useEffect } from 'react';
import OrderService from '../services/OrderService';

// =========================================================
// ⚠️ NOTA: Los estilos deben estar definidos en tu archivo CSS o al final.
// Aquí se incluyen estilos simples para hacerlo funcional.
// =========================================================
const containerStyle = { padding: '20px', maxWidth: '900px', margin: '0 auto' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2' };
const tdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
const totalContainerStyle = { marginTop: '20px', textAlign: 'right', fontSize: '1.2em', fontWeight: 'bold' };
const deleteButtonStyle = { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' };
const checkoutButtonStyle = { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' };
const errorStyle = { color: 'red', fontWeight: 'bold' };
const loadingStyle = { fontSize: '1.5em', color: '#007bff' };
const emptyCartStyle = { fontSize: '1.5em', color: '#6c757d', textAlign: 'center' };


function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // =========================================================
    // Función de carga (fetch) reutilizable
    // =========================================================
    const fetchCart = () => {
        setLoading(true);
        setError(null);
        
        console.log("Iniciando llamada GET a /carrito (puerto 8080)...");

        OrderService.getCart()
            .then(response => {
                console.log("Respuesta Exitosa:", response.data);
                setCart(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error completo de la API:", err);
                // Si el backend devuelve 404, asumimos que no hay carrito activo
                if (err.response && err.response.status === 404) {
                    console.log("Carrito vacío (404 Not Found)");
                    setCart(null);
                } else {
                    setError("Error al cargar el carrito. Asegúrate de que Spring Boot esté activo y CORS sea correcto.");
                }
                setLoading(false);
            });
    };
    
    // =========================================================
    // Hook de React: Se ejecuta solo al montar el componente
    // =========================================================
    useEffect(() => {
        fetchCart();
    }, []); 

    // =========================================================
    // Función para ELIMINAR ITEM
    // =========================================================
    const handleRemoveItem = (lineaPedidoId) => {
        // Confirmación visual antes de la acción
        if (!window.confirm("¿Estás seguro de que quieres eliminar este producto del carrito?")) {
            return;
        }

        OrderService.deleteLineItem(lineaPedidoId)
            .then(() => {
                alert("Producto eliminado del carrito.");
                // Después de eliminar, recargamos el carrito para actualizar la vista y el total
                fetchCart(); 
            })
            .catch(err => {
                console.error("Error al eliminar la línea:", err);
                alert("Error al eliminar el producto. Inténtalo de nuevo.");
            });
    };
    
    // =========================================================
    // Renderizado Condicional
    // =========================================================
    if (loading) {
        return <div style={loadingStyle}>Cargando Carrito...</div>;
    }

    if (error) {
        return <div style={errorStyle}>{error}</div>;
    }
    
    // Si cart es null o lineasPedido está vacío
    if (!cart || !cart.lineasPedido || cart.lineasPedido.length === 0) {
        return (
            <div style={containerStyle}>
                <h2>Tu Carrito de Compras 🛍️</h2>
                <div style={emptyCartStyle}>Tu carrito está vacío 🛒</div>
            </div>
        );
    }
    
    // =========================================================
    // Renderizado del Carrito (con datos)
    // =========================================================
    return (
        <div style={containerStyle}>
            <h2>Resumen del Carrito</h2>
            
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Producto</th>
                        <th style={thStyle}>Precio Unitario</th>
                        <th style={thStyle}>Cantidad</th>
                        <th style={thStyle}>Subtotal</th>
                        <th style={thStyle}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.lineasPedido.map(linea => (
                        <tr key={linea.id}>
                            <td style={tdStyle}>{linea.producto ? linea.producto.nombre : "Producto no disponible"}</td> 
                            <td style={tdStyle}>${linea.precioUnitario ? linea.precioUnitario.toFixed(2) : '0.00'}</td>
                            <td style={tdStyle}>{linea.cantidad}</td>
                            <td style={tdStyle}>
                                {/* Cálculo del subtotal */}
                                ${linea.precioUnitario && linea.cantidad 
                                    ? (linea.precioUnitario * linea.cantidad).toFixed(2) 
                                    : '0.00'}
                            </td>
                            <td style={tdStyle}>
                                <button 
                                    style={deleteButtonStyle}
                                    onClick={() => handleRemoveItem(linea.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={totalContainerStyle}>
                Total a Pagar: ${cart.costoTotal ? cart.costoTotal.toFixed(2) : '0.00'}
            </div>
            
            <div style={{ textAlign: 'right' }}>
                <button style={checkoutButtonStyle}>FINALIZAR COMPRA</button>
            </div>
        </div>
    );
}

export default CartPage;