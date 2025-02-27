import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { getAllProducts } from "../controller/adminProduct.js";

const router = express.Router();

router.get("/", isAuth, isAdmin, getAllProducts)

export default router;