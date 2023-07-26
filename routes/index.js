import { Router } from "express";
import usersRouter from "./users.js";


const router = Router();

router.get("/", (req, res) => {
    res.send("This is the api root!");
  });

router.use("/users", usersRouter);





  export default router;