import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tripData, setTripData] = useState(null);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:6007/api/trips/${id}`);
      if (response.data.success) {
        setTripData(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch trip details');
      console.error('Edit trip error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTripData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setTripData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setTripData(prev => ({
      ...prev,
      [field]: [...prev[field], field === 'itinerary' ? 
        { day: prev.itinerary.length + 1, title: '', description: '', activities: [''] } : 
        '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setTripData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    setTripData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleItineraryActivityChange = (dayIndex, activityIndex, value) => {
    setTripData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => 
        i === dayIndex ? {
          ...item,
          activities: item.activities.map((activity, j) => 
            j === activityIndex ? value : activity
          )
        } : item
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Clean up empty fields before submitting
      const cleanedData = {
        ...tripData,
        startDates: tripData.startDates.filter(date => date.trim() !== ''),
        images: tripData.images.filter(img => img.trim() !== ''),
        included: tripData.included.filter(item => item.trim() !== ''),
        excluded: tripData.excluded.filter(item => item.trim() !== ''),
        itinerary: tripData.itinerary.map(day => ({
          ...day,
          activities: day.activities.filter(activity => activity.trim() !== '')
        }))
      };

      const response = await axios.put(
        `http://localhost:6007/api/trips/${id}`,
        cleanedData,
        { headers }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update trip');
      console.error('Update trip error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="main-content">Loading trip details...</div>;
  if (error) return <div className="main-content"><p className="muted">{error}</p></div>;
  if (!tripData) return <div className="main-content"><p className="muted">Trip not found</p></div>;

  if (success) {
    return (
      <div className="main-content">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>✅ Trip Updated Successfully!</h2>
          <p className="muted">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1 className="section-title">Edit Trip</h1>
      
      {error && (
        <div className="card" style={{ background: '#fee', border: '1px solid #fcc', marginBottom: '1rem' }}>
          <div style={{ padding: '1rem', color: '#c33' }}>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        {/* Basic Information */}
        <div className="card">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <h3>Basic Information</h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Trip Title *
            </label>
            <input
              type="text"
              name="title"
              value={tripData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Sahara Desert Adventure"
            />

            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>
              Description *
            </label>
            <textarea
              name="description"
              value={tripData.description}
              onChange={handleChange}
              required
              placeholder="Describe your trip..."
              rows="4"
            />

            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>
              Destination *
            </label>
            <input
              type="text"
              name="destination"
              value={tripData.destination}
              onChange={handleChange}
              required
              placeholder="e.g., Sahara Desert"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Duration (days) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={tripData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Max Group Size *
                </label>
                <input
                  type="number"
                  name="maxGroupSize"
                  value={tripData.maxGroupSize}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Price (TND) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={tripData.price}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Difficulty *
                </label>
                <select name="difficulty" value={tripData.difficulty} onChange={handleChange}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="featured"
                checked={tripData.featured}
                onChange={handleChange}
              />
              Featured Trip
            </label>
          </div>
        </div>

        {/* Start Dates */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Start Dates</h3>
            <button type="button" className="btn" onClick={() => addArrayItem('startDates')}>
              + Add Date
            </button>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {tripData.startDates?.map((date, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="date"
                  value={date.split('T')[0]} // Format date for input
                  onChange={(e) => handleArrayChange('startDates', index, e.target.value)}
                  style={{ flex: 1 }}
                />
                {tripData.startDates.length > 1 && (
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => removeArrayItem('startDates', index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Images</h3>
            <button type="button" className="btn" onClick={() => addArrayItem('images')}>
              + Add Image
            </button>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {tripData.images?.map((image, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="url"
                  placeholder="Image URL"
                  value={image}
                  onChange={(e) => handleArrayChange('images', index, e.target.value)}
                  style={{ flex: 1 }}
                />
                {tripData.images.length > 1 && (
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => removeArrayItem('images', index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Included Items */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>What's Included</h3>
            <button type="button" className="btn" onClick={() => addArrayItem('included')}>
              + Add Item
            </button>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {tripData.included?.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="e.g., Hotel accommodation"
                  value={item}
                  onChange={(e) => handleArrayChange('included', index, e.target.value)}
                  style={{ flex: 1 }}
                />
                {tripData.included.length > 1 && (
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => removeArrayItem('included', index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Excluded Items */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>What's Not Included</h3>
            <button type="button" className="btn" onClick={() => addArrayItem('excluded')}>
              + Add Item
            </button>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {tripData.excluded?.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="e.g., Personal expenses"
                  value={item}
                  onChange={(e) => handleArrayChange('excluded', index, e.target.value)}
                  style={{ flex: 1 }}
                />
                {tripData.excluded.length > 1 && (
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => removeArrayItem('excluded', index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Itinerary</h3>
            <button type="button" className="btn" onClick={() => addArrayItem('itinerary')}>
              + Add Day
            </button>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {tripData.itinerary?.map((day, index) => (
              <div key={index} style={{ 
                border: '1px solid var(--border)', 
                borderRadius: '8px', 
                padding: '1rem', 
                marginBottom: '1rem',
                background: 'var(--bg)'
              }}>
                <h4>Day {day.day}</h4>
                
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={day.title}
                  onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                  placeholder="Day title"
                  required
                />

                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>
                  Description *
                </label>
                <textarea
                  value={day.description}
                  onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                  placeholder="Describe this day..."
                  rows="3"
                  required
                />

                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>
                  Activities
                </label>
                {day.activities?.map((activity, actIndex) => (
                  <div key={actIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Activity"
                      value={activity}
                      onChange={(e) => handleItineraryActivityChange(index, actIndex, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    {day.activities.length > 1 && (
                      <button
                        type="button"
                        className="btn secondary"
                        onClick={() => {
                          const newActivities = day.activities.filter((_, i) => i !== actIndex);
                          handleItineraryChange(index, 'activities', newActivities);
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    const newActivities = [...day.activities, ''];
                    handleItineraryChange(index, 'activities', newActivities);
                  }}
                  style={{ marginTop: '0.5rem' }}
                >
                  + Add Activity
                </button>

                {tripData.itinerary.length > 1 && (
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => {
                      const newItinerary = tripData.itinerary.filter((_, i) => i !== index);
                      setTripData(prev => ({
                        ...prev,
                        itinerary: newItinerary.map((day, i) => ({ ...day, day: i + 1 }))
                      }));
                    }}
                    style={{ marginTop: '1rem' }}
                  >
                    Remove Day
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Updating Trip...' : 'Update Trip'}
          </button>
          <button 
            type="button" 
            className="btn secondary" 
            onClick={() => navigate('/admin')}
            style={{ marginLeft: '1rem' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTrip;