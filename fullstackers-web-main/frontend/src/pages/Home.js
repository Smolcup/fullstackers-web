import Hero from '../components/Hero';
import TripCard from '../components/TripCard';
import ProductCard from '../components/ProductCard';
import { trips } from '../data/trips';
import { products } from '../data/products';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [adminTrips, setAdminTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminTrips();
    
    // Add chatbot welcome prompt after a few seconds
    const timer = setTimeout(() => {
      if (!localStorage.getItem('chatbot-welcomed')) {
        window.dispatchEvent(new CustomEvent('chatbot-open', { 
          detail: { message: "Hi! Need help finding the perfect trip? 🗺️" }
        }));
        localStorage.setItem('chatbot-welcomed', 'true');
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const fetchAdminTrips = async () => {
    try {
      const response = await axios.get('http://localhost:6007/api/trips?featured=true&limit=3');
      if (response.data.success) {
        setAdminTrips(response.data.data.trips);
      }
    } catch (error) {
      console.error('Error fetching featured trips:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine data trips with admin trips for featured section
  const featuredTrips = [
    // Take first 2 from data trips
    ...trips.slice(0, 2).map(trip => ({
      ...trip,
      _id: `data-${trip.id}`,
      images: [trip.image],
      difficulty: trip.type === 'Adventure' ? 'hard' : trip.type === 'Relaxation' ? 'easy' : 'medium',
      destination: trip.region,
      maxGroupSize: 15,
      startDates: [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()],
      featured: true,
      active: true,
      rating: trip.rating || (trip.type === 'Adventure' ? '4.8' : trip.type === 'Culture' ? '4.5' : '4.2')
    })),
    // Take first admin trip
    ...adminTrips.slice(0, 1)
  ];

  const featuredProducts = products.slice(0, 3);

  // Quick action handler for chatbot
  const handleQuickChat = (message) => {
    window.dispatchEvent(new CustomEvent('chatbot-open', { 
      detail: { message: message }
    }));
  };

  if (loading) {
    return (
      <div>
        <Hero />
        <div className="main-content">
          <h2 className="section-title">Featured Trips</h2>
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading featured trips...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero />

      {/* Featured Trips Section with Chatbot Integration */}
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title">Featured Trips</h2>
          <button 
            className="btn secondary"
            onClick={() => handleQuickChat("Show me all your trips")}
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            💬 Ask Assistant
          </button>
        </div>
        
        <div className="grid">
          {featuredTrips.map(trip => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>

        {/* Quick Explore Section */}
        <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: 'var(--bg)', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Not sure what you're looking for?</h3>
          <p className="muted" style={{ marginBottom: '1.5rem' }}>
            Let our AI assistant help you find the perfect trip!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn"
              onClick={() => handleQuickChat("What are your most popular trips?")}
            >
              🔥 Popular Trips
            </button>
            <button 
              className="btn"
              onClick={() => handleQuickChat("What's the cheapest trip you have?")}
            >
              💰 Budget Options
            </button>
            <button 
              className="btn"
              onClick={() => handleQuickChat("Show me adventure trips")}
            >
              ⚡ Adventure Trips
            </button>
          </div>
        </div>
      </div>

      {/* Popular Marketplace Items */}
      <div className="main-content">
        <h2 className="section-title">Popular Marketplace Items</h2>
        <div className="grid">
          {featuredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;