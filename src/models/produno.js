const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
  name: String,
  title: String,
  image: String,
  imagedos: String,
  imagetres: String,
  description: String,
  filtroprice: Number,
  color: String,
  colorstock: String,
  oldprice: Number,
  price: Number,
  amount: Number,
  status: {
    type: Boolean,
    default: false
  },
  timestamp: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Produno', NoteSchema);
