import express from "express";
import { subscriber } from "../controller/subscriber.js";

const router = express.Router();

router.post("/" , subscriber)

export default router;
