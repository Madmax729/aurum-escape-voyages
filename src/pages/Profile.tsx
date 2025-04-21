
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import QRCode from '@/components/QRCode';
import { toast } from 'sonner';

const Profile = () => {
  const { isAuthenticated, profile, updateProfile, uploadAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        city: profile.city || ''
      });
    }
  }, [isAuthenticated, navigate, profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      await uploadAvatar(file);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
          <Button onClick={() => navigate('/login')}>Log In</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                    <AvatarImage src={profile.avatar_url || (profile.role === 'admin' ? "https://randomuser.me/api/portraits/women/44.jpg" : "https://randomuser.me/api/portraits/men/42.jpg")} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity rounded-full cursor-pointer" onClick={handleAvatarClick}>
                    <span className="text-white text-xs">Change</span>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
                  <p className="text-gray-600 mb-2">{profile.email}</p>
                  <div className="inline-block bg-gold-light bg-opacity-20 text-gold-dark px-3 py-1 rounded-full text-sm">
                    {profile.role === 'admin' ? 'Admin' : 'User'}
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={handleInputChange}
                      className="mt-1" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange}
                      className="mt-1" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange}
                      className="mt-1" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      value={formData.city} 
                      onChange={handleInputChange}
                      className="mt-1" 
                    />
                  </div>
                </div>
                
                <div>
                  <Button type="submit">Update Profile</Button>
                </div>
              </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Account Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                </div>
                
                <div>
                  <Button variant="outline" className="w-full justify-start">
                    Notification Preferences
                  </Button>
                </div>
                
                <div>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/trips')}>
                    My Trips
                  </Button>
                </div>
                
                <div>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/wishlist')}>
                    My Wishlist
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Profile QR Code</h3>
              <p className="text-gray-600 mb-6">
                Share your profile with others or quickly log in on other devices.
              </p>
              
              <div className="flex justify-center mb-4">
                <QRCode 
                  value={`https://aurum-escape.com/profile/${profile.id}`} 
                  size={200} 
                />
              </div>
              
              <p className="text-sm text-center text-gray-500">
                Scan this code to view your public profile
              </p>
            </div>
            
            {profile.role === 'admin' && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-xl font-bold mb-4">Admin Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full" onClick={() => navigate('/admin/dashboard')}>
                    Go to Admin Dashboard
                  </Button>
                  <Button variant="outline" className="w-full">
                    Manage Properties
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
