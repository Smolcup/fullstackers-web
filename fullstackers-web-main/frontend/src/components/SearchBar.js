import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm);
      } else {
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="search-bar">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search trips, destinations, activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <Button variant="primary" type="submit" className="search-button">
          <FaSearch />
        </Button>
      </InputGroup>
    </Form>
  );
}

export default SearchBar;