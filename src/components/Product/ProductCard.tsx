import React from 'react';
import { Plus} from 'lucide-react';
import { Product } from '../../types/product';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatters';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import Button from '../shared/Button';
import placeholderImg from '../../utils/placeholder';

   interface ProductCardProps {
   product: Product;
 }

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
   const { addItem } = useCartStore();

  const handleAddToCart = () => {
     addItem({
       id: product.id,
       productId: product.id,
       name: product.name,
       price: product.price,
       imageUrl: product.imageUrl,
     });
   };

  return (
     <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
       <div className="relative overflow-hidden">
        <img
          src={resolveImageUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = placeholderImg;
          }}
        />

        {product.stock <= 0 && (
           <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
             <span className="text-white font-semibold">Agotado</span>
           </div>
         )}
       </div>
      
      <div className="p-6">
         <div className="flex items-start justify-between mb-2">
           <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
             {product.name}
           </h3>
           <span className="text-xl font-bold text-amber-600 ml-2">
             {formatPrice(product.price)}
           </span>
         </div>
         
         <p className="text-gray-600 text-sm mb-3 line-clamp-2">
           {product.description}
         </p>
         
         <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 capitalize">
            {product.category} 
          </span> 
          <span className={product.stock > 0 
            ? 'text-green-600 text-sm' 
            : 'text-red-600 text-sm' 
          }> 
            {product.stock > 0 
              ? `En stock: ${product.stock}`
              : 'Agotado'
            } 
          </span>
                    
          <Button
           onClick={handleAddToCart}
           disabled={product.stock <= 0}
            size="sm"
            className="flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Añadir</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
