import { Router } from "express";
import * as controller from "../controllers/conversation.js";

const router = Router();

router.get("/:_id", controller.fetchConversationById);
router.post("/create", controller.createConversation);

export default router;
