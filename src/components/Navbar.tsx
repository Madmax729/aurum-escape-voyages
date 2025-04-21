
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Menu, X, Heart } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, profile, logout } = useAuth();
  const { currency, setCurrency, exchangeRates } = useApp();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-playfair text-2xl font-bold text-gold-dark">Aurum</span>
          <span className="font-playfair text-xl font-medium">Escape</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/properties" className="text-gray-600 hover:text-gold-dark transition-colors">
            Explore
          </Link>
          {isAuthenticated && profile?.role === 'admin' && (
            <Link to="/admin/dashboard" className="text-gray-600 hover:text-gold-dark transition-colors">
              Admin Dashboard
            </Link>
          )}
          {isAuthenticated && (
            <>
              <Link to="/trips" className="text-gray-600 hover:text-gold-dark transition-colors">
                My Trips
              </Link>
              <Link to="/wishlist" className="text-gray-600 hover:text-gold-dark transition-colors flex items-center">
                <Heart size={18} className="mr-1" /> Wishlist
              </Link>
            </>
          )}
        </nav>

        {/* Currency Selector and User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                {currency}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Currency</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.keys(exchangeRates).map((curr) => (
                <DropdownMenuItem key={curr} onClick={() => setCurrency(curr)}>
                  {curr}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || (profile?.role === 'admin' ? "https://randomuser.me/api/portraits/women/44.jpg" : "https://randomuser.me/api/portraits/men/42.jpg")} alt={profile?.name} />
                    <AvatarFallback>{profile?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{profile?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/trips')}>
                  My Trips
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/properties" 
              className="text-gray-600 hover:text-gold-dark transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            {isAuthenticated && profile?.role === 'admin' && (
              <Link 
                to="/admin/dashboard" 
                className="text-gray-600 hover:text-gold-dark transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {isAuthenticated && (
              <>
                <Link 
                  to="/trips" 
                  className="text-gray-600 hover:text-gold-dark transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Trips
                </Link>
                <Link 
                  to="/wishlist" 
                  className="text-gray-600 hover:text-gold-dark transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart size={18} className="mr-1 inline" /> Wishlist
                </Link>
              </>
            )}
            <div className="pt-2 border-t border-gray-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Currency: {currency}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Select Currency</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.keys(exchangeRates).map((curr) => (
                    <DropdownMenuItem key={curr} onClick={() => setCurrency(curr)}>
                      {curr}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  className="justify-start" 
                  onClick={() => {
                    navigate('/profile');
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start" 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Button onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}>
                  Sign In
                </Button>
                <Button variant="outline" onClick={() => {
                  navigate('/register');
                  setMobileMenuOpen(false);
                }}>
                  Sign Up
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
