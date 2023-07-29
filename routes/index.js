import { Router } from "express";
import usersRouter from "./users.js";
import friendRequestRouter from "./friendRequest.js"
import conversationRouter from "./conversation.js"
import messagesRouter from "./messages.js"




const router = Router();

router.get("/", (req, res) => {
    res.send("This is the api root!");
  });

router.use("/users", usersRouter);
router.use("/friendRequest", friendRequestRouter)
router.use("/conversation", conversationRouter)
router.use('/messages', messagesRouter )





  export default router;