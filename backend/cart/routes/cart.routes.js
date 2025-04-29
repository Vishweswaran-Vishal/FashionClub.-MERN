import express from "express";
import {
  AddProductToCart,
  deleteCartItems,
  fetchCart,
  mergeCart,
  updateCartItems,
  clearCart
} from "../controller/cart.controller.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/", AddProductToCart);
router.put("/", updateCartItems);
router.delete("/", deleteCartItems);
router.delete("/clear", clearCart);
router.get("/", fetchCart);
router.post("/merge", isAuth, mergeCart);

export default router;
