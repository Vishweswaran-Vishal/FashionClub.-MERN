import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { uploadFiles } from "../middleware/multer.js";
import {
  bestSeller,
  createProduct,
  deleteProduct,
  fetchAllProducts,
  fetchProduct,
  newArrivals,
  similarProducts,
  updateProduct,
} from "../controller/product.js";

const router = express.Router();

router.post("/new", isAuth, uploadFiles, createProduct);
router.get("/", fetchAllProducts);
router.get("/best-seller", bestSeller);
router.get("/new-arrivals", newArrivals )
router.get("/:id", fetchProduct);
router.put("/:id", isAuth, updateProduct);
router.delete("/:id", isAuth, deleteProduct);
router.get("/similar/:id", similarProducts);

export default router;
