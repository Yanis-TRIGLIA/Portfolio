
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Home,  FileText, Shield} from 'lucide-react';

const Sitemap = () => {
  const sections = [
    {
      title: "Pages principales",
      icon: <Home className="h-5 w-5" />,
      links: [
        { name: "Accueil", url: "/", description: "Page d'accueil du portfolio" }
      ]
    },
    {
      title: "Pages de détail",
      icon: <FileText className="h-5 w-5" />,
      links: [
        { name: "Détail projet", url: "/project/:id", description: "Page détaillée d'un projet spécifique" },
        { name: "Article de blog", url: "/blog/:id", description: "Page complète d'un article de blog" }
      ]
    },

    {
      title: "Pages légales",
      icon: <Shield className="h-5 w-5" />,
      links: [
        { name: "Plan du site", url: "/sitemap", description: "Architecture et navigation du site" },
        { name: "Mentions légales", url: "/mentions-legales", description: "Informations légales obligatoires" },
        { name: "Politique de confidentialité", url: "/politique-confidentialite", description: "Gestion des données personnelles" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Plan du site</h1>
              <p className="text-gray-600 mt-2">Architecture et navigation du portfolio</p>
            </div>
            <Button className='cursor-pointer' onClick={() => window.location.href = '/'} variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8">
          {sections.map((section, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  {section.icon}
                  <span className="ml-3">{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {section.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h3 className="font-semibold text-blue-600 mb-2">
                        <a href={link.url} className="hover:underline">
                          {link.name}
                        </a>
                      </h3>
                      <p className="text-gray-600 text-sm">{link.description}</p>
                      <span className="text-xs text-gray-400 mt-1 block">{link.url}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer info */}
     
      </main>
    </div>
  );
};

export default Sitemap;
