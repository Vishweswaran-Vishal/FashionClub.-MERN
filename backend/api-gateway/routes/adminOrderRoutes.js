import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

// Forward all /api/admin/orders/* to the user service
router.use(
  "/",
  createProxyMiddleware({
    target: process.env.ADMIN_ORDER_ROUTES_URI, // admin/orders service URL
    changeOrigin: true,
    pathRewrite: {
      "^/": "/api/admin/orders/", // Force prepend /api/admin/products
    },
  })
);

export default router;