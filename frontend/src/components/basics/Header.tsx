import { useEffect, useState } from "react";
import { Menu, X } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";


const Headers = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [headerOpaque, setHeaderOpaque] = useState(false);
    const { token, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setHeaderOpaque(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };
    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerOpaque ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
            }`}>
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-blue-500">
                    YANIS TRIGLIA
                </div>

                <nav className="hidden md:flex space-x-8" >
                    {['Accueil', 'À propos', 'Compétences', 'Diplômes', 'Expériences', 'Projets', 'Blog', 'Contact'].map((item, index) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(['hero', 'about', 'skills', 'education', 'experience', 'projects', 'blog', 'contact'][index])}
                            className={`transition-colors ${headerOpaque ? 'text-black hover:text-blue-600' : 'text-white/70 hover:text-white'
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                    {token && (
                        <div>
                        <a href="/admin"><button className="ml-4 bg-blue-500 text-white p-2 rounded pointer-events-auto">Admin</button></a>
                        <button onClick={logout} className="ml-4 bg-red-500 text-white p-2 rounded">Se déconnecter</button>
                        </div>
                    )}
                </nav>

                <button
                    className="md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-md border-t">
                    <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4" style={{ color: 'rgba(255, 255, 255, .7)' }}>
                    {['Accueil', 'À propos', 'Compétences', 'Diplômes', 'Expériences', 'Projets', 'Blog', 'Contact'].map((item, index) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(['hero', 'about', 'skills', 'education', 'experience', 'projects', 'blog', 'contact'][index])}
                            className="text-left text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            {item}
                        </button>
                    ))}
                    {token && (
                        <button onClick={logout} className="mt-4 bg-red-500 text-white p-2 rounded">Se déconnecter</button>
                    )}
                </nav>
                </div>
    )
}
        </header >
    );

}

export default Headers;