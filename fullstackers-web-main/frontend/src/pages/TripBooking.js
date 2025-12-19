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
      const res = await axios.get(`http://localhost:6007/api/trips/${id}`);
      if (res.data.success) {
        setTrip(res.data.data);
        if (res.data.data.startDates?.length)
          setBookingData(prev => ({
            ...prev,
            selectedDate: res.data.data.startDates[0].split('T')[0]
          }));
      }
    } catch (err) {
      setError('Failed to fetch trip details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => setBookingData({ ...bookingData, [e.target.name]: e.target.value });

  const calculateTotal = () => (trip ? trip.price * bookingData.participants : 0);

  const handleBooking = async e => {
    e.preventDefault();
    if (!bookingData.customerName || !bookingData.customerEmail || !bookingData.customerPhone) {
      setError('Please fill all required fields');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) { alert('Please log in first'); navigate('/login'); return; }

    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:6007/api/bookings',
        { ...bookingData, tripId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Booking requested!\nRef: ${res.data.data._id}\nYou will receive a confirmation email shortly.`);
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.msg || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="main-content text-center p-5">Loading trip details...</div>;
  if (error) return <div className="main-content text-center p-5 text-danger">{error}</div>;
  if (!trip) return <div className="main-content text-center p-5">Trip not found</div>;

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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Date *</label>
              <select name="selectedDate" value={bookingData.selectedDate} onChange={handleChange} required>
                {trip.startDates?.map((d, i) => (
                  <option key={i} value={d.split('T')[0]}>
                    {new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </option>
                ))}
              </select>

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>Number of Participants *</label>
              <input type="number" name="participants" value={bookingData.participants} onChange={handleChange} min="1" max={trip.maxGroupSize} required />
              <p className="muted" style={{ fontSize: '0.8rem' }}>Maximum {trip.maxGroupSize} people</p>

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>Full Name *</label>
              <input type="text" name="customerName" value={bookingData.customerName} onChange={handleChange} required placeholder="Your full name" />

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>Email *</label>
              <input type="email" name="customerEmail" value={bookingData.customerEmail} onChange={handleChange} required placeholder="your.email@example.com" />

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>Phone Number *</label>
              <input type="tel" name="customerPhone" value={bookingData.customerPhone} onChange={handleChange} required placeholder="+216 XX XXX XXX" />

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>Special Requests</label>
              <textarea name="specialRequests" value={bookingData.specialRequests} onChange={handleChange} placeholder="Any special requirements or requests..." rows="3" />

              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: '8px' }}>
                <h4>Order Summary</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span>{trip.price} TND × {bookingData.participants} participants</span>
                  <span className="price">{calculateTotal()} TND</span>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.8rem' }} className="muted">
                  <strong>Note:</strong> This is a booking request. You will receive a confirmation email with payment instructions.
                </div>
              </div>

              <button type="submit" className="btn" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
                {loading ? 'Booking...' : `Book Now - ${calculateTotal()} TND`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TripBooking;