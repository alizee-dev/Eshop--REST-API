import mongoose from "mongoose"

const productsSchema = new mongoose.Schema({
  reference: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
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

const Product = mongoose.model("products", productsSchema)

export default Product