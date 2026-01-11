const Booking = require('../Models/Booking');

/* =========================
   GET ALL BOOKINGS
========================= */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ day: 1, startTime: 1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

/* =========================
   CREATE BOOKING (NO CLASH)
========================= */
exports.createBooking = async (req, res) => {
  try {
    const {
      room,
      day,
      startTime,
      endTime
    } = req.body;

    // 🔥 CLASH CHECK (SERVER-SIDE, MOST IMPORTANT)
    const clash = await Booking.findOne({
      room,
      day,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (clash) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    const booking = new Booking({
      ...req.body,
      userId: req.user._id,
      userName: req.user.name
    });

    await booking.save();

    res.status(201).json({
      success: true,
      booking
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
