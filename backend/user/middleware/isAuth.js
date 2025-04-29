import jwt from "jsonwebtoken";
import { User } from "../model/User.model.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.headers.token;

    if (token?.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No auth token provided." });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decode.user._id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
