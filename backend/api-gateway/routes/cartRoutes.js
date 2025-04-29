import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Forward all /api/cart/* to the user service
router.use(
  "/",
  createProxyMiddleware({
    target: process.env.CART_ROUTES_URI, // cart service URL
    changeOrigin: true,
    pathRewrite: {
      "^/api/cart": "", // removes the /api/cart prefix
    },
  })
);

export default router;