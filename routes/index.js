import { Router } from "express";
import usersRouter from "./users.js";
import friendRequestRouter from "./friendRequest.js"



const router = Router();

router.get("/", (req, res) => {
    res.send("This is the api root!");
  });

router.use("/users", usersRouter);
router.use("/friendRequest", friendRequestRouter)





  export default router;