import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { signupSchema } from "../schemas/auth-schema.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password } = signupSchema.parse(req.body);
    const existingEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return res.status(201).json({
      message: "User registered successfully",
      users: {
        newUser,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
