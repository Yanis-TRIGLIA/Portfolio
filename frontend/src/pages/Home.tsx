
import { useState, useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Calendar, Building, GraduationCap, Code, BookOpen, CheckCircle, Users, Lightbulb, Heart, Camera, Plane, Clock, Award, Briefcase, Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { GeometricCanvas } from '../components/GeometricCanvas';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import Typewriter from '../components/text/Typewritter';
import { api } from '../services/api';
import type { Blog, Project, Tag } from '../lib/type';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Command } from 'cmdk';
import { Badge } from '../components/ui/badge';
import { TerminalCard } from '../components/TerminalCard';




const Home = () => {


    const [selectedTag, setSelectedTag] = useState(["Tout les projets"]);
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
    const [tag, setTag] = useState<Tag[]>([]);
    const [blog, setBlog] = useState<Blog[]>([]);
    const [open, setOpen] = useState(false)
    const [projects, setProject] = useState<Project[]>([]);
    const [showTitle, setShowTitle] = useState(false);
    const [showDesc, setShowDesc] = useState(false);
    const [closedProjects, setClosedProjects] = useState<Set<number>>(new Set());
    

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

    const handleCloseProject = (projectId: number) => {
        setClosedProjects(prev => new Set([...prev, projectId]));
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
        getallprojects();
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





    const filteredProjects = selectedTag && selectedTag.length > 0
        //on exlue closedProjects
        ? projects.filter(project => {
            const projectTags = project.tag.map(tag => tag.name);
            return selectedTag.includes("Tout les projets") || selectedTag.some(tag => projectTags.includes(tag));
        }).filter(project => !closedProjects.has(project.id))
        : projects.filter(project => !closedProjects.has(project.id));

    interface HandleSelectEvent {
        (value: string): void;
    }

    const handleSelect: HandleSelectEvent = (value) => {
        if (value === "all") {
            setSelectedTag([])
            return
        }

        const newSelectedTags = selectedTag.includes(value)
            ? selectedTag.filter((tag: string) => tag !== value)
            : [...selectedTag, value]

        setSelectedTag(newSelectedTags)
    }


    const availableTags = [tag.map(item => item.name), "Tout les projets"].flat().filter((value, index, self) => self.indexOf(value) === index);
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

            <section id="projects" className="py-20 relative overflow-hidden" ref={projectsRef}>
                <div className="absolute inset-0 w-full h-full">
                    <video
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster=""
                    >
                        <source src="/video/code.mp4" type="video/mp4" />
                        Votre navigateur ne supporte pas les vidéos HTML5.
                    </video>

                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl font-bold mb-12 font-serif text-white leading-tight categories_white drop-shadow-lg">
                        Projets
                    </h2>

                    <div className="mb-8 flex justify-center">
                        <div className="w-full max-w-md">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between border-2 border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/30 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[40px] h-auto text-white"
                                    >
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
                                                {selectedTag.length === 0 ? (
                                                    <span className="truncate text-sm font-medium text-white/80">
                                                        Filtrer par technologie
                                                    </span>
                                                ) : selectedTag.length <= 2 ? (
                                                    selectedTag.map((tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="secondary"
                                                            className="bg-white/20 text-white border-white/30 text-xs px-2 py-0.5 gap-1 backdrop-blur-sm"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-white/20 text-white border-white/30 text-xs px-2 py-0.5 backdrop-blur-sm"
                                                        >
                                                            {selectedTag.length} sélectionnées
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-5 w-5 p-0 hover:bg-red-500/20 text-white"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setSelectedTag([])
                                                            }}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-70 text-white" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-2 border-white/20 shadow-2xl bg-black/80 backdrop-blur-xl">
                                    <Command className="rounded-lg">
                                        <div className="flex items-center px-3 py-2 border-b border-white/20">
                                            <Search className="mr-2 h-4 w-4 shrink-0 text-white/60" />
                                            <Command.Input
                                                placeholder="Rechercher une technologie..."
                                                className="flex-1 bg-transparent border-0 outline-none placeholder:text-white/60 text-sm text-white"
                                            />
                                        </div>

                                        {selectedTag.length > 0 && (
                                            <div className="px-3 py-2 border-b border-white/10 bg-white/5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-white/60">
                                                        {selectedTag.length} technologie{selectedTag.length > 1 ? 's' : ''} sélectionnée{selectedTag.length > 1 ? 's' : ''}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 px-2 text-xs hover:bg-red-500/20 hover:text-red-300 text-white/80"
                                                        onClick={() => setSelectedTag([])}
                                                    >
                                                        Tout effacer
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        <Command.List className="max-h-[300px] overflow-y-auto">
                                            <Command.Empty className="py-6 text-center text-sm text-white/60">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Search className="h-8 w-8 opacity-40" />
                                                    <span>Aucune technologie trouvée</span>
                                                </div>
                                            </Command.Empty>
                                            <Command.Group className="p-2">
                                                <Command.Item
                                                    value="all"
                                                    onSelect={() => handleSelect("all")}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/10 cursor-pointer transition-colors duration-150 text-white"
                                                >
                                                    <div className="flex items-center justify-center w-5 h-5">
                                                        <Check
                                                            className={cn(
                                                                "h-4 w-4 transition-opacity duration-200 text-blue-400",
                                                                selectedTag.length === 0 ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <span className="text-sm font-medium">Tous les projets</span>
                                                        {selectedTag.length === 0 && (
                                                            <Badge variant="outline" className="text-xs border-blue-400/50 text-blue-300 bg-blue-500/10">
                                                                Actuel
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </Command.Item>

                                                {availableTags
                                                    .filter(tag => tag && tag !== "null" && tag !== "undefined")
                                                    .slice(0, 15)
                                                    .map(tag => {
                                                        const isSelected = selectedTag.includes(tag)
                                                        return (
                                                            <Command.Item
                                                                key={String(tag)}
                                                                value={String(tag)}
                                                                onSelect={() => handleSelect(String(tag))}
                                                                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/10 cursor-pointer transition-colors duration-150 text-white"
                                                            >
                                                                <div className="flex items-center justify-center w-5 h-5">
                                                                    <Check
                                                                        className={cn(
                                                                            "h-4 w-4 transition-opacity duration-200",
                                                                            isSelected ? "opacity-100 text-blue-400" : "opacity-0"
                                                                        )}
                                                                    />
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-1">
                                                                    <span className={cn(
                                                                        "text-sm font-medium",
                                                                        isSelected && "text-blue-300"
                                                                    )}>
                                                                        {tag}
                                                                    </span>
                                                                    {isSelected && (
                                                                        <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-300 border-blue-400/50">
                                                                            Sélectionné
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </Command.Item>
                                                        )
                                                    })}
                                            </Command.Group>
                                        </Command.List>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project) => (
                            <TerminalCard
                                key={project.id}
                                id={project.id}
                                title={project.name}
                                description={project.description}
                                image={`http://127.0.0.1:8000/${project.images}`}
                                tags={project.tag.map(tag => tag.name)}
                                onClose={() => handleCloseProject(project.id)}
                            />
                        ))}
                    </div>
                </div>
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
                                        src={`http://127.0.0.1:8000/${post.cover}`}
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

export default Home;
