// Models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  professor: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  school: {
    type: String,
    required: true,
    trim: true
  },
  room: {
    type: String,
    default: 'Room 101'
  },
  day: {
    type: String,
    required: true,
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ]
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

/* ===============================
   VALIDATE TIME ORDER (FIXED)
================================ */
BookingSchema.pre('save', function () {
  const timeSlots = [
    '08:00', '09:00', '09:50', '10:40',
    '11:30', '12:20', '13:10',
    '14:00', '15:00', '16:00', '17:00'
  ];

  const startIdx = timeSlots.indexOf(this.startTime);
  const endIdx = timeSlots.indexOf(this.endTime);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error('Invalid time slot selected');
  }

  if (endIdx <= startIdx) {
    throw new Error('End time must be after start time');
  }
});

/* ===============================
   INDEX FOR CLASH CHECK
================================ */
BookingSchema.index({ room: 1, day: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
