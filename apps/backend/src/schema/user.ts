import { z } from 'zod';

export const SignUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
});

export const AddressSchema = z.object({
  lineOne: z.string(),
  lineTwo: z.string().optional(),
  city: z.string(),
  country: z.string(),
  state: z.string().optional(),
  pinCode: z.string().length(6),
})

export const UpdateUserSchema = z.object({
    name: z.string().optional(),
    defaultShippingAddress: z.number().optional(),
    defaultBillingAddress: z.number().optional(),
})

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export const UpdateUserRoleSchema = z.object({
    role: z.enum([
      Role.ADMIN,
      Role.USER
    ]),
})
