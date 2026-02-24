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
    name: "Rose Satin Slip Gown",
    description: "Floor-length satin gown in soft rose with delicate thin straps and a plunging open back. Effortlessly sensual and refined.",
    price: 389.99,
    image: "https://images.unsplash.com/photo-1613424935149-c8efd5c41e91?w=800"
  },
  {
    reference: 2,
    name: "Champagne Tulle Gown",
    description: "Dreamy champagne tulle gown with layered ruffles and a sweeping train. Romantic and ethereal for the grandest occasions.",
    price: 459.99,
    image: "https://plus.unsplash.com/premium_photo-1664367340541-6ce74a264a65?w=800"
  },
  {
    reference: 3,
    name: "Noir Crepe Evening Gown",
    description: "Strapless black gown with a pencil skirt silhouette and dramatic flared three-quarter sleeves. Sophisticated and bold.",
    price: 329.99,
    image: "https://images.unsplash.com/photo-1562077365-9e9ed7bd25fa?w=800"
  },
  {
    reference: 4,
    name: "Aubergine Tulle Ball Gown",
    description: "Strapless ball gown in deep aubergine with a full tulle skirt adorned with delicate floral embroidery. Opulent and romantic.",
    price: 529.99,
    image: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=800"  
},
{
    reference: 5,
    name: "Champagne Pearl Gown",
    description: "Champagne gown with a structured bustier and long sleeves delicately embroidered with pearls. Opulent and truly bespoke.",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1675029865483-31f84044faae?w=800"
  },
  {
    reference: 6,
    name: "White Bohemian Gown",
    description: "Flowing white cotton gown with intricate embroidery and flared three-quarter sleeves. Free-spirited elegance for outdoor evening events.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1664322046189-196a30a7f5e6?w=800"
  },
]

async function seed() {
  try {
    await mongoose.connect(
      `mongodb+srv://${username_mongo}:${password_mongo}@eshop.yo4pqlj.mongodb.net/eshop?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    console.log("Connected to MongoDB")
    await Product.deleteMany({})
    await Cart.deleteMany({})
    await Order.deleteMany({})
    console.log("Collections cleared")
    await Product.insertMany(products)
    console.log("6 products inserted successfully")
    await mongoose.disconnect()
    console.log("Done.")
  } catch (error) {
    console.error("Seed error:", error)
  }
}

seed()