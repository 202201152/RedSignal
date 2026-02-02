
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const resetAdminPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@durgaartzone.com';
        const newPassword = 'admin123'; // Setting a known password

        const user = await User.findOne({ email });

        if (user) {
            user.password = newPassword; // The pre-save hook will hash this
            await user.save();
            console.log(`Password for ${email} has been reset to: ${newPassword}`);
        } else {
            console.log(`User ${email} not found. Creating new admin.`);
            await User.create({
                name: 'Admin User',
                email: email,
                password: newPassword,
                role: 'admin'
            });
            console.log(`Created new admin: ${email} / ${newPassword}`);
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetAdminPassword();
