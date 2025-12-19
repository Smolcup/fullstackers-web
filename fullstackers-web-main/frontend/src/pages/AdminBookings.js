import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Badge, Button } from 'react-bootstrap';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchAll = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:6007/api/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBookings(res.data.data);
  };

  const update = async (id, status, paymentStatus) => {
    const token = localStorage.getItem('token');
    await axios.put(
      `http://localhost:6007/api/bookings/${id}/status`,
      { status, paymentStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchAll();
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="main-content">
      <h2 className="section-title">All Bookings</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Trip</th><th>Customer</th><th>Date</th><th>Pax</th><th>Amount</th>
            <th>Status</th><th>Payment</th><th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td>{b.tripTitle}</td>
              <td>{b.customerName}<br/><small>{b.customerEmail}</small></td>
              <td>{new Date(b.selectedDate).toLocaleDateString()}</td>
              <td>{b.participants}</td>
              <td>{b.totalAmount} TND</td>
              <td>
                <Badge bg={b.status==='confirmed'?'success':b.status==='cancelled'?'danger':'warning'}>{b.status}</Badge>
              </td>
              <td>
                <Badge bg={b.paymentStatus==='paid'?'success':'secondary'}>{b.paymentStatus}</Badge>
              </td>
              <td>
                <Button size="sm" variant="outline-success" onClick={() => update(b._id,'confirmed','paid')}>Confirm</Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => update(b._id,'cancelled','refunded')}>Cancel</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
export default AdminBookings;