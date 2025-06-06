import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Edit, Trash2, ExternalLink, Github, Hash, Upload, Image as X, ChevronsUpDown } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';

type Tag_table = {
  id: number;
  categories: string;
  name: string;
  master_percentage: number;
};

type Project_table = {
  id: number;
  name: string;
  created_at: string;
  description: string;
  images: string;
  tag: Tag_table[];
  link_project: string;
  github_project: string;
};

const useToast = () => ({
  toast: ({ title, variant }: { title: string; variant?: 'destructive' }) => {
    console.log(`Toast: ${title} (${variant || 'default'})`);
  }
});

const ProjectsManager = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project_table[]>([]);
  const [tags, setTags] = useState<Tag_table[]>([]);
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const [editingProject, setEditingProject] = useState<Project_table | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Récupération des projets et tags
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectsResponse, tagsResponse] = await Promise.all([
        api.get<Project_table[]>('/project', null),
        api.get<Tag_table[]>('/tag', null)
      ]);

      setProjects(projectsResponse);
      setTags(tagsResponse);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setError('Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setSelectedTags([]);
    setFile(null);
    setPreviewUrl('');
    setError(null);
    setEditingProject(null);
  };

  // Gestion du drag & drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    if (!selectedFile.type.match('image.*')) {
      setError('Veuillez sélectionner un fichier image valide');
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Token d\'authentification manquant');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Ici vous devrez implémenter l'upload du fichier vers votre backend
      // Pour l'exemple, nous gardons juste l'URL de l'image existante
      const imageUrl = editingProject?.images || '/placeholder.svg';

      const projectData = {
        name: (e.currentTarget.querySelector('#name') as HTMLInputElement).value,
        description: (e.currentTarget.querySelector('#description') as HTMLTextAreaElement).value,
        images: imageUrl,
        link_project: (e.currentTarget.querySelector('#link_project') as HTMLInputElement).value,
        github_project: (e.currentTarget.querySelector('#github_project') as HTMLInputElement).value,
        tags: selectedTags
      };

      if (editingProject) {
        console.log('Editing project:', editingProject);
        //await api.post(`/project/${editingProject.id}`, projectData, token);
        toast({ title: "Projet modifié avec succès" });
      } else {
        await api.post('/project', projectData, token);
        toast({ title: "Projet ajouté avec succès" });
      }

      await fetchData();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setError(editingProject ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      toast({
        title: editingProject ? 'Erreur lors de la modification' : 'Erreur lors de la création',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project_table) => {
    setEditingProject(project);
    setSelectedTags(project.tag.map(t => t.id));
    setPreviewUrl(project.images);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      setError('Token d\'authentification manquant');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/project/${id}`, token);
      await fetchData();
      toast({ title: "Projet supprimé avec succès" });
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      setError('Erreur lors de la suppression du projet');
      toast({ title: "Erreur lors de la suppression du projet", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>

        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              Nouveau Projet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Modifier le Projet' : 'Nouveau Projet'}
              </DialogTitle>
              <DialogDescription>
                Remplissez les informations du projet ci-dessous
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du projet *</Label>
                  <Input
                    id="name"
                    defaultValue={editingProject?.name || ''}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label>Tags *</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>

                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isDialogOpen}
                        className="w-full justify-between border-2 border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/30 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[40px] h-auto text-white"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
                            {selectedTags.length === 0 ? (
                              <span className="truncate text-sm font-medium text-white/80">
                                Filtrer par technologie
                              </span>
                            ) : selectedTags.length <= 2 ? (
                              selectedTags.map((tag) => (
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
                                  {selectedTags.length} sélectionnées
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 w-5 p-0 hover:bg-red-500/20 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedTags([])
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
                    <PopoverContent className="w-[300px] p-4 bg-white text-black border border-gray-200 shadow-lg rounded-md">
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {tags.map(tag => {
                          const isSelected = selectedTags.includes(tag.id);
                          return (
                            <div
                              key={tag.id}
                              onClick={() =>
                                setSelectedTags(prev =>
                                  isSelected
                                    ? prev.filter(id => id !== tag.id)
                                    : [...prev, tag.id]
                                )
                              }
                              className={`cursor-pointer px-3 py-2 rounded-md flex justify-between items-center hover:bg-gray-100 transition ${isSelected ? 'bg-gray-100 font-medium' : ''
                                }`}
                            >
                              <span>{tag.name}</span>
                              {isSelected && (
                                <span className="text-green-500 text-xs font-semibold">✔</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </PopoverContent>


                  </Popover>



                  {/* <Select 
                    value={selectedTags.join(',')} 
                    onValueChange={(value) => setSelectedTags(value.split(',').map(Number))}
                    
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez des tags">
                        {selectedTags.length > 0 
                          ? selectedTags.map(id => tags.find(t => t.id === id)?.name).join(', ')
                          : "Sélectionnez des tags"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map(tag => (
                        <SelectItem key={tag.id} value={tag.id.toString()}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  defaultValue={editingProject?.description || ''}
                  required
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="link_project">Lien du projet</Label>
                  <Input
                    id="link_project"
                    defaultValue={editingProject?.link_project || ''}
                    placeholder="https://monprojet.com"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="github_project">Lien GitHub</Label>
                  <Input
                    id="github_project"
                    defaultValue={editingProject?.github_project || ''}
                    placeholder="https://github.com/user/repo"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label>Image du projet</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Glissez-déposez une image ici ou cliquez pour sélectionner
                      </p>
                      <p className="text-xs text-gray-500">
                        Formats supportés: JPG, PNG, GIF
                      </p>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'En cours...' : (editingProject ? 'Modifier' : 'Ajouter')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {
        error && !isDialogOpen && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )
      }

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projet</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Liens</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Chargement des projets...
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Aucun projet trouvé. Créez votre premier projet !
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{project.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={project.description}>
                      {project.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.tag.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          <Hash className="w-3 h-3" />
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(project.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {project.link_project && (
                        <a
                          href={project.link_project}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          title="Voir le projet"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.github_project && (
                        <a
                          href={project.github_project}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-800"
                          title="Voir sur GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => handleEdit(project)}
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() => handleDelete(project.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div >
  );
};

export default ProjectsManager;