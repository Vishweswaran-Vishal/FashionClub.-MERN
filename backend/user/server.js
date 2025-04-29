import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`User Server is running`);
});