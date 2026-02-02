
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import fs from 'fs';

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});

        let output = `Total Users: ${users.length}\n`;
        users.forEach(u => {
            output += `Email: ${u.email}, Role: ${u.role}, Name: ${u.name}\n`;
        });

        fs.writeFileSync('user_list.txt', output);
        console.log('Done writing users to user_list.txt');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkUsers();
