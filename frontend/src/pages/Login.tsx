// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { access_token } = await api.login(email, password);
            login(access_token);
            
            if (access_token) {
                navigate('/');
            }

        } catch (err) {
            alert('Erreur de connexion');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl mb-4">Connexion</h2>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mb-3 p-2 border rounded" />
                <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} className="w-full mb-3 p-2 border rounded" />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Se connecter</button>
            </form>
        </div>
    );
};

export default Login;
