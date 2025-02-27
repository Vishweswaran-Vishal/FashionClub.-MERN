import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/db.js";

import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import checkoutRoutes from "./routes/checkout.js";
import orderRoutes from "./routes/order.js"
import uploadRoutes from "./routes/upload.js";
import subscribeRoutes from "./routes/subscriber.js";
import adminRoutes from "./routes/admin.js";
import adminProductRoutes from "./routes/adminProduct.js";
import adminOrderRoutes from "./routes/adminOrder.js";

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT;

connectDB();

app.get("/", (req, res) => {
    res.send("Backend Connected Successfully!");
});

app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/checkout", checkoutRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/", subscribeRoutes)


app.use("/api/admin", adminRoutes)
app.use("/api/admin/products", adminProductRoutes)
app.use("/api/admin/orders", adminOrderRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});