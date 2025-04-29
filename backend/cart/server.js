import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cartRoutes from "./routes/cart.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", cartRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Cart Server is running`);
});