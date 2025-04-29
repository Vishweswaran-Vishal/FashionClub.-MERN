import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.routes.js";
import AdminProductRoutes from "./routes/adminProduct.routes.js";
import AdminOrderRoutes from "./routes/adminOrder.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Proxy user-related routes
app.use("/api/admin/products", AdminProductRoutes);
app.use("/api/admin/orders", AdminOrderRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Admin service running`);
});
