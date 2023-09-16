import { Router } from "express";
import * as controller from "../controllers/conversation.js";

const router = Router();

router.get("/:_id", controller.fetchConversationById);
router.get("/all/:_id", controller.fetchConversationsByIdSingle);
router.get("/group/:_id", controller.fetchGroupConversationsById);
router.post("/create", controller.createConversation);
router.post("/search/two", controller.fetchConversationByTwoMembers);

export default router;
