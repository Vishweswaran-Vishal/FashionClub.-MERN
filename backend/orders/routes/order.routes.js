import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  orderDetailsById,
  userOrders,
  createOrder,
  getAllOrders,
  updateOrders,
} from "../controller/order.controller.js";

const router = express.Router();

router.get("/all", isAuth, isAdmin, getAllOrders);
router.get("/my-orders", isAuth, userOrders);
router.get("/:id", isAuth, orderDetailsById);
router.post("/new", isAuth, createOrder);
router.put("/:id", isAuth, updateOrders);

export default router;
