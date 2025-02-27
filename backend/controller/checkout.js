import { Cart } from "../model/Cart.js";
import { Checkout } from "../model/Checkout.js";
import { Order } from "../model/Order.js";


export const createCheckout = async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "no item in checkout" });
    }

    try {

        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false,
        })
        console.log(`Checkout created for user: ${req.user._id}`);
        res.status(201).json(newCheckout)
        
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
}

export const checkoutAfterPayment = async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;

    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" })
        }

        if(paymentStatus === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();

            res.status(200).json(checkout);
        } else {
            res.status(400).json({ message: "Invalid Payment Status"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
}

export const checkoutFinal = async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        if ( checkout.isPaid && !checkout.isFinalized ) {

            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "Paid",
                paymentDetails: checkout.paymentDetails,
            });

            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();

            await Cart.findOneAndDelete({ user: checkout.user});
            res.status(201).json(finalOrder);
        } else if ( checkout.isFinalized ) {
            res.status(400).json({ message: "Checkout already finalized" });
        } else {
            res.status(400).json({ message: "Checkout is not paid" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
}