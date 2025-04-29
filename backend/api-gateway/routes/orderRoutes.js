import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Forward all /api/order/* to the user service
router.use(
  "/",
  createProxyMiddleware({
    target: process.env.ORDER_ROUTES_URI, // order service URL
    changeOrigin: true,
    pathRewrite: {
      "^/api/orders": "", // removes the /api/order prefix
    },
  })
);

export default router;