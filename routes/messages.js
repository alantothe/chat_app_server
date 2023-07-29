import { Router } from "express";
import * as controllers from "../controllers/messages.js"



const router = Router()

router.post("/send", controllers.createMessage)

export default router

