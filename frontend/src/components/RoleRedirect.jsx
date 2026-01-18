import { Navigate } from 'react-router-dom';

export default function RoleRedirect() {
    const role = localStorage.getItem('role');

    if (role === 'doctor') {
        return <Navigate to="/app/doctor" replace />;
    }

    if (role === 'nurse') {
        return <Navigate to="/app/nurse" replace />;
    }

    return <Navigate to="/login" replace />;
}
