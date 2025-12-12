// src/pages/ProductsPage.jsx

import React, { useState, useEffect } from 'react';
import ProductService from '../services/ProductService';
import ProductCard from '../components/ProductCard';

function ProductsPage() {
    // 1. Estados para manejar los datos, la carga y posibles errores
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. useEffect: Se ejecuta una vez para cargar los productos del backend
    useEffect(() => {
        // Llamada a la función que usa Axios para hablar con Spring Boot
        ProductService.getAllProducts()
            .then(response => {
                // Si la petición es exitosa (código 200 OK)
                setProducts(response.data); // Los datos del JSON se guardan en el estado
                setLoading(false);
            })
            .catch(err => {
                // Si hay un error (ej: CORS, Spring apagado)
                console.error("Error al obtener productos:", err);
                setError("Error de conexión. Asegúrate de que Spring Boot esté activo y la configuración CORS sea correcta (puerto 5174).");
                setLoading(false);
            });
    }, []); // Array vacío para que se ejecute solo al montar el componente

    // 3. Renderizado condicional basado en el estado
    if (loading) {
        return <h1 style={{ textAlign: 'center' }}>Cargando catálogo...</h1>;
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h1 style={{ color: 'red', marginBottom: '15px' }}>{error}</h1>
                <p>Verifica que tu servidor Spring Boot (8080) esté corriendo y que `ProductoController.java` tenga `@CrossOrigin(origins = "http://localhost:5174")`.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Catálogo de Hardware y Periféricos</h1>
            
            <div style={catalogStyle}>
                {products.length === 0 ? (
                    <p style={{ textAlign: 'center', width: '100%' }}>
                        No hay productos disponibles. ¡Inserta un producto usando Postman para que aparezca aquí!
                    </p>
                ) : (
                    // Mapeo de la lista de productos real obtenida de Spring
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
}

const catalogStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
};

export default ProductsPage;