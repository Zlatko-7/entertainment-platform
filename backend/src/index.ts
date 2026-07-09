import "dotenv/config";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import movieRoutes from "./routes/movie.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import stripeWebhookRoutes from "./routes/stripe-webhook.routes.js";
import orderHistoryRoutes from "./routes/order-history-routes.js";
import purchaedItemsRoutes from "./routes/purchasedProducts.routes.js";

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use("/api/stripe/webhook", stripeWebhookRoutes);
app.use(express.json());
app.use(cookieParser());
app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});
app.use("/api/auth", authRoutes);
app.use("/api/get-movies", movieRoutes);
app.use("/api/stripe/create-payment", paymentRoutes);
app.use("/api/order-history", orderHistoryRoutes);
app.use("/api/purchased-items", purchaedItemsRoutes);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
