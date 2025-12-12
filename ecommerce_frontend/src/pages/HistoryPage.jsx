// src/pages/HistoryPage.jsx

import React, { useState, useEffect } from 'react';
import OrderService from '../services/OrderService'; // Usamos tu servicio existente
import { tdStyle, thStyle, tableStyle, containerStyle, loadingStyle, errorStyle } from './CartPage'; // Reutilizamos estilos comunes

function HistoryPage() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función de carga del historial
    useEffect(() => {
        setLoading(true);
        OrderService.getHistorial()
            .then(response => {
                setPedidos(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar el historial:", err);
                setError("Error al cargar el historial. ¿Está Spring Boot activo?");
                setLoading(false);
            });
    }, []);

    // --- Funciones Auxiliares de Renderizado ---
    
    // Función para renderizar el listado de productos de un pedido
    const renderLineasPedido = (lineas) => (
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
            {lineas.map((linea, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>
                    **{linea.cantidad}** x {linea.producto.nombre} 
                    (${linea.precioUnitario.toFixed(2)} c/u)
                </li>
            ))}
        </ul>
    );

    // Función para formatear la fecha
    const formatFecha = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', { 
            year: 'numeric', month: 'short', day: 'numeric' 
        });
    };

    // --- Renderizado Condicional ---

    if (loading) {
        return <div style={loadingStyle}>Cargando Historial...</div>;
    }

    if (error) {
        return <div style={errorStyle}>Error: {error}</div>;
    }

    if (pedidos.length === 0) {
        return (
            <div style={containerStyle}>
                <h2>Historial de Pedidos 📋</h2>
                <p style={{ textAlign: 'center', fontSize: '1.2em', color: '#6c757d' }}>
                    Aún no tienes pedidos confirmados. ¡Ve al catálogo y compra algo!
                </p>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h2>Historial de Pedidos Confirmados ({pedidos.length})</h2>
            
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID Pedido</th>
                        <th style={thStyle}>Fecha de Confirmación</th>
                        <th style={thStyle}>Estado</th>
                        <th style={thStyle}>Costo Total</th>
                        <th style={thStyle}>Detalles del Pedido</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map(pedido => (
                        <tr key={pedido.id}>
                            <td style={tdStyle}>{pedido.id}</td>
                            <td style={tdStyle}>{formatFecha(pedido.fechaCreacion)}</td>
                            <td style={tdStyle}>{pedido.estado}</td>
                            <td style={tdStyle}>**${pedido.costoTotal.toFixed(2)}**</td>
                            <td style={tdStyle}>
                                {renderLineasPedido(pedido.lineasPedido)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default HistoryPage;