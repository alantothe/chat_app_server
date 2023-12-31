import { Router } from "express";
import * as controllers from "../controllers/friendRequest.js";

const router = Router();

router.post("/", controllers.sendFriendRequest);
router.post("/accept", controllers.friendRequestAccepted);
router.post("/rejected", controllers.friendRequestRejected);

export default router;
