import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;