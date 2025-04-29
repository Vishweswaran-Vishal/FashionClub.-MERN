import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ message: "No auth token provided." });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode.user;
    next();
    
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
