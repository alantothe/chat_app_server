import { Router } from "express";
import * as controllers from "../controllers/messages.js";

const router = Router();

router.post("/send", controllers.createMessage);
router.post("/fetch-messages", controllers.getMessagesForMembers);
router.post("/seenBy", controllers.seenBy);

export default router;
