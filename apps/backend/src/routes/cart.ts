import { Router } from "express";
import { errorHandler } from "../schema/error-handler";
import { addItemToCart, deleteItemFromCart, getCart, updateQuantity } from "../controllers/cart";
import authMiddleware from "../middlewares/auth";

const cartRoutes = Router();

cartRoutes.post('/', [authMiddleware], errorHandler(addItemToCart))

cartRoutes.put('/:id', [authMiddleware], errorHandler(updateQuantity));

cartRoutes.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart));

cartRoutes.get('/', [authMiddleware], errorHandler(getCart));


export default cartRoutes;

