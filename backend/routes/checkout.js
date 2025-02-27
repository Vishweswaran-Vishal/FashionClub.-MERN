import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { checkoutAfterPayment, checkoutFinal, createCheckout } from "../controller/checkout.js";

const router = express.Router();

router.post("/", isAuth, createCheckout)
router.put("/:id/pay", isAuth, checkoutAfterPayment)
router.post("/:id/finalize", isAuth, checkoutFinal)


export default router;
