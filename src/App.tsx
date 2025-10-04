import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import Layout from './components/layout/Layout';

// Auth & Common Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './pages/auth/ProtectedRoute';

// Inventory Management
import InventoryList from './pages/inventory/InventoryList';
import InventoryDetails from './pages/inventory/InventoryDetails';
import InventoryForm from './pages/inventory/InventoryForm';
import CategoriesList from './pages/categories/CategoriesList';
import CategoryDetails from './pages/categories/CategoryDetails';
import CategoryForm from './pages/categories/CategoryForm';
import SuppliersList from './pages/suppliers/SuppliersList';
import SupplierDetails from './pages/suppliers/SupplierDetails';
import SupplierForm from './pages/suppliers/SupplierForm';

// Vehicle Management
import CarsList from './pages/vehicles/CarsList';
import CarDetails from './pages/vehicles/CarDetails';
import CarForm from './pages/vehicles/CarForm';

// User Management
// TODO: Create user management pages
// import UsersList from './pages/users/UsersList';
// import UserDetails from './pages/users/UserDetails';
// import UserForm from './pages/users/UserForm';

// Stock Transactions
import StockTransactionsList from './pages/stock-transactions/StockTransactionsList';

// Services & Repairs
import ServicesList from './pages/services/ServicesList';
import ServiceDetails from './pages/services/ServiceDetails';
import ServiceForm from './pages/services/ServiceForm';
import ReparationsList from './pages/reparations/ReparationsList';
import ReparationDetails from './pages/reparations/ReparationDetails';
import ReparationForm from './pages/reparations/ReparationForm';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes inside layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Categories Routes */}
            <Route path="/categories" element={
              <ProtectedRoute>
                <Layout>
                  <CategoriesList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/categories/new" element={
              <ProtectedRoute>
                <Layout>
                  <CategoryForm />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/categories/:id" element={
              <ProtectedRoute>
                <Layout>
                  <CategoryDetails />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/categories/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <CategoryForm isEditing />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Suppliers Routes */}
            <Route path="/suppliers" element={
              <ProtectedRoute>
                <Layout>
                  <SuppliersList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/suppliers/new" element={
              <ProtectedRoute>
                <Layout>
                  <SupplierForm />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/suppliers/:id" element={
              <ProtectedRoute>
                <Layout>
                  <SupplierDetails />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/suppliers/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <SupplierForm isEditing />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Inventory Routes */}
            <Route path="/inventory" element={
              <ProtectedRoute>
                <Layout>
                  <InventoryList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/inventory/new" element={
              <ProtectedRoute>
                <Layout>
                  <InventoryForm />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/inventory/:id" element={
              <ProtectedRoute>
                <Layout>
                  <InventoryDetails />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/inventory/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <InventoryForm isEditing />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Vehicles Routes */}
            <Route path="/vehicles" element={
              <ProtectedRoute>
                <Layout>
                  <CarsList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/vehicles/new" element={
              <ProtectedRoute>
                <Layout>
                  <CarForm />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/vehicles/:id" element={
              <ProtectedRoute>
                <Layout>
                  <CarDetails />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/vehicles/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <CarForm isEditing />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Services Routes */}
            <Route path="/services" element={
              <ProtectedRoute>
                <Layout>
                  <ServicesList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/services/new" element={
              <ProtectedRoute>
                <Layout>
                  <ServiceForm />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/services/:id" element={
              <ProtectedRoute>
                <Layout>
                  <ServiceDetails />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/services/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <ServiceForm isEditing />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Stock Transactions Routes */}
            <Route path="/stock-transactions" element={
              <ProtectedRoute>
                <Layout>
                  <StockTransactionsList />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Reparations Routes */}
            <Route path="/reparations" element={
              <ProtectedRoute>
                <Layout>
                  <ReparationsList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reparations/new" element={
              <ProtectedRoute>
                <Layout>
                  <ReparationForm />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reparations/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <ReparationForm isEditing />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reparations/:id" element={
              <ProtectedRoute>
                <Layout>
                  <ReparationDetails />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Users Routes - TODO: Create user management pages */}
            {/* <Route path="/users" element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <UsersList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/users/new" element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <UserForm />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/users/:id" element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <UserDetails />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/users/edit/:id" element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <UserForm isEditing />
                </Layout>
              </ProtectedRoute>
            } /> */}

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;