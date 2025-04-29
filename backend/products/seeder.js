import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./model/Product.js";
import { User } from "./model/user.js";
import  products  from "./data/products.js";
import { Cart } from "./model/Cart.js";

dotenv.config();

mongoose.connect(process.env.URL);

const seedData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@emaple.com",
            password: "123456",
            role: "admin",
        })

        const userID = createdUser._id;

        const sampleProducts = products.map((product) =>{
            return {...product, user: userID};
        })

        await Product.insertMany(sampleProducts);
        
        console.log("Product data seeded successfully!");
        process.exit();

    } catch (error) {
        console.error("Error seeding the data: ", error);
        process.exit(1);
    }
}

seedData();