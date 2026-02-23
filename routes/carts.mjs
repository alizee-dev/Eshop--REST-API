import express from "express"
import Cart from "../Models/Cart.mjs"
import Order from "../Models/Order.mjs"
import Product from "../Models/Product.mjs"
import session from "express-session"
import cookieParser from "cookie-parser"
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// session and cookie-parser middleware
router.use(cookieParser())
router.use(session({
    secret: 'webshop1234',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

router.post('/checkout', async (req, res) => {
    try {
        const userId = req.session.userId
        if (!userId) {
            return res.status(400).json({ message: 'No active session' })
        }

        const cartItems = await Cart.find({ userId })
        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' })
        }

        const { status, firstname, lastname, email, address, bankDetails } = req.body

        const orderItems = cartItems.map(cartItem => ({
            reference: cartItem.reference,
            quantity: cartItem.quantity,
            chest: cartItem.chest,
            waist: cartItem.waist,
            hips: cartItem.hips,
            price: cartItem.price,
            image: cartItem.image
        }))

        const order = new Order({
            status,
            firstname,
            lastname,
            email,
            address,
            bankDetails,
            items: orderItems
        })

        await order.save()

        // Clear the user's cart after checkout
        await Cart.deleteMany({ userId })

        res.status(201).json({ message: 'Order placed successfully' })
    } catch (error) {
        console.error('Error placing order:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Add an item to the cart
router.post('/:productId', async (req, res) => {
    try {
        let userId = req.session.userId
        if (!userId) {
            userId = uuidv4()
            req.session.userId = userId
        }

        const { productId } = req.params
        const { quantity, chest, waist, hips } = req.body

        // Fetch the product from the DB
        const product = await Product.findOne({ reference: productId })
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        const cartItem = new Cart({
            userId: userId,
            reference: product.reference,
            quantity,
            chest,
            waist,
            hips,
            price: product.price,
            image: product.image
        })

        await cartItem.save()
        res.status(201).json({ message: 'Item added to cart' })
    } catch (error) {
        console.error('Error adding item to cart:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Retrieve cart items for the current user
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId
        if (!userId) {
            return res.status(400).json({ message: 'No active session' })
        }

        const cartItems = await Cart.find({ userId })
        res.json(cartItems)
    } catch (error) {
        console.error('Error fetching cart:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Checkout


export default router

// npm install express express-session cookie-parser
// npm install uuid




//npm install express express-session cookie-parser
//npm install uuid