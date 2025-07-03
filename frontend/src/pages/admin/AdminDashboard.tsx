import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Card, CardContent,  CardHeader, CardTitle } from '../../components/ui/card';
import { LogOut, FolderOpen, FileText, Tag } from 'lucide-react';
import ProjectsManager from '../../components/admin/ProjectsManager';
import BlogManager from '../../components/admin/BlogManager';
import { TagsManager } from '../../components/admin/TagsManager';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <a href='/'><h1 className="text-2xl font-bold text-gray-900">👑 Dashboard de Yanis 👑 </h1></a>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md cursor-pointer"
          >
            <LogOut className="w-4 h-4 " />
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-8 bg-gray-300/50 rounded-lg ">
            <TabsTrigger value="projects" className="flex items-center gap-2 cursor-pointer">
              <FolderOpen className="w-4 h-4 " />
              Projets
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2 cursor-pointer">
              <FileText className="w-4 h-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="tags" className="flex items-center gap-2 cursor-pointer">
              <Tag className="w-4 h-4" />
              Tags
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card className='bg-white shadow-md'>
              <CardHeader>
                <CardTitle>Gestion des Projets</CardTitle>

              </CardHeader>
              <CardContent>
                <ProjectsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du Blog</CardTitle>

              </CardHeader>
              <CardContent>
                <BlogManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tags">
            <Card>

              <TagsManager />

            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
