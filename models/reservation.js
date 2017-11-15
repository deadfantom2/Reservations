var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Reservation Schema
var reservationSchema = mongoose.Schema({
  userId:       { type: String, required: true },
  logementId:   { type: String, required: true },
  checkInDate:  { type: Date, required: true },
  checkOutDate: { type: Date, required: true }
});


var Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
