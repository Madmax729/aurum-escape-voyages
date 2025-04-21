
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://lzptjegxxoqcbsqpnljf.supabase.co';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cHRqZWd4eG9xY2JzcXBubGpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNDAwMzQsImV4cCI6MjA2MDcxNjAzNH0.isx80ZpXnRYlQBbs1sLtR2QcYWcpraHWuYt-EfYNkEA';

// Mock properties database for demo purposes
// In a real app, these would come from a database
const properties = [
  {
    id: "1",
    name: "Luxury Villa with Ocean View",
    location: "Malibu",
    country: "USA",
    price: 1200,
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    maxGuests: 10,
    rating: 4.9,
    reviewCount: 127,
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613977257592-4a9a32f9141b?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613977257592-fc0bd96e0e6d?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613977257365-aaad27e5f5b5?q=80&w=2070&auto=format&fit=crop"
    ],
    description: "Enjoy panoramic ocean views from this stunning villa. Featuring 5 bedrooms, a private pool, and direct beach access, this property is perfect for luxury getaways.",
    amenities: ["Private pool", "Beach access", "Home theater", "Fully equipped kitchen", "Hot tub", "BBQ area", "Gym", "Air conditioning", "Free parking"],
    host: {
      name: "Emily",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  },
  {
    id: "2",
    name: "Mountain Retreat Cabin",
    location: "Aspen",
    country: "USA",
    price: 450,
    type: "cabin",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    rating: 4.8,
    reviewCount: 93,
    images: [
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1452441271666-5d998aa2f6cc?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=2028&auto=format&fit=crop"
    ],
    description: "Cozy mountain retreat with stunning views of the Rockies. Enjoy a warm fireplace, outdoor hot tub, and easy access to ski slopes.",
    amenities: ["Fireplace", "Hot tub", "Ski-in/Ski-out", "Wi-Fi", "Fully equipped kitchen", "BBQ", "Heating", "TV", "Free parking"],
    host: {
      name: "Michael",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.split('/');
  const endpoint = path[path.length - 1];
  
  // Create supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // GET all properties
    if (req.method === 'GET' && endpoint === 'properties') {
      // In a real app, we would fetch from a database
      return new Response(JSON.stringify({ data: properties }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    // GET a specific property
    if (req.method === 'GET' && path.length > 2) {
      const propertyId = path[path.length - 1];
      const property = properties.find(p => p.id === propertyId);
      
      if (!property) {
        return new Response(JSON.stringify({ error: "Property not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }
      
      return new Response(JSON.stringify({ data: property }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    // POST create a new property
    if (req.method === 'POST' && endpoint === 'properties') {
      // Get the JWT from the request header
      const authHeader = req.headers.get('Authorization');
      
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }
      
      // In a real app, we would validate the token and create a new property
      const body = await req.json();
      
      // Validate required fields
      if (!body.name || !body.location || !body.price) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      
      // In a real app, we would save to a database and return the new property
      return new Response(JSON.stringify({ message: "Property created successfully", data: { id: "new-id", ...body } }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
      });
    }
    
    // PUT update an existing property
    if (req.method === 'PUT' && path.length > 2) {
      const propertyId = path[path.length - 1];
      
      // Get the JWT from the request header
      const authHeader = req.headers.get('Authorization');
      
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }
      
      // In a real app, we would update a property in the database
      const property = properties.find(p => p.id === propertyId);
      
      if (!property) {
        return new Response(JSON.stringify({ error: "Property not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }
      
      const body = await req.json();
      
      return new Response(JSON.stringify({ message: "Property updated successfully", data: { ...property, ...body } }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    // DELETE a property
    if (req.method === 'DELETE' && path.length > 2) {
      const propertyId = path[path.length - 1];
      
      // Get the JWT from the request header
      const authHeader = req.headers.get('Authorization');
      
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }
      
      // In a real app, we would delete from a database
      const property = properties.find(p => p.id === propertyId);
      
      if (!property) {
        return new Response(JSON.stringify({ error: "Property not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }
      
      return new Response(JSON.stringify({ message: "Property deleted successfully" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    // If no route matches
    return new Response(JSON.stringify({ error: "Not Found" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 404,
    });
    
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
