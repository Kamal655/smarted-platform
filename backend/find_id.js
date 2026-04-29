import mongoose from 'mongoose';
import Internship from './models/Internship.js';
import dotenv from 'dotenv';
dotenv.config();

const findInternship = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/internspace');
    const internship = await Internship.findOne();
    if (internship) {
      console.log('FOUND_ID:' + internship._id);
    } else {
      console.log('NO_INTERNSHIPS_FOUND');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

findInternship();
