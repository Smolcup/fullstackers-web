import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import TripCard from '../components/TripCard';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(
          `http://localhost:6007/api/trips/search?q=${encodeURIComponent(query)}`
        );
        
        setTrips(response.data.data || []);
      } catch (err) {
        setError('Failed to fetch search results');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

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

  return (
    <Container className="py-5">
      <h1 className="mb-4">
        Search Results for "{query}" ({trips.length} trips found)
      </h1>
      
      {trips.length === 0 ? (
        <Alert variant="info">
          No trips found matching your search. Try different keywords or browse our 
          <Link to="/destinations"> destinations</Link>.
        </Alert>
      ) : (
        <Row>
          {trips.map(trip => (
            <Col key={trip._id} md={6} lg={4} className="mb-4">
              <TripCard trip={trip} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default SearchResults;