import React from 'react';
import { CakeSlice, Heading as Bread, Coffee, Sandwich, ShoppingBag, Star } from 'lucide-react';

interface CategorySidebarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'Todos', icon: ShoppingBag },
  { id: 'panes', name: 'Panes', icon: Bread },
  { id: 'bollería', name: 'Bollería', icon: CakeSlice },
  { id: 'dulces', name: 'Dulces', icon: Coffee },
  { id: 'salados', name: 'Salados', icon: Sandwich },
  { id: 'tartas', name: 'Tartas', icon: Star },
];

const CategorySidebar: React.FC<CategorySidebarProps> = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Categorías</h2>
      <ul className="space-y-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <li key={category.id}>
              <button
                onClick={() => onSelectCategory(category.id)}
                className={`w-full flex items-center p-2 rounded-md transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{category.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategorySidebar;