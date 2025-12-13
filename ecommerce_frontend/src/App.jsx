// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // DEBE existir en src/components/

// Importaciones de Páginas (USANDO TUS NOMBRES)
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage'; // <-- ¡Tu catálogo!
import CartPage from './pages/CartPage';
import HistoryPage from './pages/HistoryPage';

// Páginas de Administración
import AdminUsersPage from './pages/AdminUsersPage';
import AdminProductsPage from './pages/AdminProductsPage'; // DEBE existir en src/pages/

// Componente simple para la página de inicio
const HomePage = () => (
    <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Bienvenido a la Tienda TechLab</h1>
);

// Componente simple para manejar rutas no encontradas
const NotFoundPage = () => (
    <h1 style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>404 - Página no encontrada</h1>
);

function App() {
  return (
    <AuthProvider> 
      <Router>
        <Navbar /> 
        
        <main style={{ padding: '20px' }}>
          <Routes>
            
            {/* ------------------------------------------- */}
            {/* 🌐 RUTAS PÚBLICAS Y BÁSICAS                  */}
            {/* ------------------------------------------- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/productos" element={<ProductsPage />} /> {/* <--- RUTA CORREGIDA */}
            
            
            {/* ------------------------------------------- */}
            {/* 🛒 RUTAS AUTENTICADAS (CLIENTE o ADMIN)      */}
            {/* ------------------------------------------- */}
            <Route path="/carrito" element={
                <ProtectedRoute>
                    <CartPage /> 
                </ProtectedRoute>
            } />
            <Route path="/historial" element={
                <ProtectedRoute>
                    <HistoryPage />
                </ProtectedRoute>
            } />
            
            {/* ------------------------------------------- */}
            {/* 🔒 RUTAS DE ADMINISTRACIÓN (SOLO ADMIN)      */}
            {/* ------------------------------------------- */}
            <Route path="/admin/usuarios" element={
                <ProtectedRoute requiredRole="ADMIN"> 
                    <AdminUsersPage /> 
                </ProtectedRoute>
            } />
            <Route path="/admin/productos" element={
                <ProtectedRoute requiredRole="ADMIN"> 
                    <AdminProductsPage /> 
                </ProtectedRoute>
            } />

            {/* ------------------------------------------- */}
            {/* ⚠️ CATCH-ALL (404)                             */}
            {/* ------------------------------------------- */}
            <Route path="*" element={<NotFoundPage />} />

          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;