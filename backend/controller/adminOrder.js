import { Order } from "../model/Order.js";


export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email");
        res.json(orders)
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
}

export const updateOrders = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if(order){
            order.status = req.body.status || order.status;
            order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
            order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt; 

            const updateOrder = await order.save()
                res.json(updateOrder);
        } else {
            res.status(404).json({ message: "Order not found"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: "Order Removed"})
        } else {
            res.status(404).json({message: "Order not found!"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
}