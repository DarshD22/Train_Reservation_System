import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './booking.css';

const SeatBooking = () => {
  const totalSeats = 80;
  const [numSeats, setNumSeats] = useState(1);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(false);
      try {
        const response = await axios.get('/api/bookings/seats');
        setLoading(true);
        setSeats(response.data.availableSeats);
      } catch (error) {
        console.error('Error fetching seats:', error);
        alert('Failed to load seats: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(true);
      }
    };
    fetchSeats();
  }, []);

  const handleBookSeats = async () => {
    if (numSeats > 7) {
      alert('Cannot book more than 7 seats');
      return;
    }
    try {
      const response = await axios.post('/api/bookings/reserve', {
        numOfSeats: numSeats,
        reservedBy: 1, // Replace with actual user ID if applicable
      });
      alert(`Seats Booked Successfully: ${response.data.data.map(seat => seat.seat_number).join(', ')}`);
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          response.data.data.some((bookedSeat) => bookedSeat.seat_number === seat.seat_number)
            ? { ...seat, is_reserved: true }
            : seat
        )
      );
    } catch (error) {
      alert('Booking failed: ' + error.response.data.message);
    }
  };

  const handleResetSeats = async () => {
    try {
      const response = await axios.post('/api/bookings/reset');
      alert(response.data.message);
      setSeats((prevSeats) =>
        prevSeats.map((seat) => ({
          ...seat,
          is_reserved: false,
        }))
      );
    } catch (error) {
      alert('Reset failed: ' + error.response.data.message);
    }
  };

  return (
    <div className="booking-container">
      <h1 className="text-3xl font-bold">Reserve Your Seats</h1>
      <div className="seat-grid">
        {Array.from({ length: totalSeats }, (_, index) => {
          const seat = seats.find((s) => s.seat_number === index + 1);
          const isBooked = seat?.is_reserved;
          return (
            <div
              key={index + 1}
              className={`seat ${isBooked ? 'booked' : 'available'}`}
            >
              {index + 1}
            </div>
          );
        })}
      </div>
      <input
        type="number"
        min="1"
        max="7"
        value={numSeats}
        onChange={(e) => setNumSeats(e.target.value)}
        placeholder="Number of seats"
      />
      <button onClick={handleBookSeats} className="book-button">
        Book
      </button>
      <button onClick={handleResetSeats} className="book-button">
        Reset
      </button>
    </div>
  );
};

export default SeatBooking;
