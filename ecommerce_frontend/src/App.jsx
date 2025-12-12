// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductsPage from './pages/ProductsPage';

import CartPage from './pages/CartPage';
import HistoryPage from './pages/HistoryPage';

// Componentes de marcador de posición (los crearemos después)
const HomePage = () => <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Bienvenido a Tech Lab Store</h1>;
const BuilderPage = () => <h1 style={{ textAlign: 'center', marginTop: '50px' }}>🔨 Configurador de PC (¡Próximamente!)</h1>;
//const CartPage = () => <h1 style={{ textAlign: 'center', marginTop: '50px' }}>🛍️ Tu Carrito de Compras</h1>;

function App() {
  return (
    <Router>
      <Navbar /> 
      
      <main style={{ padding: '20px' }}>
        <Routes>
          {/* Definición de todas las rutas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/historial" element={<HistoryPage />} />
          
          {/* Ruta de 404 (No encontrado) */}
          <Route path="*" element={<h1 style={{ textAlign: 'center', color: 'red' }}>404 - Página no encontrada</h1>} />
        </Routes>
      </main>

      <footer style={{ textAlign: 'center', padding: '15px', background: '#333', color: 'white', marginTop: '50px' }}>
        © 2025 Tech Lab Ecommerce
      </footer>
    </Router>
  );
}

export default App;