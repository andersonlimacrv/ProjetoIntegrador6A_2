import { Hono } from "hono";
import { AuthController } from "../controllers/AuthController";

const router = new Hono();

router.post("/register", AuthController.register);

export default router;
