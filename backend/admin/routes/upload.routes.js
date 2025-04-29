import express from "express";
import { uploadFiles } from "../middleware/multer.js";
import { uploads } from "../controller/upload.js";

const router = express.Router();

router.post("/", uploadFiles, uploads)

export default router;
