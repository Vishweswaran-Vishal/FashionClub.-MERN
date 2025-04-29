import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import checkoutRoutes from "./routes/checkout.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", checkoutRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Checkout Server is running`);
});
