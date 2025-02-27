import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { orderDetailsById, userOrders } from "../controller/order.js";

const router = express.Router();

router.get("/my-orders", isAuth, userOrders );
router.get("/:id", isAuth, orderDetailsById );

export default router;