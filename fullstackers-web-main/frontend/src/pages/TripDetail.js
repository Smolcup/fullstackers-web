import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { UserRole } from '../components/UserRole';

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const role = UserRole();

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:6007/api/trips/${id}`);
      if (response.data.success) {
        setTrip(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch trip details');
      console.error('Trip detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:6007/api/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      navigate('/destinations');
    } catch (err) {
      alert('Failed to delete trip');
      console.error('Delete trip error:', err);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!trip) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Trip not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </Button>
        </Col>
        {role === 'admin' && (
          <Col className="text-end">
            <Button 
              variant="outline-primary" 
              className="me-2"
              onClick={() => navigate(`/admin/edit-trip/${trip._id}`)}
            >
              <FaEdit /> Edit Trip
            </Button>
            <Button variant="outline-danger" onClick={handleDelete}>
              <FaTrash /> Delete Trip
            </Button>
          </Col>
        )}
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Img 
              variant="top" 
              src={trip.images?.[0] || 'https://via.placeholder.com/800x400?text=Trip+Image'} 
              alt={trip.title}
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title as="h1">{trip.title}</Card.Title>
              <Card.Text className="text-muted">
                {trip.destination} • {trip.duration} days • {trip.difficulty}
              </Card.Text>
              <Card.Text>{trip.description}</Card.Text>
            </Card.Body>
          </Card>

          {/* Itinerary */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Itinerary</h5>
            </Card.Header>
            <Card.Body>
              {trip.itinerary?.map((day, index) => (
                <div key={index} className="mb-3">
                  <h6>Day {day.day}: {day.title}</h6>
                  <p>{day.description}</p>
                  {day.activities && (
                    <div>
                      <strong>Activities:</strong>
                      <ul>
                        {day.activities.map((activity, actIndex) => (
                          <li key={actIndex}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Trip Details</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Price:</strong> {trip.price} TND</p>
              <p><strong>Duration:</strong> {trip.duration} days</p>
              <p><strong>Max Group Size:</strong> {trip.maxGroupSize} people</p>
              <p><strong>Difficulty:</strong> 
                <Badge bg={trip.difficulty === 'easy' ? 'success' : trip.difficulty === 'medium' ? 'warning' : 'danger'} 
                       className="ms-2">
                  {trip.difficulty}
                </Badge>
              </p>
              <p><strong>Featured:</strong> 
                <Badge bg={trip.featured ? 'success' : 'secondary'} className="ms-2">
                  {trip.featured ? 'Yes' : 'No'}
                </Badge>
              </p>
            </Card.Body>
          </Card>

          {/* Start Dates */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Available Start Dates</h5>
            </Card.Header>
            <Card.Body>
              {trip.startDates?.map((date, index) => (
                <Badge bg="primary" className="me-2 mb-2" key={index}>
                  {new Date(date).toLocaleDateString()}
                </Badge>
              ))}
            </Card.Body>
          </Card>

          {/* What's Included */}
          <Card className="mb-4">
            <Card.Header>
              <h5>What's Included</h5>
            </Card.Header>
            <Card.Body>
              <ul>
                {trip.included?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>

          {/* What's Not Included */}
          <Card className="mb-4">
            <Card.Header>
              <h5>What's Not Included</h5>
            </Card.Header>
            <Card.Body>
              <ul>
                {trip.excluded?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TripDetail;