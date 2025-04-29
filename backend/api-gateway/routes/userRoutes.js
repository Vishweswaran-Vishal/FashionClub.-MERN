import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Forward all /api/users/* to the user service
router.use(
  "/",
  createProxyMiddleware({
    target: process.env.USER_ROUTES_URI, // user service URL
    changeOrigin: true,
    pathRewrite: {
      "^/api/users": "", // removes the /api/user prefix
    },
  })
);

export default router;
