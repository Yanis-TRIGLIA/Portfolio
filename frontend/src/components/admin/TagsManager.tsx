import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { Plus } from 'lucide-react';
import { TagForm } from './tags/TagForm';
import { TagsList } from './tags/TagsList';
import type { Tag } from '../../lib/type';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Alert, AlertDescription } from '../../components/ui/alert';

export const TagsManager = () => {
  const { token } = useAuth();
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setEditingTag(null);
    setError(null);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const tagsResponse = await api.get<Tag[]>('/tag', null);
      setTags(tagsResponse);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setError('Erreur lors de la récupération des tags');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (formData: Tag) => {
    if (!token) {
      setError('Token d\'authentification manquant');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingTag) {
        await api.post(`/tag/${editingTag.id}`, formData, token);
        toast({
          title: "Tag modifié",
          description: `Le tag "${formData.name}" a été modifié avec succès.`,
        });
      } else {
        await api.post('/tag', formData, token);
        toast({
          title: "Tag ajouté",
          description: `Le tag "${formData.name}" a été ajouté avec succès.`,
        });
      }

      await fetchData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setError(editingTag ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      toast({
        title: editingTag ? 'Erreur lors de la modification' : 'Erreur lors de la création',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!token) {
      setError('Token d\'authentification manquant');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce tag ?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/tag/${id}`, token);
      await fetchData();
      toast({
        title: "Tag supprimé",
        description: "Le tag a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression');
      toast({
        title: "Erreur lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Card className='border-0'>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gestion des Tags</CardTitle>
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
            disabled={loading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau tag
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && !isDialogOpen && (
          <Alert className="border-red-200 bg-red-50 mb-4">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <TagsList
          tags={tags}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTag ? 'Modifier le tag' : 'Nouveau tag'}
              </DialogTitle>
              <DialogDescription>
                Remplissez les informations du tag ci-dessous
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert className="border-red-200 bg-red-50 mb-4">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <TagForm
              initialData={editingTag || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
              loading={loading}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};