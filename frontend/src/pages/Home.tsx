import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Blog } from '../lib/type';
import { api } from '../services/api';

const Home = () => {
    const { token, logout } = useAuth();
    const [post, setpost] = useState<Blog[]>([]);

    useEffect(() => {

        fetchPosts();
    }
        , []);

    const fetchPosts = async () => {
        try {
           
                const response = await api.get('/blog', token);
                setpost(response as Blog[]);
            
        } catch (error) {
            console.error('Erreur lors de la récupération des posts:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
            {token ? (
                <>
                    <p className="text-lg text-green-700">✅ Vous êtes connecté !</p>
                    <button onClick={logout} className="mt-4 bg-red-500 text-white p-2 rounded">Se déconnecter</button>

                </>
            ) : (
                <p className="text-lg text-gray-700">❌ Vous n'êtes pas connecté.</p>
            )}

            <div className="mt-8 w-full max-w-2xl">
                <h2 className="text-2xl font-semibold mb-4">Liste des posts</h2>
                <ul className="space-y-4">
                    {post.map((item) => (
                        <li key={item.id} className="p-4 bg-white rounded shadow">
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            <p className="text-gray-700">{item.content}</p>
                        </li>
                    ))}
                </ul>
            </div>


        </div>

    );
};

export default Home;
