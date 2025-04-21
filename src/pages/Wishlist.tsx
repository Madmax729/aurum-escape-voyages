
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PropertyGrid from '@/components/PropertyGrid';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Property, getPropertyById } from '@/data/properties';
import { toast } from 'sonner';

const Wishlist = () => {
  const { isAuthenticated, profile } = useAuth();
  const [wishlistProperties, setWishlistProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchWishlist = async () => {
      if (!profile) return;

      try {
        const { data: wishlistItems, error } = await supabase
          .from('wishlists')
          .select('*')
          .eq('user_id', profile.id);

        if (error) {
          console.error('Error fetching wishlist:', error);
          toast.error('Failed to load wishlist');
          setLoading(false);
          return;
        }

        const properties = wishlistItems
          .map(item => getPropertyById(item.property_id))
          .filter((property): property is Property => property !== undefined);

        setWishlistProperties(properties);
      } catch (err) {
        console.error('Error in wishlist fetch:', err);
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated, profile, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading wishlist...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-6">My Wishlist</h1>
        <PropertyGrid
          properties={wishlistProperties}
          title={wishlistProperties.length > 0 ? undefined : 'Your wishlist is empty'}
          subtitle={wishlistProperties.length === 0 ? 'Start exploring properties to add them to your wishlist!' : undefined}
        />
      </div>
    </Layout>
  );
};

export default Wishlist;
