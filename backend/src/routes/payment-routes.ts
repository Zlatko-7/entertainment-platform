import { Router } from "express";
import { isAuthenticated } from "../middleware/auth-middleware.js";
import { createPaymentController } from "../controllers/create-payment.js";

const router = Router();
// CURSOS LAST CHANGE: require login before creating a payment (userId for orders FK)
router.post("/", isAuthenticated, createPaymentController);

export default router;
