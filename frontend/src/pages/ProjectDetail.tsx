import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { api } from '../services/api';
import { useEffect, useState } from 'react';
import type { Project } from '../lib/type';
const { VITE_API_BASE } = import.meta.env;

const ProjectDetail = () => {
  const { id } = useParams();

  const [project, setProject] = useState<Project>();

  const getprojectbyid = async () => {
    try {
      const response = await api.get(`/project/${id}`, null);
      console.log('Project response:', response);
      setProject(response as Project);
    } catch (error) {
      console.error('Erreur lors de la récupération du post:', error);
    }
  }

  useEffect(() => {
    if (id) {
      getprojectbyid();
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Projet non trouvé</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au portfolio
        </Link>

        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          {/* Image réduite avec hauteur limitée */}
          <div className="h-64 md:h-80 overflow-hidden">
            <img
              src={`${VITE_API_BASE}${project.images}`}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-4xl font-bold mb-4 md:mb-0">{project.name}</h1>
              <div className="flex space-x-4">
                {project.link_project && (
                  <Button asChild className='bg-black text-white hover:bg-gray-800'>
                    <a href={project.link_project} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Voir le projet
                    </a>
                  </Button>
                )} 
                {project.github_project && (
                  <Button variant="outline" asChild>
                    <a href={project.github_project} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Code source
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tag.map(tag => (
                <Badge key={typeof tag === 'string' ? tag : tag.id ?? tag.name} variant="secondary" className="text-sm bg-gray-300/40">
                  {typeof tag === 'string' ? tag : tag.name}
                </Badge>
              ))}
            </div>

            <div className="prose max-w-none">
              {project.description.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-semibold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('- **')) {
                  return <li key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: paragraph.replace('- **', '<strong>').replace('**', '</strong>') }} />;
                }
                if (paragraph.trim() === '') {
                  return <br key={index} />;
                }
                return <p key={index} className="mb-4 text-gray-600 leading-relaxed">{paragraph}</p>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;