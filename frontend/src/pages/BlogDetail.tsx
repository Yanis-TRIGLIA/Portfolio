import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import type { Blog } from '../lib/type';
import { api } from '../services/api';
const { VITE_API_BASE } = import.meta.env;

type EditorJSData = {
  time: number;
  blocks: Array<{
    id: string;
    type: string;
    data: any;
  }>;
  version: string;
};

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Blog>();

  const getposttbyid = async () => {
    try {
      const response = await api.get(`/blog/${id}`, null);
      setPost(response as Blog);
    } catch (error) {
      console.error('Erreur lors de la récupération du post:', error);
    }
  };

  useEffect(() => {
    if (id) {
      getposttbyid();
    }
  }, [id]);

  const renderEditorJSContent = (content: string) => {
    try {
      const data: EditorJSData = JSON.parse(content);
      
      return (
        <div className="prose max-w-none">
          {data.blocks.map((block) => {
            switch (block.type) {
              case 'header':
                return (
                  <h2 
                    key={block.id} 
                    className={`text-${block.data.level === 1 ? '3xl' : block.data.level === 2 ? '2xl' : 'xl'} font-bold my-4`}
                    dangerouslySetInnerHTML={{ __html: block.data.text }}
                  />
                );
              
              case 'paragraph':
                return (
                  <p 
                    key={block.id} 
                    className="my-4 text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: block.data.text }}
                  />
                );
              
              case 'image':
                return (
                  <div key={block.id} className="my-6">
                    <img 
                      src={block.data.file.url} 
                      alt={block.data.alt || ''} 
                      className="mx-auto rounded-lg max-w-full h-auto"
                    />
                    {block.data.caption && (
                      <p className="text-center text-sm text-gray-500 mt-2">
                        {block.data.caption}
                      </p>
                    )}
                  </div>
                );
              
              case 'list':
                if (block.data.style === 'ordered') {
                  return (
                    <ol key={block.id} className="list-decimal pl-6 my-4">
                      {block.data.items.map((item: any, index: number) => (
                        <li key={index} className="mb-2">
                          {item.content}
                        </li>
                      ))}
                    </ol>
                  );
                } else if (block.data.style === 'unordered') {
                  return (
                    <ul key={block.id} className="list-disc pl-6 my-4">
                      {block.data.items.map((item: any, index: number) => (
                        <li key={index} className="mb-2">
                          {item.content}
                        </li>
                      ))}
                    </ul>
                  );
                } else if (block.data.style === 'checklist') {
                  return (
                    <ul key={block.id} className="list-none pl-6 my-4">
                      {block.data.items.map((item: any, index: number) => (
                        <li key={index} className="mb-2 flex items-center">
                          <input 
                            type="checkbox" 
                            checked={item.meta.checked} 
                            readOnly 
                            className="mr-2"
                          />
                          {item.content}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return null;
              
              case 'raw':
                return (
                  <div 
                    key={block.id} 
                    className="my-4"
                    dangerouslySetInnerHTML={{ __html: block.data.html }}
                  />
                );
              
              default:
                return null;
            }
          })}
        </div>
      );
    } catch (error) {
      console.error('Error parsing EditorJS content:', error);
      return (
        <div className="prose max-w-none">
          {content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      );
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article non trouvé</h1>
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
      <div className="container mx-auto px-4 py-8 ">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au portfolio
        </Link>

        <article className="bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="aspect-video overflow-hidden w-full h-80">
            <img 
              src={`${VITE_API_BASE}${post.cover}`}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Yanis TRIGLIA
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {post.created_at ? new Date(post.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Date inconnue'}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {post.read_time} min de lecture
                </div>
              </div>
            </header>

            {renderEditorJSContent(post.content)}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;