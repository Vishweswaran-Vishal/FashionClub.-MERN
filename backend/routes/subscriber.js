import express from "express";
import { subscriber } from "../controller/subscriber.js";

const router = express.Router();

router.post("/subscribe" , subscriber)

export default router;
