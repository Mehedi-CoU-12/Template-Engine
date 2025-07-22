import z, { email } from "zod";

const useSchema=z.object({
    name:z.string(),
    age:z.string(),
    city:z.string(),
    contact:z.object({
        email:z.string().email(),
        phone:z.string(),
        address:z.object({
            street:z.string(),
            zip:z.string()
        })
    }),
    skills:z.array((z.string())),
    education:z.object({
        university:z.string(),
        degree:z.string(),
        year:z.string()
    })
})