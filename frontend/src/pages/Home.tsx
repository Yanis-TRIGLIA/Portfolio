
import { useState, useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Calendar, Building, GraduationCap, Code, BookOpen, CheckCircle, Users, Lightbulb, Heart, Camera, Plane, Clock, Award, Briefcase } from 'lucide-react';
import { GeometricCanvas } from '../components/GeometricCanvas';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import Typewriter from '../components/text/Typewritter';
import { api } from '../services/api';
import type { Blog, Tag } from '../lib/type';
import ReCAPTCHA from 'react-google-recaptcha';
import CVSection from '../components/CVSection';
import ProjectsSection from '../components/ProjectsSection';
import MapSection from './MapSection';
const { VITE_API_BASE } = import.meta.env;



const Home = () => {


    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
    const [tag, setTag] = useState<Tag[]>([]);
    const [blog, setBlog] = useState<Blog[]>([]);
    const [showTitle, setShowTitle] = useState(false);
    const [showDesc, setShowDesc] = useState(false);


    const skillsRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const experiencesRef = useRef<HTMLDivElement>(null);
    const projectsRef = useRef<HTMLDivElement>(null);
    const blogRef = useRef<HTMLDivElement>(null);


    const handleNameComplete = () => {
        setTimeout(() => {
            setShowTitle(true);
        }, 500);
    };
    const handledescriptioncomplete = () => {
        setTimeout(() => {
            setShowDesc(true);
        }, 500);
    };

    useIntersectionObserver(skillsRef as RefObject<Element>, (isVisible) => {
        setVisibleSections(prev => {
            const newSet = new Set(prev);
            if (isVisible) {
                newSet.add('skills');
            } else {
                newSet.delete('skills');
            }
            return newSet;
        });
    });

    useIntersectionObserver(timelineRef as RefObject<Element>, (isVisible) => {
        setVisibleSections(prev => {
            const newSet = new Set(prev);
            if (isVisible) {
                newSet.add('timeline');
            } else {
                newSet.delete('timeline');
            }
            return newSet;
        });
    });

    useIntersectionObserver(experiencesRef as RefObject<Element>, (isVisible) => {
        setVisibleSections(prev => {
            const newSet = new Set(prev);
            if (isVisible) {
                newSet.add('experiences');
            } else {
                newSet.delete('experiences');
            }
            return newSet;
        });
    });

    useIntersectionObserver(projectsRef as RefObject<Element>, (isVisible) => {
        setVisibleSections(prev => {
            const newSet = new Set(prev);
            if (isVisible) {
                newSet.add('projects');
            } else {
                newSet.delete('projects');
            }
            return newSet;
        });
    });

    useIntersectionObserver(blogRef as RefObject<Element>, (isVisible) => {
        setVisibleSections(prev => {
            const newSet = new Set(prev);
            if (isVisible) {
                newSet.add('blog');
            } else {
                newSet.delete('blog');
            }
            return newSet;
        });
    });

    const getallstats = async () => {
        try {

            const response = await api.get('/tag', null);
            setTag(response as Tag[]);

        } catch (error) {
            console.error('Erreur lors de la récupération des posts:', error);
        }
    };

    const getallblog = async () => {
        try {
            const response = await api.get('/blog', null);
            setBlog(response as Blog[]);
        } catch (error) {
            console.error('Erreur lors de la récupération des posts:', error);
        }
    }





    useEffect(() => {
        getallstats();
        getallblog();
        const handleScroll = () => {
            if (bgRef.current) {
                const speed = 0.3;
                setOffsetY(window.scrollY * speed);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    const tabValues = ["languages", "skills", "passions"]
    const [activeTab, setActiveTab] = useState(tabValues[0])

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTab((prev) => {
                const currentIndex = tabValues.indexOf(prev)
                const nextIndex = (currentIndex + 1) % tabValues.length
                return tabValues[nextIndex]
            })
        }, 5000)

        return () => clearInterval(interval)
    }, [])





    const skills = {

        frontend: tag.filter(item => item.categories === "Frontend").map(item => (
            {
                name: item.name,
                level: item.master_percentage,
            }
        )),
        backend: tag.filter(item => item.categories === "Backend").map(item => (
            {
                name: item.name,
                level: item.master_percentage,
            }
        )),
        others: tag.filter(item => item.categories === "Autres").map(item => (
            {
                name: item.name,
                level: item.master_percentage,
            }
        )),
    };





    const bgRef = useRef<HTMLDivElement>(null);
    const [offsetY, setOffsetY] = useState(0);
    function cn(...classes: (string | false | null | undefined)[]): string {
        return classes.filter(Boolean).join(' ');

    }

    const handleSectionVisibilityChange = (section: string, isVisible: boolean) => {
        setVisibleSections(prev => {
            const newSet = new Set(prev);
            if (isVisible) {
                newSet.add(section);
            } else {
                newSet.delete(section);
            }
            return newSet;
        });
    };

    ///mail

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [captchaValue, setCaptchaValue] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!captchaValue) {
            setSubmitStatus({
                success: false,
                message: 'Veuillez compléter le CAPTCHA'
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await api.post('/contact', {
                ...formData,
                captcha: captchaValue
            }, "");
            console.log(response)

            setSubmitStatus({
                success: true,
                message: 'Message envoyé avec succès!'
            });
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
            setCaptchaValue(null);
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            setSubmitStatus({
                success: false,
                message: 'Erreur lors de l\'envoi du message. Veuillez réessayer.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };



    return (

        <div className="min-h-screen">


            <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden" >
                <GeometricCanvas />
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-6xl md:text-8xl font-bold mb-4 min-h-[120px] md:min-h-[160px] flex items-center justify-center">

                        <Typewriter
                            text="YANIS TRIGLIA"
                            onComplete={handleNameComplete}
                        />

                        {!showTitle &&
                            <span className="animate-pulse ml-2">|</span>
                        }
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 min-h-[40px] flex items-center justify-center">
                        {showTitle && (
                            <>
                                <Typewriter
                                    text="Développeur Full Stack"
                                    onComplete={handledescriptioncomplete}
                                />
                                {!showDesc &&
                                    <span className="animate-pulse ml-2">|</span>
                                }
                            </>
                        )}
                    </p>
                </div>
            </section>


            <section id="about" className="relative py-20 overflow-hidden">


                <div
                    ref={bgRef}
                    className="absolute top-0 left-0 w-full h-[200%] bg-cover bg-center"

                    style={{
                        backgroundImage: `url('/images/coding.jpg')`,
                        transform: `translateY(-${offsetY}px)`
                        ,
                    }}
                ></div>


                <div className="absolute inset-0 bg-black/40  z-10"></div>

                <div className="relative z-20 container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-12 font-serif text-white leading-tight categories_white">
                        À propos
                    </h2>
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <div className="flex justify-start space-x-2">
                            <img
                                src="https://www.einerd.com/wp-content/uploads/2017/10/dragonballsuper-transforma%C3%A7%C3%A3oGokucapa-890x606.jpg"
                                alt="Portrait"
                                className="w-52 h-52 rounded-full object-cover shadow-lg"
                            />

                            <p className="text-white text-base md:text-lg leading-relaxed py-5">
                                Je suis un développeur web passionné avec un intérêt marqué pour les technologies émergentes,
                                l’open source et le design fonctionnel. Mon parcours m’a permis de développer une solide
                                capacité d’adaptation, une grande curiosité et un goût pour la collaboration.
                            </p>

                        </div>



                        <div>


                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 " style={{ backgroundColor: 'hsl(210 40% 96.1%)' }}>
                                    <TabsTrigger value="languages" className='cursor-pointer'>Langues</TabsTrigger>
                                    <TabsTrigger value="skills" className='cursor-pointer'>Soft Skills</TabsTrigger>
                                    <TabsTrigger value="passions" className='cursor-pointer'>Passions</TabsTrigger>
                                </TabsList>

                                <TabsContent value="languages" className="mt-6">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-4xl mb-2">🇫🇷</span>
                                            <span className="text-sm font-medium text-white">Français</span>
                                            <span className="text-xs text-gray-400">Langue maternelle</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-4xl mb-2">🇬🇧</span>
                                            <span className="text-sm font-medium text-white">Anglais</span>
                                            <span className="text-xs text-gray-400">Niveau B2</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-4xl mb-2">🇮🇹</span>
                                            <span className="text-sm font-medium text-white">Italien</span>
                                            <span className="text-xs text-gray-400">Niveau B1</span>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="skills" className="mt-6">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                            <Users className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm">Communication efficace</span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span className="text-sm">Travail en équipe</span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                            <Lightbulb className="h-4 w-4 text-yellow-600" />
                                            <span className="text-sm">Résolution de problèmes</span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                            <Heart className="h-4 w-4 text-red-600" />
                                            <span className="text-sm">Adaptabilité</span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                            <Clock className="h-4 w-4 text-purple-600" />
                                            <span className="text-sm">Gestion du temps</span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                            <BookOpen className="h-4 w-4 text-indigo-600" />
                                            <span className="text-sm">Esprit critique</span>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="passions" className="mt-6">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                            <Code className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm">Technologies émergentes</span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                            <Github className="h-4 w-4 text-gray-600" />
                                            <span className="text-sm">Open Source</span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                            <Camera className="h-4 w-4 text-green-600" />
                                            <span className="text-sm">Photographie</span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                            <Plane className="h-4 w-4 text-sky-600" />
                                            <span className="text-sm">Voyage</span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                            <Heart className="h-4 w-4 text-red-600" />
                                            <span className="text-sm">Sport</span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                            <BookOpen className="h-4 w-4 text-indigo-600" />
                                            <span className="text-sm">Lecture technique</span>
                                        </div>
                                    </div>
                                </TabsContent>
                                <div className="flex justify-center gap-2 mt-6">
                                    {tabValues.map((tab) => (
                                        <div
                                            key={tab}
                                            className={cn(
                                                "w-3 h-3 rounded-full border border-white transition-all duration-300",
                                                activeTab === tab ? "bg-white" : "bg-transparent opacity-50"
                                            )}
                                        />
                                    ))}
                                </div>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="py-20" ref={skillsRef} >
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 font-serif text-gray-800 leading-tight categories">
                        Compétences
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {Object.entries(skills).map(([category, skillList]) => (
                            <Card key={category} className="p-6">
                                <h3 className="text-xl font-semibold mb-6 capitalize flex items-center">
                                    <Code className="mr-2 h-5 w-5 text-blue-600" />
                                    {category === 'frontend' ? 'Frontend' : category === 'backend' ? 'Backend' : 'Autres'}
                                </h3>
                                <div className="space-y-4">
                                    {skillList.map((skill) => (
                                        <div key={skill.name}>
                                            <div className="flex justify-between mb-2">
                                                <span>{skill.name}</span>
                                                <span>{skill.level}%</span>
                                            </div>
                                            <Progress
                                                value={visibleSections.has('skills') ? skill.level : 0}
                                                className="h-3"
                                            >
                                            </Progress>

                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="education"
                className="relative py-20 overflow-hidden"
                ref={timelineRef}
            >
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center "
                    style={{ backgroundImage: `url('/images/diplomes.webp')` }}
                ></div>

                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-10"></div>

                <div className="relative z-20 container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 font-serif text-gray-800 leading-tight categories">
                        Diplômes
                    </h2>


                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>

                        <div className={`relative transition-all duration-1000 ${visibleSections.has('timeline') ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                            <div className="flex items-start mb-12">
                                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                                    <GraduationCap className="h-8 w-8 text-white" />
                                </div>
                                <div className="ml-8 bg-white p-8 rounded-xl shadow-lg border-l-4 border-blue-500 flex-1">
                                    <a href='https://www.cesi.fr/formation/manager-en-architecture-et-applications-logicielles-des-si-en-alternance-2371646/' target='_blank'>
                                        <div className="flex items-center mb-3">
                                            <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                                            <span className="text-blue-600 font-bold text-lg">2024 – 2026</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-gray-800">Mastère Professionnel Manager en Architecture et Applications Logicielles des SI</h3>
                                        <div className="flex items-center text-gray-600">
                                            <Building className="mr-2 h-4 w-4" />
                                            <span>CESI Aix-en-Provence</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className={`relative transition-all duration-1000 delay-300 ${visibleSections.has('timeline') ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                            <a href='https://iut.univ-amu.fr/fr/formations/bachelor-universitaire-de-technologie/but-informatique/but-info-aix' target='_blank'>
                                <div className="flex items-start mb-12">
                                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                                        <Code className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="ml-8 bg-white p-8 rounded-xl shadow-lg border-l-4 border-green-500 flex-1">
                                        <div className="flex items-center mb-3">
                                            <Calendar className="mr-2 h-5 w-5 text-green-600" />
                                            <span className="text-green-600 font-bold text-lg">2021 – 2024</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-gray-800">BUT Informatique (Parcours A)</h3>
                                        <p className="text-gray-600 mb-3">Réalisation d'applications : conception, développement, validation</p>
                                        <div className="flex items-center text-gray-600">
                                            <Building className="mr-2 h-4 w-4" />
                                            <span>IUT d'Aix-Marseille, site d'Aix-en-Provence</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <div className={`relative transition-all duration-1000 delay-600 ${visibleSections.has('timeline') ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                            <a href='https://www.site.ac-aix-marseille.fr/lyc-mendesfrance-vitrolles/spip/-Baccalaureat-STI2D-Sciences-et-Technologies-de-l-Industrie-et-du-Developpement-49-.html' target='_blank'>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                                        <Award className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="ml-8 bg-white p-8 rounded-xl shadow-lg border-l-4 border-purple-500 flex-1">
                                        <div className="flex items-center mb-3">
                                            <Calendar className="mr-2 h-5 w-5 text-purple-600" />
                                            <span className="text-purple-600 font-bold text-lg">2020</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-gray-800">Baccalauréat STI2D</h3>
                                        <p className="text-gray-600 mb-3">Option systèmes d'information numérique</p>
                                        <div className="flex items-center text-gray-600">
                                            <Building className="mr-2 h-4 w-4" />
                                            <span>Lycée Pierre Mendès-France</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>


            <section id="experience" className="py-20 overflow-x-hidden" ref={experiencesRef}>
                <div className="container mx-auto px-4 ">
                    <h2 className="text-3xl font-bold mb-12 font-serif text-gray-800 leading-tight categories">
                        Expériences
                    </h2>

                    <div className="space-y-8 xl:pl-24 xl:pr-24 pl-1 pr-1">

                        {/* Alternance - La Ligne Web */}
                        <Card className={`p-6 sm:p-8 border-l-4 border-yellow-400/45 transition-all duration-1000 ${visibleSections.has('experiences') ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                                        <span className="text-blue-600 font-bold text-sm sm:text-base">2024 – Actuellement</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Building className="mr-2 h-5 w-5 text-gray-600" />
                                        <a href='https://la-ligne-web.com/' target='_blank' className="font-medium text-gray-800 text-sm sm:text-base">La Ligne Web</a>
                                    </div>
                                    <div className="flex items-start">
                                        <MapPin className="mr-2 h-4 w-4 text-gray-600 mt-1 flex-shrink-0" />
                                        <a href='https://maps.app.goo.gl/sBfCHuvn89qHh62XA' target='_blank' className="text-gray-600 text-sm">1140 Rue André Ampère, Aix-en-Provence</a>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="flex items-center mb-4">
                                        <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                            Alternance – Management d'architecture et d'applications logicielles
                                        </h3>
                                    </div>
                                    <div className="text-gray-600 leading-relaxed text-sm sm:text-base space-y-4">
                                        <p>
                                            Développement d’applications web modernes à l’aide de frameworks tels que <strong>Laravel</strong>.
                                            Participation à la définition et à la mise en œuvre d’architectures logicielles adaptées aux projets.
                                        </p>
                                        <p>
                                            Approfondissement du <strong>travail en autonomie</strong> tout en collaborant avec les équipes. Lecture de <strong>cahiers des charges</strong> pour comprendre les besoins techniques et fonctionnels.
                                        </p>
                                        <p>
                                            Rôle technique de <strong>Product Owner</strong> : communication directe avec le PO pour recueillir les besoins, proposer des correctifs et identifier les évolutions.
                                        </p>
                                        <p className="mt-4">🛠️ Technologies : Laravel (PHP), React, TypeScript, Tailwind CSS, MySQL/MariaDB, commandes Unix</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Stage Front-End - La Ligne Web */}
                        <Card className={`p-6   sm:p-8 border-l-4 border-blue-500 transition-all duration-1000 ${visibleSections.has('experiences') ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                                        <span className="text-blue-600 font-bold text-sm sm:text-base">2024</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Building className="mr-2 h-5 w-5 text-gray-600" />
                                        <a href='https://la-ligne-web.com/' target='_blank' className="font-medium text-gray-800 text-sm sm:text-base">La Ligne Web</a>
                                    </div>
                                    <div className="flex items-start">
                                        <MapPin className="mr-2 h-4 w-4 text-gray-600 mt-1 flex-shrink-0" />
                                        <a href='https://maps.app.goo.gl/sBfCHuvn89qHh62XA' target='_blank' className="text-gray-600 text-sm">1140 Rue André Ampère, Aix-en-Provence</a>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="flex items-center mb-4">
                                        <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                            Stage de développement Front-End React
                                        </h3>
                                    </div>
                                    <div className="text-gray-600 leading-relaxed text-sm sm:text-base space-y-4">
                                        <p>
                                            Conception d’interfaces utilisateur modernes, responsives et maintenables en <strong>React</strong> et <strong>TypeScript</strong>.
                                            Intégration de maquettes issues de l’équipe design et mise en place de composants dynamiques.
                                        </p>
                                        <p>
                                            Participation à la création d’une application type <strong>réseau professionnel</strong> (type LinkedIn) dans un cadre <strong>SCRUM</strong>.
                                            Implication sur le front-end comme sur les échanges API avec le back-end.
                                        </p>
                                        <p className="mt-4">🛠️ Technologies : React, TypeScript, Tailwind CSS, Laravel (PHP), Spring Boot (Java), MySQL/MariaDB, commandes Unix</p>
                                    </div>
                                    <div className="mt-4">
                                        <a href="https://dringgo.fr/" className="text-blue-600 hover:underline flex items-center text-sm" target='_blank'>
                                            <ExternalLink className="mr-1 h-4 w-4" />
                                            Voir le projet Dringgo (Réseau d'entreprise)
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Stage Full Stack - Alithya */}
                        <Card className={`p-6 sm:p-8 border-l-4 border-green-500 transition-all duration-1000 delay-300 ${visibleSections.has('experiences') ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-5 w-5 text-green-600" />
                                        <span className="text-green-600 font-bold text-sm sm:text-base">2023</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Building className="mr-2 h-5 w-5 text-gray-600" />
                                        <a href='https://www.alithya.com/fr' target='_blank' className="font-medium text-gray-800 text-sm sm:text-base">Alithya</a>
                                    </div>
                                    <div className="flex items-start">
                                        <MapPin className="mr-2 h-4 w-4 text-gray-600 mt-1 flex-shrink-0" />
                                        <a href='https://maps.app.goo.gl/LzK9jbQYqy7Rgt8S6' target='_blank' className="text-gray-600 text-sm">25 Rue de la Petite Duranne, Aix-en-Provence</a>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="flex items-center mb-4">
                                        <Briefcase className="mr-2 h-5 w-5 text-green-600" />
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                            Stage de développement Full Stack
                                        </h3>
                                    </div>
                                    <div className="text-gray-600 leading-relaxed text-sm sm:text-base space-y-4">
                                        <p>
                                            Contribution à la maintenance évolutive des solutions numériques du <strong>CSN</strong> pour divers clients du secteur du sport, ainsi que sur des outils internes à <strong>Alithya</strong>.
                                        </p>
                                        <p>
                                            Réalisation de tâches <strong>full-stack</strong> dans le cadre d’un fonctionnement agile, à partir de <strong>backlogs</strong> planifiés sur plusieurs sprints.
                                        </p>
                                        <p>
                                            Développement côté back-end avec <strong>Java, Spring Boot et PostgreSQL</strong>, et côté front-end avec <strong>Angular et TypeScript</strong>.
                                        </p>
                                        <p className="mt-4"> 🛠️ Technologies : Java, Spring Boot, PostgreSQL, Angular, TypeScript</p>
                                    </div>
                                    <div className="mt-4">
                                        <a href="https://eden.fftir.org/" className="text-blue-600 hover:underline flex items-center text-sm" target='_blank'>
                                            <ExternalLink className="mr-1 h-4 w-4" />
                                            Voir le projet EDEN (Fédération Française de Tir)
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Card>

                    </div>
                </div>
            </section>



            <ProjectsSection
                visibleSections={visibleSections}
                onSectionVisibilityChange={handleSectionVisibilityChange}
            />
            <section>

                <CVSection></CVSection>
            </section>

            {/* Blog Section */}


            <section id="blog" className="py-20" ref={blogRef}>
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 font-serif categories text-gray-800 leading-tight">
                        Blog
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blog.map((post, index) => (
                            <Card
                                key={post.id}
                                className={`overflow-hidden hover:shadow-lg transition-all duration-1000 cursor-pointer ${visibleSections.has('blog') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                    }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                                onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={`${VITE_API_BASE}${post.cover}`}
                                        alt={post.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                                    <p className="text-gray-600">{post.slug}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <MapSection
                visibleSections={visibleSections}
                onSectionVisibilityChange={handleSectionVisibilityChange}
            />

            <section id="contact" className="py-20 bg-gray-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-8 font-serif">Contact</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center">
                                    <Mail className="mr-3 h-5 w-5 text-blue-400" />
                                    <a
                                        href="mailto:yanistrigl@gmail.com"
                                        className="hover:underline focus:outline-none"
                                    >
                                        yanistrigl@gmail.com
                                    </a>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="mr-3 h-5 w-5 text-blue-400" />
                                    <a
                                        href="tel:+33648622513"
                                        className="hover:underline focus:outline-none"
                                    >
                                        +33 6 48 62 25 13
                                    </a>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="mr-3 h-5 w-5 text-blue-400" />
                                    <span>Marignane, France</span>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <a href='https://github.com/Yanis-TRIGLIA'><Button variant="outline" size="icon" className="text-white border-white hover:bg-white hover:text-gray-900 cursor-pointer">
                                    <Github className="h-5 w-5" />
                                </Button></a>
                                <a href='https://www.linkedin.com/in/yanis-triglia-4a5125237/'><Button variant="outline" size="icon" className="cursor-pointer text-white border-white hover:bg-white hover:text-gray-900">
                                    <Linkedin className="h-5 w-5" />
                                </Button></a>
                            </div>
                        </div>

                        <div>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {submitStatus && (
                                    <div className={`p-4 rounded-md ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {submitStatus.message}
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        name="firstName"
                                        placeholder="Prénom *"
                                        className="bg-gray-800 border-gray-700 text-white"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        name="lastName"
                                        placeholder="Nom *"
                                        className="bg-gray-800 border-gray-700 text-white"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <Input
                                    name="email"
                                    placeholder="E-mail *"
                                    type="email"
                                    className="bg-gray-800 border-gray-700 text-white"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    name="phone"
                                    placeholder="Téléphone"
                                    className="bg-gray-800 border-gray-700 text-white"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="subject"
                                    placeholder="Objet *"
                                    className="bg-gray-800 border-gray-700 text-white"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                                <Textarea
                                    name="message"
                                    placeholder="Message *"
                                    className="bg-gray-800 border-gray-700 text-white min-h-32"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />

                                <div className="my-4 place-items-center">
                                    <ReCAPTCHA

                                        sitekey="6LdT-VwrAAAAAFUOgONis73rIwxXkShW3Y2s3l60"
                                        onChange={(value) => setCaptchaValue(value)}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-12 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 mb-4 md:mb-0">
                                © 2025 Yanis Triglia – Tous droits réservés
                            </p>
                            <div className="flex space-x-6 text-sm text-gray-400">
                                <a href="/plan_du_site" className="hover:text-white transition-colors">Plan du site</a>
                                <a href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</a>
                                <a href="/politique-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div >
    );
};

export default Home;
