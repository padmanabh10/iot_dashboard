import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home loginWithRedirect={loginWithRedirect} isAuthenticated={isAuthenticated} logout={logout} />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
