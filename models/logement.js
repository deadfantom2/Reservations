var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Logement Schema
var logementSchema = mongoose.Schema({
  userId:      { type: String, required: true },
  type:        { type: String, required: true },
  nbRoom:      { type: Number, required: true },
  prix:        { type: Number, required: true },
  country:     { type: String, required: true },
  city:        { type: String, required: true },
  address:     { type: String, required: true },
  description: { type: String, required: true }
});


var Logement = mongoose.model('Logement', logementSchema);

module.exports = Logement;
