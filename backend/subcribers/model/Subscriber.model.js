import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    subscibedAt: {
        type: Date,
        default: Date.now,
    },
})

export const Subcriber = mongoose.model("Subscriber", subscriberSchema);