import { useEffect, useState } from "react";
import { Menu, X } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";


const Headers = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [headerOpaque, setHeaderOpaque] = useState(false);
    const [visiblemenu, setVisibleMenu] = useState(false);
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

    const visibilityMenu = () => {

        if (visiblemenu) {
            setVisibleMenu(false);
        }
        else {
            setVisibleMenu(true);
        }
    }

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerOpaque ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
            }`}>
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-blue-500">
                    Portfolio
                </div>

                <nav className="hidden md:flex space-x-8 " >
                    {['Accueil', 'À propos', 'Compétences', 'Diplômes', 'Expériences', 'Projets', 'Blog', 'Contact'].map((item, index) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(['hero', 'about', 'skills', 'education', 'experience', 'projects', 'blog', 'contact'][index])}
                            className={`transition-colors cursor-pointer ${headerOpaque ? 'text-black hover:text-blue-600' : 'text-white/70 hover:text-white'
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                    {token && (
                        <div className="ml-3 relative hidden md:block">
                            <div>
                                <button type="button" onClick={visibilityMenu} className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                    <span className="sr-only">Open user menu</span>
                                    <img className="h-8 w-8 rounded-full cursor-pointer" src="https://media.licdn.com/dms/image/v2/D4E03AQHCdDjx4fm5_w/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1705933859095?e=1775088000&v=beta&t=xW1wx42kqsNILuRpENAaHdUrCfVnzmWZvScBjCT-GD0" alt="" />
                                </button>
                            </div>
                            {visiblemenu && (
                                <div
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    id="user-menu"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu-button"
                                    tabIndex={-1}
                                >
                                    <a
                                        href="/admin"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                            />
                                        </svg>
                                        Admin
                                    </a>

                                    <a
                                        onClick={logout}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        Se déconnecter
                                    </a>
                                </div>
                            )}
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