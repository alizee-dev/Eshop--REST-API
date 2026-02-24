import express from "express"
import Cart from "../Models/Cart.mjs"
import Order from "../Models/Order.mjs"
import Product from "../Models/Product.mjs"
import session from "express-session"
import cookieParser from "cookie-parser"
import { v4 as uuidv4 } from 'uuid'
import Stripe from "stripe"
import dotenv from "dotenv"
import authenticateUser from "../middleware/authenticateUser.mjs"
import checkRole from "../middleware/checkRole.mjs"
dotenv.config()

const router = express.Router()

router.use(cookieParser())
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

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

// Stripe checkout session
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

        const { firstname, lastname, email, address } = req.body

        // If no Stripe key, fallback to simple checkout
        if (!process.env.STRIPE_KEY || process.env.STRIPE_KEY === 'ta_cle_stripe') {
            const order = new Order({
                status: 'pending',
                firstname,
                lastname,
                email,
                address,
                bankDetails: 'N/A',
                items: cartItems.map(item => ({
                    reference: item.reference,
                    quantity: item.quantity,
                    chest: item.chest,
                    waist: item.waist,
                    hips: item.hips,
                    price: item.price,
                    image: item.image
                }))
            })
            await order.save()
            await Cart.deleteMany({ userId })
            return res.status(201).json({ message: 'Order placed successfully' })
        }

        // Stripe checkout
        const stripe = new Stripe(process.env.STRIPE_KEY)
        const YOUR_DOMAIN = process.env.FRONTEND_URL || 'http://localhost:9000'

        const line_items = cartItems.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: { name: `Ref. ${item.reference}` },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }))

        // Shipping fee
        line_items.push({
            price_data: {
                currency: 'eur',
                product_data: { name: 'Shipping Fee' },
                unit_amount: 1500
            },
            quantity: 1
        })

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}?success=true`,
            cancel_url: `${YOUR_DOMAIN}/cart.html?canceled=true`
        })

        const order = new Order({
            status: 'pending payment',
            firstname,
            lastname,
            email,
            address,
            bankDetails: 'Stripe',
            items: cartItems.map(item => ({
                reference: item.reference,
                quantity: item.quantity,
                chest: item.chest,
                waist: item.waist,
                hips: item.hips,
                price: item.price,
                image: item.image
            }))
        })
        await order.save()
        await Cart.deleteMany({ userId })

        res.json({ url: stripeSession.url })

    } catch (error) {
        console.error('Error during checkout:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Get all orders (admin only)
router.get('/orders', authenticateUser, checkRole(["admin"]), async (req, res) => {
    try {
        const orders = await Order.find()
        res.json(orders)
    } catch (err) {
        console.error("Error while retrieving orders:", err)
        res.status(500).json({ error: "Server error" })
    }
})

// Get one order (admin only)
router.get('/orders/:orderId', authenticateUser, checkRole(["admin"]), async (req, res) => {
    try {
        const _id = req.params.orderId
        const order = await Order.find({ _id })
        if (!order) {
            return res.status(404).json({ error: 'Order not found' })
        }
        res.json(order)
    } catch (err) {
        console.error('Error while retrieving the order:', err)
        res.status(500).json({ error: "Order not found" })
    }
})

export default router

// npm install express express-session cookie-parser
// npm install uuid
