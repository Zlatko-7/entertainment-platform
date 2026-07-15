import { Request, Response } from "express";
import { createPaymentService } from "../services/create-payment-service.js";

export async function createPaymentController(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId, movieId } = req.body as {
      productId?: string;
      movieId?: string;
    };

    const results = await createPaymentService({ userId, movieId, productId });

    return res.json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Initial server error" });
  }
}
