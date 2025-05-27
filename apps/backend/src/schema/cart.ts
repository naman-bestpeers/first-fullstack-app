import { z } from 'zod';

export const CartSchema = z.object({
    quantity: z.number(),
    productId: z.number()
})

export const UpdateQuantitySchema = z.object({
    quantity: z.number(),
})