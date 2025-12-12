// src/components/ProductCard.jsx

import React from 'react';
import OrderService from '../services/OrderService'; // <-- Servicio para la lógica del carrito

function ProductCard({ product }) {
    
    // Función que se ejecuta al hacer clic en el botón
    const handleAddToCart = () => {
        // Validación básica
        if (!product.id) {
            alert("Error: ID de producto no disponible.");
            return;
        }
        
        // Llamamos al backend para crear el pedido con este producto
        OrderService.simularCreacionDePedido(product.id, 1)
            .then(response => {
                // Éxito: El pedido se procesó (Stock descontado en la DB)
                alert(`¡COMPRA FINALIZADA! El producto "${product.nombre}" ha sido procesado.`);
                console.log("Pedido Creado:", response.data);
                
                // Opcional: Recargar la página o actualizar el stock localmente
                window.location.reload(); 
            })
            .catch(error => {
                // Manejo de errores específicos del backend (ej: Stock Insuficiente)
                const errorMessage = 
                    error.response && error.response.data && typeof error.response.data === 'string'
                    ? error.response.data // Si Spring devuelve un string (ej: la excepción)
                    : "Error desconocido de conexión.";
                
                alert(`Error al procesar el pedido: ${errorMessage}`);
                console.error("Error al crear pedido:", error.response || error);
            });
    };

    return (
        <div style={cardStyle}>
            <img 
                src={product.imagenUrl || 'https://via.placeholder.com/200?text=Hardware'} 
                alt={product.nombre} 
                style={imageStyle} 
            />
            <div style={contentStyle}>
                <h3 style={titleStyle}>{product.nombre}</h3>
                <p style={priceStyle}>
                    ${product.precio ? product.precio.toFixed(2) : 'N/A'}
                </p>
                <p style={stockStyle}>Stock: {product.stock}</p>
                
                <button 
                    style={buttonStyle}
                    onClick={handleAddToCart} // <-- Evento de clic
                    disabled={product.stock <= 0} // Desactiva si no hay stock
                >
                    {product.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
                </button>
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// ESTILOS (DEFINICIONES)
// -------------------------------------------------------------

const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    margin: '15px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
};

const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '10px',
};

const contentStyle = {
    padding: '10px 0',
};

const titleStyle = {
    fontSize: '1.2em',
    marginBottom: '5px',
    color: '#007bff',
};

const priceStyle = {
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '10px',
};

const stockStyle = {
    fontSize: '0.9em',
    color: '#6c757d',
};

const buttonStyle = {
    backgroundColor: '#ffc107',
    color: 'black',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    fontWeight: 'bold',
    width: '100%', // El botón ocupa todo el ancho
    transition: 'background-color 0.3s',
};

export default ProductCard;