import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getAllProducts = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.API_GATEWAY_URI}/api/products`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
