import Seat from '../models/Seat.js';

// Controller function to book seats
export const reserveSeats = async (req, res) => {
  const { numOfSeats, userId } = req.body;
  if (numOfSeats > 7) {
    return res.status(400).json({ message: 'Not able to book more than 7 seats' });
  }

  try {
    // Get available seats
    const availableSeats = await Seat.findAll({
      where: { is_reserved: false },
      order: [['row', 'ASC'], ['seat_number', 'ASC']]
    });

    // If not enough seats available
    if (availableSeats.length < numOfSeats) {
      return res.status(500).json({ message: `Booking failed, only ${availableSeats.length} seats available.` });
    }

    const rowCount = 12;

    // Book seats in the same row
    for (let row = 1; row <= rowCount; row++) {
      const rowSeats = availableSeats.filter(seat => seat.row === row);
      if (rowSeats.length >= numOfSeats) {
        const seatsToBook = rowSeats.slice(0, numOfSeats);
        await Promise.all(seatsToBook.map(seat => seat.update({ is_reserved: true, reserved_by: userId })));
        return res.status(200).json({ data: seatsToBook });
      }
    }

    // Book seats across nearby rows if same-row booking fails
    let seatCounts = Array(rowCount).fill(0);
    availableSeats.forEach(seat => seatCounts[seat.row - 1]++);

    let minLength = Infinity, minStart = -1, minEnd = -1;
    let start = 0, end = 0, sum = 0;

    // Find the smallest range of nearby rows that can accommodate the seats
    while (end < seatCounts.length) {
      sum += seatCounts[end];
      while (sum >= numOfSeats) {
        let length = end - start + 1;
        if (length < minLength) {
          minLength = length;
          minStart = start;
          minEnd = end;
        }
        sum -= seatCounts[start++];
      }
      end++;
    }

    // Collect and book seats from the smallest range
    const finalSeats = availableSeats.filter(seat => seat.row > minStart && seat.row <= minEnd + 1).slice(0, numOfSeats);
    await Promise.all(finalSeats.map(seat => seat.update({ is_reserved: true, reserved_by: userId })));

    if (finalSeats.length) {
      return res.status(200).json({ data: finalSeats });
    }

    return res.status(500).json({ message: 'Booking failed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all seats
export const getSeats = async (req, res) => {
  try {
    const availableSeats = await Seat.findAll({ order: [['row', 'ASC'], ['seat_number', 'ASC']] });
    return res.status(200).json({ availableSeats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Reset all seats to available
export const resetBookings = async (req, res) => {
  try {
    await Seat.destroy({ where: {} });

    const totalRows = 12;
    const seatsPerRow = 7;
    const seats = [];
    let seatCount = 0;

    for (let row = 1; row <= totalRows; row++) {
      const rowSeats = row === totalRows ? 80 % seatsPerRow : seatsPerRow;
      for (let seatNum = 1; seatNum <= rowSeats; seatNum++) {
        seatCount++;
        seats.push({
          row,
          seat_number: seatCount,
          is_reserved: false,
          reserved_by: null
        });
      }
    }

    await Seat.bulkCreate(seats);
    return res.json({ message: 'Seats successfully reset' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
