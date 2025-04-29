import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Forward all /api/admin/products/* to the user service
router.use(
  "/",
  createProxyMiddleware({
    target: process.env.ADMIN_PRODUCT_ROUTES_URI, // admin/products service URL
    changeOrigin: true,
    pathRewrite: {
      "^/": "/api/admin/products", // Force prepend /api/admin/products
    },
  })
);

export default router;