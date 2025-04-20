
import React from 'react';
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
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  if (!user) {
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
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.role === 'admin' ? "https://randomuser.me/api/portraits/women/44.jpg" : "https://randomuser.me/api/portraits/men/42.jpg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                  <p className="text-gray-600 mb-2">{user.email}</p>
                  <div className="inline-block bg-gold-light bg-opacity-20 text-gold-dark px-3 py-1 rounded-full text-sm">
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user.name} className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user.email} className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue={user.phone} className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue={user.city} className="mt-1" />
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
                  <Button variant="outline" className="w-full justify-start" onClick={logout}>
                    Log Out
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
                <QRCode value="https://www.airbnb.co.in/" size={200} />
              </div>
              
              <p className="text-sm text-center text-gray-500">
                Scan this code to view your public profile
              </p>
            </div>
            
            {user.role === 'admin' && (
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
