import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  onRemove: () => void;
}

export default function SortableItem({ id, children, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 }}
      className={isDragging ? 'opacity-50' : ''}
    >
      <div className="relative p-3 sm:p-4 bg-input-bg/30 rounded-md border border-border-card/50 flex gap-2 sm:gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-accent transition-colors flex items-center"
        >
          <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="flex-1">{children}</div>
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
