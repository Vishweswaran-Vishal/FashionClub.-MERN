import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../model/user.js";
import sendMail from "../middleware/sendMail.js";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const otp = Math.floor(Math.random() * 100000).toString();

    user = { name, email, hashedPassword };

    const activationToken = jwt.sign(
      { user, otp },
      process.env.ACTIVATION_SECRET,
      { expiresIn: "5m" }
    );

    const message = `Please Verify your account using this OTP: ${otp}`;
    await sendMail(email, "Verify your Account", message);

    return res
      .status(200)
      .json({ message: "OTP sent to your email", activationToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyUser = async (req, res) => {
    try {
        const {otp, activationToken} = req.body;
        const verify = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);

        if(!verify){
            return res.status(400).json({message: "Invalid or expired token"});
        }
        
        if(verify.otp !== otp){
            return res.status(400).json({message: "Invalid OTP"});
        }

        await User.create({
            name: verify.user.name,
            email: verify.user.email,
            password: verify.user.hashedPassword,
            role: User.role
        });

        return res.status(200).json({message: "User registered successfully"});

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });            
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ user: {_id: user.id, role: user.role} }, process.env.JWT_SECRET, { expiresIn: "15d" });

        const {password: userPassword, ...userDetails} = user.toObject();
        return res.status(200).json({message: `Welcome ${user.name}`, token, user: userDetails});

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const profilePage = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password");
      return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};