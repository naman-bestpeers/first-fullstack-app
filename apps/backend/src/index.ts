import express, {Express, Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import rootRouter from './routes';
import { errorMiddleware } from './middlewares/errors';
import { SignUpSchema } from './schema/user';
import cors from "cors";

const app: Express = express();
const PORT = process.env.PORT || 5000;

export const prismaClient = new PrismaClient({
  log: ['query']
})
// .$extends({
//   query: {
//     user: {
//       create: ({args, query}) => {
//         args.data = SignUpSchema.parse(args.data);
//         return query(args);
//       }
//     }
//   }
// })

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000", // Adjust for production
  credentials: true // If sending cookies or auth headers
}));

app.use(express.json());
app.use('/api', rootRouter)

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
