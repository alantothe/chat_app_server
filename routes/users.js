import { Router } from "express";
import * as controllers from "../controllers/users.js";

const router = Router();


router.post("/register", controllers.createUser);
router.get("/", controllers.getUsers);


export default router;