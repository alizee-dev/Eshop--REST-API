import mongoose from "mongoose"

const cartsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  reference: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  chest: {
    type: Number,
    required: true,
  },
  waist: {
    type: Number,
    required: true,
  },
  hips: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
})

const Cart = mongoose.model("carts", cartsSchema)

export default Cart