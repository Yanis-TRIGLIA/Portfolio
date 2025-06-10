import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Plus, Edit, Trash2, ExternalLink, Github, Hash, Upload, Image as X, ChevronsUpDown, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { useRef } from 'react';

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
  const [searchQuery, setSearchQuery] = useState('');

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


  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags;

    return tags.filter(tag =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.categories.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const removeTag = (tagId: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedTags(prev => prev.filter(id => id !== tagId));
  };

  const clearAllTags = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTags([]);
  };


  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };


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

      const formData = new FormData();
      formData.append('name', (e.currentTarget.querySelector('#name') as HTMLInputElement).value);
      formData.append('description', (e.currentTarget.querySelector('#description') as HTMLTextAreaElement).value);
      formData.append('slug', (e.currentTarget.querySelector('#name') as HTMLInputElement).value.toLowerCase().replace(/\s+/g, '-'));

      const linkProject = (e.currentTarget.querySelector('#link_project') as HTMLInputElement).value;
      if (linkProject) formData.append('link_project', linkProject);

      const githubProject = (e.currentTarget.querySelector('#github_project') as HTMLInputElement).value;
      if (githubProject) formData.append('github_project', githubProject);

      selectedTags.forEach(tagId => {
        formData.append('tag[]', tagId.toString());
      });

      if (file) {
        formData.append('image_url', file);
      } else if (editingProject?.images) {
        formData.append('images_url', editingProject.images);
      }

      if (editingProject) {

        await api.putFormData(`/project/${editingProject.id}`, formData, token);
        toast({ title: "Projet modifié avec succès" });
      } else {
        await api.postFormData('/project', formData, token);
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
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Sélectionner les tags *
                  </Label>

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between  bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 min-h-[42px] h-auto text-gray-900 font-normal"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
                            {selectedTags.length === 0 ? (
                              <span className="text-gray-500 text-sm">
                                Sélectionner des technologies...
                              </span>
                            ) : selectedTags.length <= 3 ? (
                              selectedTags.map((tagId) => {
                                const tag = tags.find(t => t.id === tagId);
                                if (!tag) return null;
                                return (
                                  <Badge
                                    key={tag.id}
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-1 gap-1 hover:bg-blue-200"
                                  >
                                    <Hash className="h-2.5 w-2.5" />
                                    {tag.name}
                                    <button
                                      type="button"
                                      className="ml-1 hover:bg-blue-300 rounded-full p-0.5"
                                      onClick={(e) => removeTag(tag.id, e)}
                                    >
                                      <X className="h-2.5 w-2.5" />
                                    </button>
                                  </Badge>
                                );
                              })
                            ) : (
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-1"
                                >
                                  {selectedTags.length} tags sélectionnés
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
                                  onClick={clearAllTags}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white border border-gray-200 shadow-lg">
                      <div className="p-3 border-b border-gray-100">
                        <Input
                          placeholder="Rechercher un tag..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="h-9 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="max-h-60 overflow-y-auto">
                        {filteredTags.length === 0 ? (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            Aucun tag trouvé
                          </div>
                        ) : (
                          <div className="p-2 space-y-1">
                            {filteredTags.map((tag) => {
                              const isSelected = selectedTags.includes(tag.id);
                              return (
                                <div
                                  key={tag.id}
                                  onClick={() => toggleTag(tag.id)}
                                  className={`cursor-pointer px-3 py-2 rounded-md flex items-center justify-between hover:bg-gray-100 transition-colors ${isSelected ? 'bg-blue-50 border border-blue-200' : ''
                                    }`}
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <Hash className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-gray-900 truncate">
                                        {tag.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {tag.categories} • {tag.master_percentage}%
                                      </div>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {selectedTags.length > 0 && (
                        <div className="p-3 border-t border-gray-100 bg-gray-50">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>{selectedTags.length} tag(s) sélectionné(s)</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs text-red-600 hover:bg-red-50"
                              onClick={clearAllTags}
                            >
                              Tout effacer
                            </Button>
                          </div>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
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
                        src={previewUrl.startsWith('blob:') ? previewUrl : `http://127.0.0.1:8000/${previewUrl}`}
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

              <Button type="submit" className="w-full bg-blue-600 text-white" disabled={loading}>
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
function useMemo<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<{ deps: any[]; value: T } | undefined>(undefined);

  if (!ref.current || !areDepsEqual(ref.current.deps, deps)) {
    ref.current = { deps, value: factory() };
  }

  return ref.current.value;
}

function areDepsEqual(a: any[], b: any[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}