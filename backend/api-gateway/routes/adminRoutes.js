import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Forward all /api/admin/* to the user service
router.use(
  "/",
  createProxyMiddleware({
    target: process.env.ADMIN_ROUTES_URI, // admin service URL
    changeOrigin: true,
    pathRewrite: {
      "^/": "/api/admin/", // removes the /api/admin prefix
    },
  })
);

export default router;