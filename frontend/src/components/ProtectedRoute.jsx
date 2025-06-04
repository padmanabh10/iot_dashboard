import { useAuth0 } from '@auth0/auth0-react';

function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

    if (isLoading) return <p>Loading...</p>;

    if (!isAuthenticated) {
        return (
            <div style={{ padding: '2rem' }}>
                <h2>You must be logged in to access this page.</h2>
                <button onClick={() => loginWithRedirect()} style={{ marginTop: '1rem' }}>
                    Log In
                </button>
            </div>
        );
    }

    return children;
}

export default ProtectedRoute;
