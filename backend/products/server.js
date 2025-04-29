import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/product.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", productRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Product Server is running`);
});