import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/chat');
        }
    }, [user, navigate]);

    const handleSuccess = async (response) => {
        try {
            await login(response);
            navigate('/chat');
        } catch (error) {
            console.error("Login Failed", error);
        }
    };

    const handleError = () => {
        console.log('Login Failed');
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="p-10 bg-white rounded-lg shadow-xl">
                <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Welcome Back</h1>
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        useOneTap
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
