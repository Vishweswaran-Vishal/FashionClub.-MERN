import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, match: [/.+\@.+\..+/, "Please enter a valid email address" ]},
    password: { type: String, required: true, minLength: 6, },
    role: { type: String, default: "customer", enum: ["customer", "admin"], },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword -
  async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

export const User = mongoose.model("User", userSchema);
