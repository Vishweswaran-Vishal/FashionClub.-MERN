import express from "express";
import { AddProductToCart, deleteCartItems, fetchCart, mergeCart, updateCartItems } from "../controller/cart.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/", AddProductToCart);
router.put("/", updateCartItems);
router.delete("/", deleteCartItems );
router.get("/", fetchCart);
router.post("/merge", isAuth, mergeCart);


export default router;