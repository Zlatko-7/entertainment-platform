import { Router } from "express";
import express from "express";
import { stripeWebhookController } from "../controllers/stripe-webhook.js";

const router = Router();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  stripeWebhookController,
);

export default router;
