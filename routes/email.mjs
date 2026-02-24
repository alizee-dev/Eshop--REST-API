import express from "express"
import { sendContactEmail } from "../controllers/emailControllers.mjs"

const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.post('/', sendContactEmail)

export default router