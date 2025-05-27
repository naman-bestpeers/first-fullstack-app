import { Router } from "express";
import { addAddress, deleteAddress, getAllAddress, getUserById, updateUser, updateUserRole, userList } from "../controllers/users";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../schema/error-handler";
import adminMiddleware from "../middlewares/admin";

const userRoutes = Router();

userRoutes.post("/address", [authMiddleware], errorHandler(addAddress));

userRoutes.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress));

userRoutes.get("/address", [authMiddleware], errorHandler(getAllAddress));

userRoutes.put("/", [authMiddleware], errorHandler(updateUser));

userRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(userList));

userRoutes.put("/:id/role", [authMiddleware, adminMiddleware], errorHandler(updateUserRole));

userRoutes.get("/:id", [authMiddleware, adminMiddleware], errorHandler(getUserById));





export default userRoutes;
