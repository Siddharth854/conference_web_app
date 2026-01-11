// // Routes/bookingRoutes.js
// const router = require('express').Router();
// const Booking = require('../Models/Booking');
// const ensureAuthenticated = require('../Middlewares/Auth');

// /* =====================================================
//    GET ALL BOOKINGS (calendar view – everyone)
//    GET /api/bookings
// ===================================================== */
// router.get('/', ensureAuthenticated, async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate('userId', 'name') // 🔥 OPTION 2
//       .sort({ day: 1, startTime: 1 });

//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error fetching bookings',
//       error: error.message
//     });
//   }
// });

// /* =====================================================
//    GET MY BOOKINGS (logged-in user only)
//    GET /api/bookings/my-bookings
// ===================================================== */
// router.get('/my-bookings', ensureAuthenticated, async (req, res) => {
//   try {
//     const bookings = await Booking.find({ userId: req.user._id })
//       .populate('userId', 'name') // 🔥 OPTION 2
//       .sort({ createdAt: -1 });

//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error fetching your bookings',
//       error: error.message
//     });
//   }
// });

// /* =====================================================
//    CREATE BOOKING
//    POST /api/bookings
// ===================================================== */
// router.post('/', ensureAuthenticated, async (req, res) => {
//   try {
//     const {
//       professor,
//       department,
//       school,
//       room,
//       day,
//       startTime,
//       endTime
//     } = req.body;

//     if (!professor || !department || !school || !day || !startTime || !endTime) {
//       return res.status(400).json({
//         success: false,
//         message: 'All fields are required'
//       });
//     }

//     // 🔥 Clash check
//     const clash = await Booking.findOne({
//       room: room || 'Room 101',
//       day,
//       startTime: { $lt: endTime },
//       endTime: { $gt: startTime }
//     });

//     if (clash) {
//       return res.status(409).json({
//         success: false,
//         message: 'This room is already booked for the selected time slot'
//       });
//     }

//     const booking = new Booking({
//       professor,
//       department,
//       school,
//       room: room || 'Room 101',
//       day,
//       startTime,
//       endTime,
//       userId: req.user._id,   // 🔥 OWNER
//       userName: req.user.name
//     });

//     await booking.save();

//     res.status(201).json({
//       success: true,
//       message: 'Booking created successfully',
//       booking
//     });

//   } catch (error) {
//     console.error('BOOKING ERROR 👉', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating booking',
//       error: error.message
//     });
//   }
// });

// /* =====================================================
//    UPDATE BOOKING
//    PUT /api/bookings/:id
// ===================================================== */
// router.put('/:id', ensureAuthenticated, async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     // 🔐 Only owner can update
//     if (booking.userId.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Unauthorized to update this booking'
//       });
//     }

//     const clash = await Booking.findOne({
//       _id: { $ne: booking._id },
//       room: booking.room,
//       day: req.body.day,
//       startTime: { $lt: req.body.endTime },
//       endTime: { $gt: req.body.startTime }
//     });

//     if (clash) {
//       return res.status(409).json({
//         success: false,
//         message: 'This room is already booked for the selected time slot'
//       });
//     }

//     Object.assign(booking, req.body);
//     await booking.save();

//     res.json({
//       success: true,
//       message: 'Booking updated successfully',
//       booking
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating booking',
//       error: error.message
//     });
//   }
// });

// /* =====================================================
//    DELETE BOOKING
//    DELETE /api/bookings/:id
// ===================================================== */
// router.delete('/:id', ensureAuthenticated, async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     // 🔐 Only owner can delete
//     if (booking.userId.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Unauthorized to delete this booking'
//       });
//     }

//     await booking.deleteOne();

//     res.json({
//       success: true,
//       message: 'Booking deleted successfully'
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting booking',
//       error: error.message
//     });
//   }
// });

// module.exports = router;

// // Routes/bookingRoutes.js

const router = require('express').Router();
const Booking = require('../Models/Booking');
const ensureAuthenticated = require('../Middlewares/Auth');

/* =====================================================
   GET ALL BOOKINGS (for calendar view – everyone)
   GET /api/bookings
===================================================== */
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      day: 1,
      startTime: 1
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

/* =====================================================
   GET MY BOOKINGS (logged-in user only)
   GET /api/bookings/my-bookings
===================================================== */
router.get('/my-bookings', ensureAuthenticated, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching your bookings',
      error: error.message
    });
  }
});

/* =====================================================
   CREATE BOOKING
   POST /api/bookings
===================================================== */
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const {
      professor,
      department,
      school,
      room,
      day,
      startTime,
      endTime
    } = req.body;

    // 🔒 Basic validation
    if (!professor || !department || !school || !day || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // 🔥 Clash check (same room + overlapping time)
    const clash = await Booking.findOne({
      room: room || 'Room 101',
      day,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (clash) {
      return res.status(409).json({
        success: false,
        message: 'This room is already booked for the selected time slot'
      });
    }

    // ✅ Create booking
    const booking = new Booking({
      professor,
      department,
      school,
      room: room || 'Room 101',
      day,
      startTime,
      endTime,
      userId: req.user._id,
      userName: req.user.name
    });

    await booking.save();

    console.log('✅ BOOKING SAVED:', booking._id);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('BOOKING ERROR 👉', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

/* =====================================================
   UPDATE BOOKING
   PUT /api/bookings/:id
===================================================== */
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // 🔐 Only owner can update
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this booking'
      });
    }

    // 🔥 Clash check (exclude current booking)
    const clash = await Booking.findOne({
      _id: { $ne: booking._id },
      room: booking.room,
      day: req.body.day,
      startTime: { $lt: req.body.endTime },
      endTime: { $gt: req.body.startTime }
    });

    if (clash) {
      return res.status(409).json({
        success: false,
        message: 'This room is already booked for the selected time slot'
      });
    }

    Object.assign(booking, req.body);
    await booking.save();

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
});

/* =====================================================
   DELETE BOOKING
   DELETE /api/bookings/:id
===================================================== */
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // 🔐 Only owner can delete
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this booking'
      });
    }

    await booking.deleteOne();

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
});

module.exports = router;
