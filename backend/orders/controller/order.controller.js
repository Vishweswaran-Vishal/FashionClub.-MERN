import { Order } from "../model/Order.model.js";

export const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      user: req.body.user,
      name: req.body.name,
      email: req.body.email,
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalPrice: req.body.totalPrice,
      isPaid: req.body.isPaid,
      paidAt: req.body.paidAt,
      isDelivered: false,
      paymentStatus: req.body.paymentStatus,
      paymentDetails: req.body.paymentDetails,
    });
    res.status(201).json(order);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};

export const orderDetailsById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};

export const updateOrders = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      order.isDelivered =
        req.body.status === "Delivered" ? true : order.isDelivered;
      order.deliveredAt =
        req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

      const updateOrder = await order.save();
      res.json(updateOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.json({ message: "Order Removed" });
    } else {
      res.status(404).json({ message: "Order not found!" });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};
