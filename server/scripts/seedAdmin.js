require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User.model');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@prepstack.ai';
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin user already exists!');
    } else {
      admin = await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: 'password123',
        role: 'admin'
      });
      console.log('Admin user created successfully!');
    }
    
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: password123`);

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdmin();
