import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from './UserRole';

function TripCard({ trip }) {
  const navigate = useNavigate();
  const role = UserRole();

  const handleCardClick = (e) => {
    // Don't navigate if clicking on a button
    if (e.target.tagName === 'BUTTON') return;
    
    // Navigate to booking page
    navigate(`/book-trip/${trip._id}`);
  };

  const handleBookNow = (e) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/book-trip/${trip._id}`);
  };

  // Determine rating based on difficulty or generate a default
  const getRating = () => {
    if (trip.rating) return trip.rating;
    if (trip.difficulty === 'hard') return '4.8';
    if (trip.difficulty === 'medium') return '4.5';
    return '4.2';
  };

  // Determine type based on difficulty or use existing type
  const getType = () => {
    if (trip.type) return trip.type;
    if (trip.difficulty === 'hard') return 'Adventure';
    if (trip.difficulty === 'medium') return 'Culture';
    return 'Relaxation';
  };

  // Determine region based on destination or use existing region
  const getRegion = () => {
    if (trip.region) return trip.region;
    if (trip.destination?.toLowerCase().includes('sahara')) return 'South';
    if (trip.destination?.toLowerCase().includes('island')) return 'Coast';
    return 'North';
  };

  return (
    <div 
      className="card" 
      onClick={handleCardClick} 
      style={{ 
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <img 
        src={trip.images?.[0] || trip.image} 
        alt={trip.title} 
      />
      <div className="card-body">
        <h3 className="card-title">{trip.title}</h3>
        <span className="muted">
          {trip.duration} days • {getRegion()}
        </span>
        <span className="muted">
          {getType()} • ⭐ {getRating()}
        </span>
        <span className="price">{trip.price} TND</span>
        
        {/* Book Now button - always visible for better UX */}
        {role !== 'admin' && (
          <button 
            className="btn" 
            onClick={handleBookNow}
            style={{ 
              width: '100%', 
              marginTop: '1rem'
            }}
          >
            Book Now
          </button>
        )}
      </div>
    </div>
  );
}

export default TripCard;