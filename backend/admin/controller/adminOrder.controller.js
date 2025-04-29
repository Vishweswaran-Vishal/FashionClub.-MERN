import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getAllOrders = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.API_GATEWAY_URI}/api/orders/all`, {
      headers: {
        token: req.headers.token,
      },
    });
    res.json(response.data);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};

export const updateOrders = async (req, res) => {
  try {
    const response = await axios.put(
      `${process.env.API_GATEWAY_URI}/api/orders/${req.params.id}`,
      req.body,
      {
        headers: {
          token: req.headers.token,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const response = await axios.delete(
      `${process.env.API_GATEWAY_URI}/api/orders/${req.params.id}`,
      {
        headers: {
          token: req.headers.token,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error.message);
  }
};
