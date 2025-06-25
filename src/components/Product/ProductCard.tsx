import React, { useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { Plus} from 'lucide-react';
import { Product } from '../../types/product';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatters';
import Button from '../shared/Button';
import placeholderImg from '../../utils/placeholder';

   interface ProductCardProps {
   product: Product;
 }

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
   const { addItem } = useCartStore();
   const [quantity, setQuantity] = useState(1);
   const imgRef = useRef<HTMLImageElement>(null);

  const handleAddToCart = () => {
      addItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
      }, quantity);

      setQuantity(1);

      const img = imgRef.current;
      const cartIcon =
        document.getElementById('cart-icon') ||
        document.getElementById('cart-icon-mobile') ||
        document.getElementById('cart-icon-menu');

      if (img && cartIcon) {
        const imgRect = img.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        const clone = img.cloneNode(true) as HTMLImageElement;
        clone.style.position = 'fixed';
        clone.style.left = `${imgRect.left}px`;
        clone.style.top = `${imgRect.top}px`;
        clone.style.width = `${imgRect.width}px`;
        clone.style.height = `${imgRect.height}px`;
        clone.style.transition = 'transform 0.7s ease-in-out, opacity 0.7s';
        clone.style.zIndex = '50';
        clone.style.pointerEvents = 'none';
        document.body.appendChild(clone);

        const translateX =
          cartRect.left + cartRect.width / 2 - (imgRect.left + imgRect.width / 2);
        const translateY =
          cartRect.top + cartRect.height / 2 - (imgRect.top + imgRect.height / 2);

        requestAnimationFrame(() => {
          clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.1)`;
          clone.style.opacity = '0';
        });

        clone.addEventListener('transitionend', () => {
          clone.remove();
        });
      }
   };

  return (
     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
       <div className="relative overflow-hidden">
        <img
          ref={imgRef}
          src={product.imageUrl || placeholderImg}
          alt={DOMPurify.sanitize(product.name)}
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
           <h3
             className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2"
             dangerouslySetInnerHTML={{
               __html: DOMPurify.sanitize(product.name),
             }}
           />
           <span className="text-xl font-bold text-amber-600 ml-2">
             {formatPrice(product.price)}
           </span>
         </div>
         
         <p
           className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2"
           dangerouslySetInnerHTML={{
             __html: DOMPurify.sanitize(product.description),
           }}
         />
         
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full sm:w-20 px-2 py-1 border border-gray-300 rounded-md text-center"
            />
            <Button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              size="sm"
              className="flex items-center justify-center space-x-1 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Añadir</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
