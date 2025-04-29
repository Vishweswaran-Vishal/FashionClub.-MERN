import { Subcriber } from "../model/Subscriber.js";


export const subscriber = async (req, res) => {
    
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        
        let subscriber = await Subcriber.findOne({ email })

        if (subscriber) {
            return res.status(400).json({ message: "Email is already subscribed"})
        }

        subscriber = new Subcriber({ email });
        await subscriber.save();

        res.status(201).json({ message: "Successfully subscribe to the newsletter!"})

    } catch (error) {
        return res.status(500).json({
          message: error.message,
        });
    }
}