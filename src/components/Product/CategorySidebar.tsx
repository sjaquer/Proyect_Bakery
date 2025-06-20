import React from 'react';

interface Category {
  value: string;
  label: string;
}

interface CategorySidebarProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onSelectCategory(category.value)}
          className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
            activeCategory === category.value
              ? 'bg-amber-600 text-white'
              : 'text-gray-700 hover:bg-amber-100'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategorySidebar;
