
import { useState, useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Calendar, Building, GraduationCap, Code, BookOpen, CheckCircle, Users, Lightbulb, Heart, Camera, Plane, Clock, Award, Briefcase } from 'lucide-react';
import { GeometricCanvas } from '../components/GeometricCanvas';
import { useIntersectionObserver } from '../hook/useIntersectionObserver';
import Typewriter from '../components/text/Typewritter';
import { api } from '../services/api';
import type { Project, Tag } from '../lib/type';


const Home2 = () => {


    const [selectedTag, setSelectedTag] = useState("all");
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
    const [showName, setShowName] = useState(true);
    const [tag, setTag] = useState<Tag[]>([]);
    const [projects, setProject] = useState<Project[]>([]);
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
    const getallprojects = async () => {
        try {
            const response = await api.get('/project', null);
            setProject(response as Project[]);
        } catch (error) {
            console.error('Erreur lors de la récupération des projets:', error);
        }
    }

    useEffect(() => {
        getallstats();
        getallprojects();
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






    const filteredProjects = selectedTag === "all"
        ? projects
        : projects.filter(project => project.tags.map(String).includes(String(selectedTag)));

    const availableTags = ["all", ...Array.from(new Set(projects.flatMap(p => p.tags)))];
    const bgRef = useRef<HTMLDivElement>(null);
    const [offsetY, setOffsetY] = useState(0);
    function cn(...classes: (string | false | null | undefined)[]): string {
        return classes.filter(Boolean).join(' ');
    } return (
        <div className="min-h-screen">


            <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden" >
                <GeometricCanvas />
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-6xl md:text-8xl font-bold mb-4 min-h-[120px] md:min-h-[160px] flex items-center justify-center">
                        {showName && (
                            <Typewriter
                                text="YANIS TRIGLIA"
                                onComplete={handleNameComplete}
                            />
                        )}
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

            {/* About Section */}

            {/* Contenu */}
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

                {/* Contenu */}
                <div className="relative z-20 container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-12 font-serif text-white leading-tight categories_white">
                        À propos
                    </h2>
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <div className="flex justify-start space-x-2">
                            <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
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

                {/* Contenu au premier plan */}
                <div className="relative z-20 container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 font-serif text-gray-800 leading-tight categories">
                        Diplômes
                    </h2>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>

                        {/* 1er diplôme */}
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

                        {/* 2e diplôme */}
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

                        {/* 3e diplôme */}
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


            {/* Experience Section */}
            <section id="experience" className="py-20" ref={experiencesRef}>
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 font-serif text-gray-800 leading-tight categories">
                        Expériences
                    </h2>
                    <div className="space-y-8">
                        <Card className={`p-8 border-l-4 border-blue-500 transition-all duration-1000 ${visibleSections.has('experiences') ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                                        <span className="text-blue-600 font-bold">2024 – Actuellement</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Building className="mr-2 h-5 w-5 text-gray-600" />
                                        <span className="font-medium text-gray-800">La Ligne Web</span>
                                    </div>
                                    <div className="flex items-start">
                                        <MapPin className="mr-2 h-4 w-4 text-gray-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-600 text-sm">1140 Rue André Ampère, Aix-en-Provence</span>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="flex items-center mb-4">
                                        <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                                        <h3 className="text-xl font-bold text-gray-800">Stage de développement Front-End React</h3>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">
                                        Développement d'interfaces utilisateur modernes et responsives en utilisant React et TypeScript.
                                        Collaboration avec l'équipe de design pour implémenter des solutions créatives et optimisées.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className={`p-8 border-l-4 border-green-500 transition-all duration-1000 delay-300 ${visibleSections.has('experiences') ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-5 w-5 text-green-600" />
                                        <span className="text-green-600 font-bold">2023</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Building className="mr-2 h-5 w-5 text-gray-600" />
                                        <span className="font-medium text-gray-800">Alithya</span>
                                    </div>
                                    <div className="flex items-start">
                                        <MapPin className="mr-2 h-4 w-4 text-gray-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-600 text-sm">25 Rue de la Petite Duranne, Aix-en-Provence</span>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="flex items-center mb-4">
                                        <Briefcase className="mr-2 h-5 w-5 text-green-600" />
                                        <h3 className="text-xl font-bold text-gray-800">Stage de développement Full Stack</h3>
                                    </div>
                                    <div className="space-y-3 text-gray-600">
                                        <p>• Création d'une application from scratch ressemblant à un réseau professionnel (type LinkedIn)</p>
                                        <p>• Développement en mode agile (méthode SCRUM)</p>
                                        <p>• Front-End : React + TypeScript</p>
                                        <p>• Back-End : Laravel (PHP) et Java Spring Boot</p>
                                        <p>• Participation à la maintenance évolutive des applications du CSN</p>
                                        <p>• Technologies : Java, Spring Boot, PostgreSQL, Angular + TypeScript</p>
                                    </div>
                                    <div className="mt-4">
                                        <a href="https://eden.fftir.org/" className="text-blue-600 hover:underline flex items-center">
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

            {/* Projects Section */}
            <section id="projects" className="py-20 bg-gray-50" ref={projectsRef}>
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 font-serif text-gray-800 leading-tight categories">
                        Projets
                    </h2>
                    <div className="mb-8 flex justify-center">
                        <Select value={selectedTag} onValueChange={setSelectedTag}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filtrer par technologie" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTags.map(tag => (
                                    <SelectItem key={String(tag)} value={String(tag)}>
                                        {tag === "all" ? "Tous les projets" : String(tag)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        { projects.map((project, index) => (
                            
                            <Card
                                key={project.id}
                                className={`overflow-hidden hover:shadow-lg transition-all duration-1000 cursor-pointer ${visibleSections.has('projects') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                    }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                                onClick={() => window.open(`/project/${project.id}`, '_blank')}
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={`http://127.0.0.1:8000/${project.images}`}
                                        alt={project.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                                    <p className="text-gray-600 mb-4">{project.decription}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {/* {project.tags.map(tag => (
                                            <Badge key={tag.id ?? tag.name} variant="secondary">{tag.name}</Badge>
                                        ))} */}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section id="blog" className="py-20" ref={blogRef}>
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 font-serif text-gray-800 leading-tight categories">
                        Blog
                    </h2>
                    {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post, index) => (
                            <Card
                                key={post.id}
                                className={`overflow-hidden hover:shadow-lg transition-all duration-1000 cursor-pointer ${visibleSections.has('blog') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                    }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                                onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                                    <p className="text-gray-600">{post.excerpt}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div> */}
                </div>
            </section>

            {/* Contact & Footer */}
            <section id="contact" className="py-20 bg-gray-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-8 font-serif">Contact</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center">
                                    <Mail className="mr-3 h-5 w-5 text-blue-400" />
                                    <span>contact@julien-dupont.dev</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="mr-3 h-5 w-5 text-blue-400" />
                                    <span>+33 6 12 34 56 78</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="mr-3 h-5 w-5 text-blue-400" />
                                    <span>Aix-en-Provence, France</span>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <Button variant="outline" size="icon" className="text-white border-white hover:bg-white hover:text-gray-900">
                                    <Github className="h-5 w-5" />
                                </Button>
                                <Button variant="outline" size="icon" className="text-white border-white hover:bg-white hover:text-gray-900">
                                    <Linkedin className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        <div>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input placeholder="Nom *" className="bg-gray-800 border-gray-700 text-white" />
                                    <Input placeholder="Prénom" className="bg-gray-800 border-gray-700 text-white" />
                                </div>
                                <Input placeholder="E-mail *" type="email" className="bg-gray-800 border-gray-700 text-white" />
                                <Input placeholder="Téléphone" className="bg-gray-800 border-gray-700 text-white" />
                                <Input placeholder="Objet *" className="bg-gray-800 border-gray-700 text-white" />
                                <Textarea placeholder="Message *" className="bg-gray-800 border-gray-700 text-white min-h-32" />
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    Envoyer
                                </Button>
                            </form>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-12 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 mb-4 md:mb-0">
                                © 2025 Julien Dupont – Tous droits réservés
                            </p>
                            <div className="flex space-x-6 text-sm text-gray-400">
                                <a href="/sitemap" className="hover:text-white transition-colors">Plan du site</a>
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

export default Home2;
