import 'dotenv/config';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';
import Category from './models/Category.js';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Copy .env.example to .env and set it.');
  process.exit(1);
}

const port = process.env.PORT || 5000;
async function prepareRetailCategories() {
  const legacyNames = [
    ['chocolates', 'Chocolates', 'Chocolate', 'চকলেট'],
    ['premium-nuts', 'Premium Nuts', 'Nuts', 'বাদাম'],
    ['premium-dates', 'Premium Dates', 'Dates', 'খেজুর'],
    ['gift-boxes', 'Gift Boxes', 'Gift Items', 'উপহার সামগ্রী'],
  ];
  for (const [slug, oldName, name, nameBn] of legacyNames) {
    await Category.updateOne({ slug, name: oldName }, { $set: { name, nameBn } });
  }
  await Category.updateOne(
    { slug: 'coffee' },
    { $setOnInsert: { name: 'Coffee', nameBn: 'কফি', slug: 'coffee', icon: '☕', sortOrder: 2, description: 'Coffee blends and specialty coffee for everyday rituals.', isActive: true } },
    { upsert: true }
  );
}

connectDB()
  .then(async () => {
    await prepareRetailCategories();
    createApp().listen(port, () => console.log(`API running on http://localhost:${port}`));
  })
  .catch((e) => {
    console.error('Failed to start:', e.message);
    process.exit(1);
  });
