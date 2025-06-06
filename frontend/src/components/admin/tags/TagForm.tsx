
import React from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select , SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface TagFormData {
  name: string;
  color: string;
  category: 'technology' | 'skill' | 'tool';
}

interface TagFormProps {
  formData: TagFormData;
  onFormDataChange: (data: TagFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const TagForm: React.FC<TagFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isEditing
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom du tag</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
          placeholder="Ex: React, JavaScript..."
          required
        />
      </div>

      <div>
        <Label htmlFor="color">Couleur</Label>
        <div className="flex items-center gap-2">
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) => onFormDataChange({ ...formData, color: e.target.value })}
            className="w-16 h-10"
          />
          <Input
            value={formData.color}
            onChange={(e) => onFormDataChange({ ...formData, color: e.target.value })}
            placeholder="#3B82F6"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Catégorie</Label>
        <Select
          value={formData.category}
          onValueChange={(value: 'technology' | 'skill' | 'tool') => 
            onFormDataChange({ ...formData, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technology">Technologie</SelectItem>
            <SelectItem value="skill">Compétence</SelectItem>
            <SelectItem value="tool">Outil</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {isEditing ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};
