import express from "express"
const router = express.Router()

import productRouter from "./products.mjs"
router.use('/products', productRouter)
import cartRouter from "./carts.mjs"
router.use("/cart", cartRouter)
import loginRouter from "./login.mjs"
router.use('/login', loginRouter)
import registerRouter from "./register.mjs"
router.use('/register', registerRouter)
import usersRouter from "./users.mjs"
router.use('/users', usersRouter)
import emailRouter from "./email.mjs"
router.use('/email', emailRouter)

export default router