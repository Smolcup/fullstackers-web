import { useState, useEffect } from 'react';
import { trips as dataTrips } from '../data/trips';
import TripCard from '../components/TripCard';
import axios from 'axios';

function Destinations() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [type, setType] = useState('All');
  const [adminTrips, setAdminTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch admin trips from backend
  useEffect(() => {
    fetchAdminTrips();
  }, []);

  const fetchAdminTrips = async () => {
    try {
      const response = await axios.get('http://localhost:6007/api/trips');
      if (response.data.success) {
        setAdminTrips(response.data.data.trips);
      }
    } catch (error) {
      console.error('Error fetching admin trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const regions = ['All', 'North', 'South', 'Coast'];
  const types = ['All', 'Adventure', 'Culture', 'Relaxation'];

  // Combine data trips with admin trips with proper structure
  const allTrips = [
    // Map data trips to match admin trip structure
    ...dataTrips.map(trip => ({
      ...trip,
      _id: `data-${trip.id}`, // Add prefix to avoid ID conflicts
      images: [trip.image],
      difficulty: trip.type === 'Adventure' ? 'hard' : trip.type === 'Relaxation' ? 'easy' : 'medium',
      destination: trip.region,
      maxGroupSize: 15,
      startDates: [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()], // Next week
      featured: false,
      active: true,
      // Ensure rating exists
      rating: trip.rating || (trip.type === 'Adventure' ? '4.8' : trip.type === 'Culture' ? '4.5' : '4.2')
    })),
    // Add admin trips
    ...adminTrips
  ];

  const filtered = allTrips.filter(trip => {
    const matchText = trip.title.toLowerCase().includes(search.toLowerCase()) ||
                     trip.destination.toLowerCase().includes(search.toLowerCase());
    const matchRegion = region === 'All' || trip.destination.toLowerCase().includes(region.toLowerCase());
    const matchType = type === 'All' || 
                     (type === 'Adventure' && trip.difficulty === 'hard') ||
                     (type === 'Culture' && trip.description?.toLowerCase().includes('culture')) ||
                     (type === 'Relaxation' && trip.difficulty === 'easy');
    return matchText && matchRegion && matchType;
  });

  if (loading) {
    return (
      <div className="main-content">
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading trips...</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1 className="section-title">Destinations & Trips</h1>

      <div className="filters">
        <input
          placeholder="Search trips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid">
        {filtered.map(trip => (
          <TripCard key={trip._id} trip={trip} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p className="muted">No trips found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

export default Destinations;