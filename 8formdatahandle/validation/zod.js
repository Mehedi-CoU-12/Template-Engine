import z, { email } from "zod";

export const userSchema = z.object({
    name: z.string(),
    age: z.number().refine((value) => value > 0, {
        message: "Age must be a positive number",
    }),
    city: z.string(),
    contact: z.object({
        email: z.string().email(),
        phone: z.number(),
        address: z.object({
            street: z.string(),
            zip: z.number(),
            full:z.string()
        }),
    }),
    skills: z.array(z.string()),
    education: z.object({
        university: z.string(),
        degree: z.string(),
        year: z.number(),
        summary:z.string()
    }),
});
