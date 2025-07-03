// TagsList.tsx
import React from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import { Skeleton } from '../../ui/skeleton';
import type { Tag } from '../../../lib/type';

interface TagsListProps {
  tags: Tag[];
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export const TagsList: React.FC<TagsListProps> = ({ 
  tags, 
  onEdit, 
  onDelete,
  loading 
}) => {
  if (loading && tags.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

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
        <div key={tag.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Badge 
              className={`${
                tag.categories === 'Frontend' ? 'bg-blue-100 text-blue-800' :
                tag.categories === 'Backend' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}
            >
              {tag.name}
            </Badge>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(tag)}
                className="h-8 w-8 p-0 cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(String(tag.id))}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Catégorie: <span className="font-medium">{tag.categories}</span>
            </p>
            <p className="text-sm text-gray-600">
              Maîtrise: <span className="font-medium">{tag.master_percentage}%</span>
            </p>
            <p className="text-xs text-gray-400">
              Créé le {new Date(tag.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};