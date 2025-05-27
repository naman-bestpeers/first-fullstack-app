import { Router } from "express";
import { errorHandler } from "../schema/error-handler";
import { createProduct, deleteProduct, getAllProducts, getProductById, searchProducts, updateProduct } from "../controllers/products";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";


const productsRoutes: Router = Router();

productsRoutes.get('/search', [authMiddleware], errorHandler(searchProducts));

productsRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createProduct));

productsRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(getAllProducts));

productsRoutes.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct));

productsRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct));

productsRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getProductById));



export default productsRoutes;