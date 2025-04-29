import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  deleteOrder,
  getAllOrders,
  updateOrders,
} from "../controller/adminOrder.controller.js";

const router = express.Router();

router.get("/", isAuth, isAdmin, getAllOrders);
router.put("/:id", isAuth, isAdmin, updateOrders);
router.delete("/:id", isAuth, isAdmin, deleteOrder);

export default router;
