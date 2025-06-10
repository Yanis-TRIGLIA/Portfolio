
import  { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import type { Blog } from '../lib/type';
import { api } from '../services/api';

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
    }
  
    useEffect(() => {
      if (id) {
        getposttbyid();
      }
    }, [id]);

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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au portfolio
        </Link>

        <article className="bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="aspect-video overflow-hidden">
            <img 
              src={`http://127.0.0.1:8000/${post.cover}`}
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
                   10 min de lecture
                </div>
              </div>
            </header>

            <div className="prose max-w-none">
              {post.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-semibold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('- **')) {
                  return <li key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: paragraph.replace('- **', '<strong>').replace('**', '</strong>') }} />;
                }
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <p key={index} className="font-semibold mb-2">{paragraph.replace(/\*\*/g, '')}</p>;
                }
                if (paragraph.includes('```')) {
                  const codeMatch = paragraph.match(/```(\w+)?\n?([\s\S]*?)```/);
                  if (codeMatch) {
                    return (
                      <pre key={index} className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                        <code className="text-sm">{codeMatch[2]}</code>
                      </pre>
                    );
                  }
                }
                if (paragraph.trim() === '') {
                  return <br key={index} />;
                }
                return <p key={index} className="mb-4 text-gray-600 leading-relaxed">{paragraph}</p>;
              })}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
