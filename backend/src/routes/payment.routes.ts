import { Router } from "express";
import { createPayment } from "../controllers/createPayment.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();
// CURSOS LAST CHANGE: require login before creating a payment (userId for orders FK)
router.post("/", isAuthenticated, createPayment);

export default router;
