import mongoose from "mongoose";


const clothesSchema = new mongoose.Schema({
  clothes_name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  pet_type: {
    type: String,
    enum: ['cat', 'dog'],
    required: true
  },
  stock: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0
  },

}, { timestamps: true });

export const Clothes = mongoose.model('Clothes', clothesSchema);