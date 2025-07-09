import React from 'react';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {

    const authInfo = {
        name: "John Doe",
        
    }

    return (
        <AuthContext value={authInfo}>
            { children}
        </AuthContext>
    );
};

export default AuthProvider;