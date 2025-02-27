import jwt from "jsonwebtoken";
import { User } from "../model/User.js";

export const isAuth = async (req, res, next) => {
    try {
      const token = req.headers.token;
      if (!token) {
        return res.status(403).json({ message: "Please Login to access" });
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decode.user._id);

      next();
    } catch (error) {
        return res.status(403).json({ message: "Please Login to access" });
    }
}; 