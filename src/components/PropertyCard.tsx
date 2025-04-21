
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Property } from '@/data/properties';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { convertPrice } = useApp();
  const { isAuthenticated, profile } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if property is in user's wishlist
  useEffect(() => {
    if (!isAuthenticated || !profile) return;

    const checkWishlist = async () => {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', profile.id)
        .eq('property_id', property.id)
        .single();

      if (!error && data) {
        setIsWishlisted(true);
      }
    };

    checkWishlist();
  }, [isAuthenticated, profile, property.id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please log in to save to wishlist');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isWishlisted) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', profile?.id)
          .eq('property_id', property.id);

        if (error) throw error;
        
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: profile?.id,
            property_id: property.id
          });

        if (error) throw error;
        
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link to={`/properties/${property.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg">
        {/* Wishlist heart icon */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full ${isWishlisted ? 'bg-white text-red-500' : 'bg-black/30 text-white hover:bg-white hover:text-gray-800'} transition-colors`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Property image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <img
            src={property.images[0]}
            alt={property.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
          />

          {/* Price tag */}
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded">
            <span className="font-semibold">{convertPrice(property.price)}</span>
            <span className="text-sm"> / night</span>
          </div>
        </div>

        {/* Property details */}
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg text-gray-900 truncate">{property.name}</h3>
            
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gold-dark">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              <span className="ml-1">{property.rating}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mt-1 truncate">{property.location.city}, {property.country}</p>
          
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <span>{property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}</span>
            <span className="mx-1">·</span>
            <span>{property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
