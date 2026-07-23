import * as z from "zod";

export const createMovieSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }),
  year: z.coerce
    .number()
    .int()
    .min(1888, { message: "Year is invalid" })
    .max(2100, { message: "Year is invalid" }),
  director: z.string().trim().min(1, { message: "Director is required" }),
  rating: z.coerce
    .number()
    .min(0, { message: "Rating must be between 0 and 10" })
    .max(10, { message: "Rating must be between 0 and 10" }),
  genre: z.string().trim().min(1, { message: "Genre is required" }),
  cast: z
    .string()
    .transform((value, ctx) => {
      try {
        const parsed: unknown = JSON.parse(value);
        if (
          !Array.isArray(parsed) ||
          !parsed.every((item) => typeof item === "string")
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Cast must be a JSON array of strings",
          });
          return z.NEVER;
        }
        return parsed.map((name) => name.trim()).filter(Boolean);
      } catch {
        ctx.addIssue({
          code: "custom",
          message: "Cast must be a JSON array of strings",
        });
        return z.NEVER;
      }
    })
    .pipe(z.array(z.string()).min(1, { message: "Cast is required" })),
  synopsis: z.string().trim().min(1, { message: "Synopsis is required" }),
  price: z.coerce.number().positive({ message: "Price must be greater than 0" }),
});
