import mongoose from "mongoose"

const ordersSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  bankDetails: {
    type: String,
    required: true,
  },
  items: [
    {
      reference: { type: Number, required: true },
      quantity: { type: Number, required: true },
      chest: { type: Number },
      waist: { type: Number },
      hips: { type: Number },
      price: { type: Number, required: true },
      image: { type: String, required: true },
    }
  ]
})

const Order = mongoose.model("orders", ordersSchema)

export default Order