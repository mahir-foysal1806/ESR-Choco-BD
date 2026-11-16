import 'dotenv/config';
import mongoose from 'mongoose';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing');

  await mongoose.connect(process.env.MONGODB_URI);

  if (mongoose.connection.name !== 'esr-choco-bd') {
    throw new Error(`Wrong database: ${mongoose.connection.name}`);
  }

  const Admin = (await import('../src/models/Admin.js')).default;
  const email = 'shamimhossain0502@gmail.com';

  if (await Admin.findOne({ email })) {
    throw new Error('Admin already exists. Use password update script.');
  }

  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    const password = await rl.question('Enter a new unique password (12+ characters): ');
    const confirm = await rl.question('Confirm password: ');

    if (password.length < 12 || password !== confirm) {
      throw new Error('Password is too short or does not match.');
    }

    await Admin.create({
      name: 'Owner',
      email,
      password,
      role: 'admin',
      isActive: true
    });

    console.log('Admin account created successfully!');
  } finally {
    rl.close();
  }
}

main()
  .catch(e => {
    console.error('Error:', e.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect().catch(() => {}));
