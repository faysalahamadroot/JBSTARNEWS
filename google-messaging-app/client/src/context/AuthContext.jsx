import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
            // Optionally verify token validity here
        }
        setLoading(false);
    }, []);

    const login = async (googleData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            // Send google token to backend
            const { data } = await axios.post(
                'http://localhost:5000/api/auth/google',
                { token: googleData.credential },
                config
            );

            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
