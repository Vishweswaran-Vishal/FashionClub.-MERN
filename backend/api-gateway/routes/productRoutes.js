import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Forward all /api/products/* to the user service
router.use(
  "/",
  createProxyMiddleware({
    target: process.env.PRODUCT_ROUTES_URI, // products service URL
    changeOrigin: true,
    pathRewrite: {
      "^/api/products": "", // removes the /api/products prefix
    },
  })
);

export default router;