import mongoose from "mongoose"
import dotenv from "dotenv"
import Product from "./Models/Product.mjs"
import Cart from "./Models/Cart.mjs"
import Order from "./Models/Order.mjs"

dotenv.config()

const username_mongo = process.env.username_mongo
const password_mongo = process.env.mongo_password

const products = [
  {
    reference: 1,
    name: "Midnight Velvet Gown",
    description: "Floor-length velvet gown with a deep V-neckline and subtle train. Made to your exact measurements.",
    price: 389.99,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"
  },
  {
    reference: 2,
    name: "Ivory Silk Draped Dress",
    description: "Elegant draped silk dress with one shoulder design. Timeless and refined for black tie events.",
    price: 459.99,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800"
  },
  {
    reference: 3,
    name: "Noir Crepe Column Dress",
    description: "Sleek column dress in matte crepe with a low back and minimalist silhouette.",
    price: 329.99,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
  },
  {
    reference: 4,
    name: "Blush Tulle Ball Gown",
    description: "Romantic full-volume tulle ball gown with delicate embroidery at the bodice.",
    price: 529.99,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800"
  },
  {
    reference: 5,
    name: "Emerald Satin Slip Dress",
    description: "Bias-cut satin slip dress in deep emerald. Simple, sensual and utterly elegant.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800"
  },
  {
    reference: 6,
    name: "Champagne Lace Evening Gown",
    description: "Head-to-toe lace evening gown with long sleeves and a sweeping skirt. Custom fitted.",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?w=800"
  }
]

async function seed() {
  try {
    await mongoose.connect(
      `mongodb+srv://${username_mongo}:${password_mongo}@eshop.yo4pqlj.mongodb.net/eshop?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    console.log("Connected to MongoDB")

    // Clean existing data
    await Product.deleteMany({})
    console.log("Existing products deleted")

    await Cart.deleteMany({})
    console.log("Existing carts deleted")

    await Order.deleteMany({})
    console.log("Existing orders deleted")    

    // Insert new products
    await Product.insertMany(products)
    console.log("6 products inserted successfully")

    await mongoose.disconnect()
    console.log("Done.")
  } catch (error) {
    console.error("Seed error:", error)
  }
}

seed()