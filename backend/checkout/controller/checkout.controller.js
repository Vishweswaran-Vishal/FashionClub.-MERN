import { Checkout } from "../model/Checkout.model.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const createCheckout = async (req, res) => {
  const { userId, name, email, checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "no item in checkout" });
  }

  try {
    const newCheckout = await Checkout.create({
      user: userId,
      name: name,
      email: email,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });
    res.status(201).json(newCheckout);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};

export const checkoutAfterPayment = async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};

export const checkoutFinal = async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (!checkout.name || !checkout.email) {
      return res
        .status(400)
        .json({ message: "Name and email are required in checkout" });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      const { data: finalOrder } = await axios.post(
        `${process.env.API_GATEWAY_URI}/api/orders/new`,
        {
          user: checkout.user,
          name: checkout.name,
          email: checkout.email,                      
          orderItems: checkout.checkoutItems,
          shippingAddress: checkout.shippingAddress,
          paymentMethod: checkout.paymentMethod,
          totalPrice: checkout.totalPrice,
          paidAt: checkout.paidAt,
          isPaid: checkout.isPaid,
          paymentStatus: checkout.paymentStatus,
          paymentDetails: checkout.paymentDetails,
        },
        {
          headers: {
            token: req.headers.token, // Pass the token here
          },
        }
      );
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();
      await axios.delete(`${process.env.API_GATEWAY_URI}/api/cart/clear`, {
        data: {
          userId: checkout.user,
        },
      });
      return res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      return res
        .status(200)
        .json({ message: "Checkout already finalized", checkout });
    } else {
      return res.status(400).json({ message: "Checkout is not paid" });
    }
  } catch (error) {
    // console.error("Error in checkoutFinal:", error.message);
    return res.status(500).json({ message: error.message });
  }
};
