import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../model/User.model.js";
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

    // const hashedPassword = await bcrypt.hash(password, 12);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user = { name, email, password };

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
    const { otp, activationToken } = req.body;
    const verify = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);

    if (!verify) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (verify.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await User.create({
      name: verify.user.name,
      email: verify.user.email,
      password: verify.user.password,
      role: User.role,
    });

    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user: { _id: user.id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    const { password: userPassword, ...userDetails } = user.toObject();
    return res
      .status(200)
      .json({ message: `Welcome ${user.name}`, token, user: userDetails });
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

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addNewUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ message: "user already exists" });
        }
        user = new User({
          name,
          email,
          password,
          role: role || "customer",
        });
        await user.save();
        res.status(201).json({ message: "User created Successfully!", user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
          user.name = req.body.name || user.name;
          user.email = req.body.email || user.email;
          user.role = req.body.role || user.role;
        }
        const updatedUser = await user.save();
        res.json({ message: "user updated successfully", user: updatedUser });
    } catch (error) {
        // console.error(error);
        return res.status(500).json(error.message);
    }
}

export const deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (user) {
        await user.deleteOne();
        res.json({ message: "User deleted successfully!" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      // console.error(error);
      res.status(500).json(error.message);
    }
}