import { Router } from "express";
import * as controllers from "../controllers/messages.js";

const router = Router();
router.get("/api/messages/search", controllers.searchMessages);
router.post("/send", controllers.createMessage);
router.post("/fetch-messages", controllers.getMessagesForMembers);

export default router;
