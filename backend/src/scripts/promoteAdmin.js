import mongoose from 'mongoose';
import config from '../config/env.js';
import User from '../models/User.js';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();

if (!email) {
  console.error('ADMIN_EMAIL is required. No account was changed.');
  process.exit(1);
}

try {
  await mongoose.connect(config.mongoUri);
  const user = await User.findOne({ email });

  if (!user) {
    console.error(`No user exists for ${email}. No account was changed.`);
    process.exitCode = 1;
  } else {
    user.role = 'admin';
    await user.save();
    console.log(`Admin role granted to ${user.email}.`);
  }
} finally {
  await mongoose.disconnect();
}
