import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Badge, Spinner } from 'react-bootstrap';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:6007/api/bookings/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner animation="border" className="d-block m-auto mt-5" />;
  if (!bookings.length) return <p className="text-center mt-5">No bookings yet.</p>;

  return (
    <div className="main-content">
      <h2 className="section-title">My Bookings</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr><th>Trip</th><th>Date</th><th>Pax</th><th>Total</th><th>Status</th></tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td>{b.tripTitle}</td>
              <td>{new Date(b.selectedDate).toLocaleDateString()}</td>
              <td>{b.participants}</td>
              <td>{b.totalAmount} TND</td>
              <td>
                <Badge bg={b.status==='confirmed'?'success':b.status==='cancelled'?'danger':'warning'}>{b.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
export default MyBookings;