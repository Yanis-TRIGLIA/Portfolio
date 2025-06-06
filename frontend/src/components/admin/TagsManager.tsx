
import  { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useToast } from '../../hook/use-toast';
import { Plus } from 'lucide-react';
import { TagForm } from './tags/TagForm';
import { TagsList } from './tags/TagsList';

interface Tag {
  id: string;
  name: string;
  color: string;
  category: 'technology' | 'skill' | 'tool';
  createdAt: string;
}

interface TagFormData {
  name: string;
  color: string;
  category: 'technology' | 'skill' | 'tool';
}

export const TagsManager = () => {
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', name: 'React', color: '#61DAFB', category: 'technology', createdAt: '2024-01-01' },
    { id: '2', name: 'TypeScript', color: '#3178C6', category: 'technology', createdAt: '2024-01-02' },
    { id: '3', name: 'Node.js', color: '#339933', category: 'technology', createdAt: '2024-01-03' },
  ]);

  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<TagFormData>({
    name: '',
    color: '#3B82F6',
    category: 'technology'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#3B82F6',
      category: 'technology'
    });
    setEditingTag(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du tag est requis",
        variant: "destructive",
      });
      return;
    }

    if (editingTag) {
      setTags(tags.map(tag => 
        tag.id === editingTag.id 
          ? { ...tag, ...formData }
          : tag
      ));
      toast({
        title: "Tag modifié",
        description: `Le tag "${formData.name}" a été modifié avec succès.`,
      });
    } else {
      const newTag: Tag = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setTags([...tags, newTag]);
      toast({
        title: "Tag ajouté",
        description: `Le tag "${formData.name}" a été ajouté avec succès.`,
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      color: tag.color,
      category: tag.category
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const tagToDelete = tags.find(tag => tag.id === id);
    setTags(tags.filter(tag => tag.id !== id));
    toast({
      title: "Tag supprimé",
      description: `Le tag "${tagToDelete?.name}" a été supprimé.`,
    });
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gestion des Tags</CardTitle>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau tag
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TagsList 
          tags={tags}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTag ? 'Modifier le tag' : 'Nouveau tag'}
              </DialogTitle>
            </DialogHeader>
            <TagForm
              formData={formData}
              onFormDataChange={setFormData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditing={!!editingTag}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
