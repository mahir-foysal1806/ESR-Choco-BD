
import 'dotenv/config';
import mongoose from 'mongoose';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI missing');
  }

  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const Admin = (await import('../src/models/Admin.js')).default;

    const email = 'shamimhossain0502@gmail.com';
    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new Error('Admin not found. Create the admin first.');
    }

    const password = await rl.question('New admin password: ');
    if (password.length < 12) {
      throw new Error('Password must be at least 12 characters.');
    }

    const confirm = await rl.question('Confirm password: ');
    if (password !== confirm) {
      throw new Error('Passwords do not match.');
    }

    admin.password = password;
    await admin.save();

    console.log('Admin password updated successfully!');
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exitCode = 1;
});

