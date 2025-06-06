
import React from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Pencil, Trash2 } from 'lucide-react';

interface Tag {
  id: string;
  name: string;
  color: string;
  category: 'technology' | 'skill' | 'tool';
  createdAt: string;
}

interface TagsListProps {
  tags: Tag[];
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
}

export const TagsList: React.FC<TagsListProps> = ({ tags, onEdit, onDelete }) => {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'technology': return 'Technologie';
      case 'skill': return 'Compétence';
      case 'tool': return 'Outil';
      default: return category;
    }
  };

  if (tags.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun tag trouvé. Créez votre premier tag !
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tags.map((tag) => (
        <div key={tag.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Badge style={{ backgroundColor: tag.color, color: 'white' }}>
              {tag.name}
            </Badge>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(tag)}
                className="h-8 w-8 p-0"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(tag.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            Catégorie: {getCategoryLabel(tag.category)}
          </p>
          <p className="text-xs text-gray-400">
            Créé le {new Date(tag.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
      ))}
    </div>
  );
};
