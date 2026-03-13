import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Plus, Edit, Trash2, Hash, Upload, Image as X, ChevronsUpDown, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import EditorJSComponent from '../form/EditorJSComponent';
import type { OutputData } from '@editorjs/editorjs';
import type { Blog, Tag } from '../../lib/type';
const { VITE_API_BASE } = import.meta.env;

const BlogManager = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState<Blog[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<Blog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const [editorData, setEditorData] = useState<OutputData | undefined>(undefined);


  useEffect(() => {
    if (editingPost?.content) {
      try {
        const parsed = typeof editingPost.content === 'string'
          ? JSON.parse(editingPost.content)
          : editingPost.content;

        setEditorData(parsed);
      } catch (err) {
        console.error('Erreur parsing contenu:', err);
        setEditorData(undefined); 
      }
    } else {
      setEditorData(undefined);
    }
  }, [editingPost]);


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [postsResponse, tagsResponse] = await Promise.all([
        api.get<Blog[]>('/blog', null),
        api.get<Tag[]>('/tag', null)
      ]);

      setPosts(postsResponse);
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
  }, [searchQuery, tags]);

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
    setEditingPost(null);
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
      setError(token ? 'Veuillez remplir le contenu' : 'Token d\'authentification manquant');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('title', (e.currentTarget.querySelector('#title') as HTMLInputElement).value);
      formData.append('content', JSON.stringify(editorData));
      formData.append('read_time', (e.currentTarget.querySelector('#read_time') as HTMLInputElement).value || '1');
      formData.append('slug', (e.currentTarget.querySelector('#title') as HTMLInputElement).value.toLowerCase().replace(/\s+/g, '-'));
      formData.append('meta_title', (e.currentTarget.querySelector('#meta_title') as HTMLInputElement).value);
      formData.append('meta_description', (e.currentTarget.querySelector('#meta_description') as HTMLTextAreaElement).value);
      formData.append('short_description', (e.currentTarget.querySelector('#short_description') as HTMLInputElement).value);

      selectedTags.forEach(tagId => {
        formData.append('tag[]', tagId.toString());
      });

      if (file) {
        formData.append('cover', file);
      } else if (editingPost?.cover) {
        formData.append('cover_url', editingPost.cover);
      }



      if (editingPost) {
        await api.putFormData(`/blog/${editingPost.id}`, formData, token);
        toast({ title: "Article modifié avec succès" });
      } else {
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        await api.postFormData('/blog', formData, token);
        toast({ title: "Article ajouté avec succès" });
      }

      await fetchData();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setError(editingPost ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      toast({
        title: editingPost ? 'Erreur lors de la modification' : 'Erreur lors de la création',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: Blog) => {
    setEditingPost(post);
    setSelectedTags(post.tag.map(t => t.id));
    setPreviewUrl(post.cover);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      setError('Token d\'authentification manquant');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/blog/${id}`, token);
      await fetchData();
      toast({ title: "Article supprimé avec succès" });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      setError('Erreur lors de la suppression de l\'article');
      toast({ title: "Erreur lors de la suppression de l\'article", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };


  const handleImageUpload = async (file: File) => {
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.postFormData('/blog/upload-image', formData, token);
      return (response as { file: { url: string } }).file.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div></div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              Nouvel Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl overflow-auto  scrollable-dialog">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Modifier l\'Article' : 'Nouvel Article'}
              </DialogTitle>
              <DialogDescription>
                Remplissez les informations de l'article ci-dessous
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



              <div className='flex space-x-5'>
                <div className='w-1/2'>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    defaultValue={editingPost?.title || ''}
                    required
                    disabled={loading}
                  />
                </div>
                <div className='w-1/2'>
                  <Label htmlFor="read_time">Temps de Lecture *</Label>
                  <Input
                    id="read_time"
                    type='number'
                    defaultValue={editingPost?.read_time || ''}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <div className='mb-4'>
                  <Label htmlFor="short_description">Courte description</Label>
                  <Input
                    id="short_description"
                    defaultValue={editingPost?.short_description || ''}
                    disabled={loading}
                  />
                </div>

              <div>
                <Label htmlFor="content">Contenu *</Label>

                <EditorJSComponent
                  value={editorData}
                  onChange={(data) => setEditorData(data)}
                  onImageUpload={handleImageUpload}
                />


              </div>

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    defaultValue={editingPost?.meta_title || ''}
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
                        className="w-full justify-between bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 min-h-[42px] h-auto text-gray-900 font-normal"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
                            {selectedTags.length === 0 ? (
                              <span className="text-gray-500 text-sm">
                                Sélectionner des tags...
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
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  defaultValue={editingPost?.meta_description || ''}
                  disabled={loading}
                  rows={2}
                />
              </div>

              <div>
                <Label>Image de couverture</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl.startsWith('blob:') ? previewUrl : `${VITE_API_BASE}${previewUrl}`}
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
                {loading ? 'En cours...' : (editingPost ? 'Modifier' : 'Ajouter')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && !isDialogOpen && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Contenu</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Chargement des articles...
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Aucun article trouvé. Créez votre premier article !
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{post.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={post.content}>
                      {post.content.substring(0, 100)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {post.tag.map((tag, index) => (
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
                  <TableCell>{formatDate(post.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => handleEdit(post)}
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() => handleDelete(post.id)}
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
    </div>
  );
};

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

export default BlogManager;