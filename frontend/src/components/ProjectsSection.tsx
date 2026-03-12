import React, { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';
import { TerminalCard } from '../components/TerminalCard';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { FolderOpen, Code2, ChevronsUpDown, Search, Check, X } from 'lucide-react';
import type { Project, Tag } from '../lib/type';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Command } from 'cmdk';
import { api } from '../services/api';
const { VITE_API_BASE } = import.meta.env;

interface ProjectsSectionProps {
  visibleSections: Set<string>;
  onSectionVisibilityChange: (section: string, isVisible: boolean) => void;
}

const ProjectsSection = ({ visibleSections, onSectionVisibilityChange }: ProjectsSectionProps) => {
  const projectsRef = useRef<HTMLDivElement>(null);
  const [closedProjects, setClosedProjects] = useState<Set<number>>(new Set());
  const [selectedTags, setSelectedTags] = useState<string[]>(["Tout les projets"]);
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useIntersectionObserver(projectsRef as React.RefObject<Element>, (isVisible) => {
    onSectionVisibilityChange('projects', isVisible);
  });

  const getAllProjects = async () => {
    try {
      const response = await api.get('/project', null);
      setProjects(response as Project[]);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
    }
  };

  const getAllTags = async () => {
    try {
      const response = await api.get('/tag', null);
      setTags(response as Tag[]);
    } catch (error) {
      console.error('Erreur lors de la récupération des tags:', error);
    }
  };

  useEffect(() => {
    getAllProjects();
    getAllTags();
  }, []);

  useEffect(() => {
    if (selectedTags.length === 0) {
      setSelectedTags(["Tout les projets"]);
    }
  }, [selectedTags]);

  const availableTags = Array.from(
    new Set([
      "Tout les projets",
      ...tags.map(tag => tag.name),
      ...projects.flatMap(project => project.tag.map(t => t.name))
    ])
  ).filter(tag => tag && tag !== "null" && tag !== "undefined");

  const filteredProjects = selectedTags.includes("Tout les projets")
    ? projects.filter(project => !closedProjects.has(project.id))
    : projects.filter(project => {
      const projectTags = project.tag.map(tag => tag.name);
      return selectedTags.some(tag => projectTags.includes(tag)) &&
        !closedProjects.has(project.id);
    });

  const handleCloseProject = (projectId: number) => {
    setClosedProjects(prev => new Set([...prev, projectId]));
  };

  const handleSelect = (value: string) => {
    if (value === "Tout les projets") {
      setSelectedTags(["Tout les projets"]);
      return;
    }

    setSelectedTags(prev => {
      // Si "Tout les projets" était sélectionné, on le retire
      const newTags = prev.filter(tag => tag !== "Tout les projets");

      if (newTags.includes(value)) {
        // Retirer le tag s'il est déjà sélectionné
        return newTags.filter(tag => tag !== value);
      } else {
        // Ajouter le tag
        return [...newTags, value];
      }
    });
  };

  const cn = (...classes: (string | false | null | undefined)[]): string => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden" ref={projectsRef}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-200/30 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-cyan-200/30 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`transition-all duration-1000 ${visibleSections.has('projects') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <h2 className="text-3xl font-bold mb-8 font-serif text-gray-800 leading-tight text-center">
            <Code2 className="inline-block mr-3 text-blue-600" />
            Mes Projets
          </h2>

          {/* File Container */}
          <div className="max-w-7xl mx-auto">
            {/* File Tab */}
            <div className="flex justify-center mb-0">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-t-xl px-6 py-3 shadow-lg relative">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                  <span className="font-mono text-sm text-gray-700">projects/</span>
                </div>
                {/* File tab notch */}
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-white/80"></div>
              </div>
            </div>

            {/* File Content */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl rounded-tl-none shadow-2xl p-8 relative">
              {/* File Header with Filter */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8 pb-4 border-b border-gray-200">

                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="ml-4 font-mono text-sm text-gray-600">
                    {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
                  </span>
                </div>

                <Popover open={open} onOpenChange={setOpen} >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[220px] justify-between border-2 border-gray-200  bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow hover:shadow-md min-h-[40px] h-auto"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
                          {selectedTags.length === 0 || selectedTags.includes("Tout les projets") ? (
                            <span className="truncate text-sm font-medium text-gray-700">
                              Filtrer par technologie
                            </span>
                          ) : selectedTags.length <= 2 ? (
                            selectedTags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-0.5 gap-1"
                              >
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-0.5"
                              >
                                {selectedTags.length} sélectionnées
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 hover:bg-red-100 text-gray-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTags(["Tout les projets"]);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-70" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border border-gray-200 shadow-lg bg-white">
                    <Command className="rounded-lg">
                      <div className="flex items-center px-3 py-2 border-b border-gray-200">
                        <Search className="mr-2 h-4 w-4 shrink-0 text-gray-500" />
                        <Command.Input
                          placeholder="Rechercher une technologie..."
                          className="flex-1 bg-transparent border-0 outline-none placeholder:text-gray-500 text-sm text-gray-700"
                        />
                      </div>

                      {selectedTags.length > 0 && !selectedTags.includes("Tout les projets") && (
                        <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {selectedTags.length} technologie{selectedTags.length > 1 ? 's' : ''} sélectionnée{selectedTags.length > 1 ? 's' : ''}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs hover:bg-red-100 hover:text-red-500 text-gray-500"
                              onClick={() => setSelectedTags(["Tout les projets"])}
                            >
                              Tout effacer
                            </Button>
                          </div>
                        </div>
                      )}

                      <Command.List className="max-h-[300px] overflow-y-auto">
                        <Command.Empty className="py-6 text-center text-sm text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <Search className="h-8 w-8 opacity-40" />
                            <span>Aucune technologie trouvée</span>
                          </div>
                        </Command.Empty>
                        <Command.Group className="p-2">
                          <Command.Item
                            value="Tout les projets"
                            onSelect={() => handleSelect("Tout les projets")}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-150 text-gray-700"
                          >
                            <div className="flex items-center justify-center w-5 h-5">
                              <Check
                                className={cn(
                                  "h-4 w-4 transition-opacity duration-200 text-blue-500",
                                  selectedTags.includes("Tout les projets") ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-sm font-medium">Tous les projets</span>
                              {selectedTags.includes("Tout les projets") && (
                                <Badge variant="outline" className="text-xs border-blue-500 text-blue-500 bg-blue-50">
                                  Actuel
                                </Badge>
                              )}
                            </div>
                          </Command.Item>

                          {availableTags
                            .filter(tag => tag !== "Tout les projets")
                            .slice(0, 15)
                            .map(tag => {
                              const isSelected = selectedTags.includes(tag);
                              return (
                                <Command.Item
                                  key={tag}
                                  value={tag}
                                  onSelect={() => handleSelect(tag)}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-150 text-gray-700"
                                >
                                  <div className="flex items-center justify-center w-5 h-5">
                                    <Check
                                      className={cn(
                                        "h-4 w-4 transition-opacity duration-200",
                                        isSelected ? "opacity-100 text-blue-500" : "opacity-0"
                                      )}
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 flex-1">
                                    <span className={cn(
                                      "text-sm font-medium",
                                      isSelected && "text-blue-600"
                                    )}>
                                      {tag}
                                    </span>
                                    {isSelected && (
                                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-500 border-blue-500">
                                        Sélectionné
                                      </Badge>
                                    )}
                                  </div>
                                </Command.Item>
                              );
                            })}
                        </Command.Group>
                      </Command.List>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Projects Carousel */}
              {filteredProjects.length > 0 ? (
                <Carousel
                  opts={{
                    align: "start",
                    slidesToScroll: 1,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {filteredProjects.map((project, index) => (
                      <CarouselItem key={project.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <div
                          className={`transition-all duration-1000 ${visibleSections.has('projects')
                            ? 'translate-y-0 opacity-100 scale-100'
                            : 'translate-y-8 opacity-0 scale-95'
                            }`}
                          style={{
                            transitionDelay: `${index * 150}ms`,
                            transformOrigin: 'center'
                          }}
                        >
                          <TerminalCard
                            key={project.id}
                            id={project.id}
                            title={project.name}
                            short_description={project.short_description}
                            image={`${VITE_API_BASE}${project.images}`}
                            tags={project.tag.map(tag => tag.name)}
                            onClose={() => handleCloseProject(project.id)}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {filteredProjects.length > 3 && (
                    <>
                      <CarouselPrevious className="bg-white/80 hover:bg-white border-gray-300 -left-6" />
                      <CarouselNext className="bg-white/80 hover:bg-white border-gray-300 -right-6" />
                    </>
                  )}
                </Carousel>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  </div>
                  <p className="text-gray-500 font-mono">Aucun projet trouvé pour ce filtre</p>
                </div>
              )}

              {/* File Footer */}
              <div className="mt-8 pt-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500 font-mono">
                  💡 Projet Professionnel / Personnel
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;