import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./routes/auth-routes.js";
import movieRoutes from "./routes/movie-routes.js";
import addMovieRoutes from "./routes/add-movie-routes.js";
import paymentRoutes from "./routes/payment-routes.js";
import stripeWebhookRoutes from "./routes/stripe-webhook-routes.js";
import orderHistoryRoutes from "./routes/order-history-routes.js";
import purchasedItemsRoutes from "./routes/purchased-products-routes.js";
import errorMiddleware from "./middleware/error-middleware.js";
import { generalRateLimiter } from "./middleware/rate-limit.js";

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT ?? 3000;

app.use(helmet());
app.use(generalRateLimiter);
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use("/api/stripe/webhook", stripeWebhookRoutes);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(
  "/uploads",
  (_req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.resolve("uploads")),
);
app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});
app.use("/api/auth", authRoutes);
app.use("/api/get-movies", movieRoutes);
app.use("/api/add-movies", addMovieRoutes);
app.use("/api/stripe/create-payment", paymentRoutes);
app.use("/api/order-history", orderHistoryRoutes);
app.use("/api/purchased-items", purchasedItemsRoutes);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
