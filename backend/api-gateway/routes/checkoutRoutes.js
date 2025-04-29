import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Forward all /api/checkout/* to the user service
router.use(
  "/",
  createProxyMiddleware({
    target: process.env.CHECKOUT_ROUTES_URI, // checkout service URL
    changeOrigin: true,
    pathRewrite: {
      "^/api/checkout": "", // removes the /api/checkout prefix
    },
  })
);

export default router;