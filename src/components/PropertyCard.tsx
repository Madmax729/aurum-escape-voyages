import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '@/data/properties';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

interface PropertyCardProps {
  property: Property;
  className?: string;
  featured?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, className, featured = false }) => {
  const { convertPrice } = useApp();
  const { isAuthenticated, user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const checkWishlist = async () => {
        const { data } = await supabase
          .from('wishlists')
          .select('*')
          .eq('user_id', user.id)
          .eq('property_id', property.id)
          .single();
        
        setIsLiked(!!data);
      };

      checkWishlist();
    }
  }, [isAuthenticated, user, property.id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation

    if (!isAuthenticated) {
      toast.error('Please log in to save properties to your wishlist');
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user!.id)
          .eq('property_id', property.id);
        
        toast.success('Removed from wishlist');
      } else {
        await supabase
          .from('wishlists')
          .insert({
            user_id: user!.id,
            property_id: property.id
          });
        
        toast.success('Added to wishlist');
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <Link 
      to={`/properties/${property.id}`}
      className={cn(
        "group block overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg bg-white",
        featured ? "sm:col-span-2 md:col-span-1 lg:col-span-2" : "",
        className
      )}
    >
      <div className={cn(
        "relative overflow-hidden",
        featured ? "aspect-[2/1] md:aspect-[3/2] lg:aspect-[2/1]" : "aspect-square md:aspect-[4/3]"
      )}>
        <img 
          src={property.images[0]} 
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
          <div className="font-medium">{property.location}</div>
        </div>
        <button
          onClick={toggleWishlist}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full",
            "bg-white/90 hover:bg-white transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-gold-dark"
          )}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
            )}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-playfair text-lg font-semibold mb-1">{property.name}</h3>
        <div className="flex items-center mb-2">
          <span className="text-sm text-gray-600">{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-sm text-gray-600">{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-sm text-gray-600">{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="font-medium">
            <span className="text-lg">{convertPrice(property.price)}</span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gold-dark">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            <span className="ml-1 text-sm font-medium">{property.rating}</span>
            <span className="ml-1 text-xs text-gray-500">({property.reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
