import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function TripBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    participants: 1,
    selectedDate: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: '',
    paymentMethod: 'card'
  });

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:6007/api/trips/${id}`);
      if (response.data.success) {
        setTrip(response.data.data);
        // Set default date to first available date
        if (response.data.data.startDates && response.data.data.startDates.length > 0) {
          setBookingData(prev => ({
            ...prev,
            selectedDate: response.data.data.startDates[0].split('T')[0]
          }));
        }
      }
    } catch (err) {
      setError('Failed to fetch trip details');
      console.error('Trip booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    if (!trip) return 0;
    return trip.price * bookingData.participants;
  };

const handleBooking = async (e) => {
  e.preventDefault();
  
  if (!bookingData.customerName || !bookingData.customerEmail || !bookingData.customerPhone) {
    setError('Please fill in all required fields');
    return;
  }

  try {
    setLoading(true);
    
    const response = await axios.post(
      `http://localhost:6007/api/trips/${id}/book`,
      bookingData
    );

    if (response.data.success) {
      alert(`Booking confirmed!\n\nTrip: ${trip.title}\nDate: ${bookingData.selectedDate}\nParticipants: ${bookingData.participants}\nTotal: ${calculateTotal()} TND\n\nYou will receive a confirmation email shortly.`);
      navigate('/');
    }
  } catch (err) {
    setError(err.response?.data?.msg || 'Booking failed. Please try again.');
    console.error('Booking error:', err);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="main-content">
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading trip details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="card" style={{ background: '#fee', border: '1px solid #fcc', padding: '1rem', marginBottom: '1rem' }}>
          {error}
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="main-content">
        <div style={{ textAlign: 'center', padding: '50px' }}>Trip not found</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1 className="section-title">Book Your Trip</h1>
      
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Trip Summary */}
        <div className="card">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <h3>{trip.title}</h3>
            <p className="muted">{trip.destination} • {trip.duration} days</p>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <img 
              src={trip.images?.[0] || 'https://via.placeholder.com/400x250?text=Trip+Image'} 
              alt={trip.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
            />
            <p>{trip.description}</p>
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Price per person:</strong> <span className="price">{trip.price} TND</span></p>
              <p><strong>Difficulty:</strong> {trip.difficulty}</p>
              <p><strong>Max group size:</strong> {trip.maxGroupSize} people</p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleBooking} className="form">
          <div className="card">
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h3>Booking Details</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Select Date *
              </label>
              <select
                name="selectedDate"
                value={bookingData.selectedDate}
                onChange={handleChange}
                required
              >
                {trip.startDates?.map((date, index) => (
                  <option key={index} value={date.split('T')[0]}>
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </option>
                ))}
              </select>

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>
                Number of Participants *
              </label>
              <input
                type="number"
                name="participants"
                value={bookingData.participants}
                onChange={handleChange}
                min="1"
                max={trip.maxGroupSize}
                required
              />
              <p className="muted" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Maximum {trip.maxGroupSize} people
              </p>

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={bookingData.customerName}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>
                Email *
              </label>
              <input
                type="email"
                name="customerEmail"
                value={bookingData.customerEmail}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={bookingData.customerPhone}
                onChange={handleChange}
                required
                placeholder="+216 XX XXX XXX"
              />

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>
                Special Requests
              </label>
              <textarea
                name="specialRequests"
                value={bookingData.specialRequests}
                onChange={handleChange}
                placeholder="Any special requirements or requests..."
                rows="3"
              />

              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: '8px' }}>
                <h4>Order Summary</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span>{trip.price} TND × {bookingData.participants} participants</span>
                  <span className="price">{calculateTotal()} TND</span>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.8rem' }} className="muted">
                  <p><strong>Note:</strong> This is a booking request. You will receive a confirmation email with payment instructions.</p>
                </div>
              </div>

              <button type="submit" className="btn" style={{ width: '100%', marginTop: '1.5rem' }}>
                Book Now - {calculateTotal()} TND
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TripBooking;