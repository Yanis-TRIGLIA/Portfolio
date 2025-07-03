// TagForm.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import type { Tag } from '../../../lib/type';

interface TagFormProps {
  initialData?: Tag;
  onSubmit: (data: Tag) => void;
  onCancel: () => void;
  loading: boolean;
}

export const TagForm: React.FC<TagFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading
}) => {
  const [formData, setFormData] = useState<Omit<Tag, 'id' | 'created_at'>>({
    name: '',
    categories: 'Frontend',
    master_percentage: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        categories: initialData.categories,
        master_percentage: initialData.master_percentage,
      });
    } else {
      setFormData({
        name: '',
        categories: 'Frontend',
        master_percentage: 0,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: initialData?.id ?? 0,
      created_at: initialData?.created_at || '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom du tag *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: React, JavaScript..."
          required
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="category">Catégorie *</Label>
        <Select
         value={initialData ? initialData.categories : formData.categories}
          onValueChange={(value: 'Backend' | 'Frontend' | 'Autres') =>
            setFormData({ ...formData, categories: value })
          }
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-white">
            <SelectItem value="Backend">Backend</SelectItem>
            <SelectItem value="Frontend">Frontend</SelectItem>
            <SelectItem value="Autres">Autres</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="percentage">Niveau de maîtrise (%) *</Label>
        <Input
          id="percentage"
          type="number"
          min="0"
          max="100"
          value={formData.master_percentage}
          onChange={(e) => setFormData({ ...formData, master_percentage: Number(e.target.value) })}
          required
          disabled={loading}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4 b">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className='bg-red-500 text-white hover:bg-gray-300'
          disabled={loading}
        >
          Annuler
        </Button>
        <Button type="submit" className='bg-blue-500 text-white cursor-pointer' disabled={loading}>
          {loading ? 'En cours...' : (initialData ? 'Modifier' : 'Ajouter')}
        </Button>
      </div>
    </form>
  );
};