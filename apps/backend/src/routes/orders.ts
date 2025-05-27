import { Router } from "express";
import { errorHandler } from "../schema/error-handler";
import { cancelOrder, createOrder, getAllOrders, getOrderById, listUserOrders, orderList, updateOrderStatus } from "../controllers/orders";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";


const orderRoutes = Router();

orderRoutes.post('/', [authMiddleware] , errorHandler(createOrder));

orderRoutes.get('/', [authMiddleware] , errorHandler(orderList));

orderRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder))

orderRoutes.get('/index', [authMiddleware, adminMiddleware] , errorHandler(getAllOrders));

orderRoutes.get('/user/:id', [authMiddleware, adminMiddleware] , errorHandler(listUserOrders));

orderRoutes.put('/:id/status', [authMiddleware, adminMiddleware] , errorHandler(updateOrderStatus));

orderRoutes.get('/:id', [authMiddleware] , errorHandler(getOrderById));

export default orderRoutes;