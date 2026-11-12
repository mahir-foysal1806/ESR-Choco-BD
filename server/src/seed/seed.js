
import 'dotenv/config';
import mongoose from 'mongoose';
import slugify from 'slugify';

import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Admin from '../models/Admin.js';
import { getSettings, saveSettings } from '../models/AdminSettings.js';

// ==============================
// CATEGORIES
// ==============================

const categories = [
  { name: 'Chocolates', nameBn: 'চকলেট', slug: 'chocolates', icon: '🍫', sortOrder: 1, description: 'Rich, delicious chocolate treats for every occasion.' },
  { name: 'Premium Nuts', nameBn: 'প্রিমিয়াম বাদাম', slug: 'premium-nuts', icon: '🌰', sortOrder: 2, description: 'Carefully selected almonds, cashews, pistachios and more.' },
  { name: 'Premium Dates', nameBn: 'প্রিমিয়াম খেজুর', slug: 'premium-dates', icon: '🌴', sortOrder: 3, description: 'Naturally sweet dates for snacking and gifting.' },
  { name: 'Gift Boxes', nameBn: 'গিফট বক্স', slug: 'gift-boxes', icon: '🎁', sortOrder: 4, description: 'Thoughtful assortments for celebrations and special moments.' },
];

const products = [
  { cat: 'chocolates', name: 'Belgian Dark Chocolate', nameBn: 'বেলজিয়ান ডার্ক চকলেট', price: 490, comparePrice: 550, unit: '100 g', weightKg: 0.15, stockQty: 45, isTodaysOffer: true, offerNote: 'Save ৳60', shortDescription: 'Deep cocoa flavour with a smooth, satisfying finish.' },
  { cat: 'chocolates', name: 'Creamy Milk Chocolate', nameBn: 'ক্রিমি মিল্ক চকলেট', price: 350, unit: '100 g', weightKg: 0.15, stockQty: 60, isTodaysFresh: true, shortDescription: 'A creamy, mellow chocolate treat for all ages.' },
  { cat: 'chocolates', name: 'Chocolate Almond Bites', nameBn: 'চকলেট আমন্ড বাইটস', price: 620, comparePrice: 690, unit: '200 g', weightKg: 0.25, stockQty: 32, isTodaysOffer: true, shortDescription: 'Crunchy almonds wrapped in a rich chocolate coating.' },
  { cat: 'premium-nuts', name: 'Premium California Almonds', nameBn: 'প্রিমিয়াম কাঠবাদাম', price: 780, unit: '500 g', weightKg: 0.55, stockQty: 50, isOrganic: true, isTodaysFresh: true, shortDescription: 'Selected whole almonds with a naturally crisp bite.' },
  { cat: 'premium-nuts', name: 'Whole Cashew Nuts', nameBn: 'আস্ত কাজুবাদাম', price: 890, comparePrice: 950, unit: '500 g', weightKg: 0.55, stockQty: 38, isTodaysOffer: true, shortDescription: 'Rich, buttery cashews selected for size and freshness.' },
  { cat: 'premium-nuts', name: 'Roasted Pistachios', nameBn: 'রোস্টেড পেস্তা বাদাম', price: 1150, unit: '250 g', weightKg: 0.3, stockQty: 22, shortDescription: 'A premium crunchy snack with a naturally nutty flavour.' },
  { cat: 'premium-dates', name: 'Ajwa Dates', nameBn: 'আজওয়া খেজুর', price: 1250, unit: '500 g', weightKg: 0.6, stockQty: 30, isTodaysFresh: true, shortDescription: 'Soft, naturally sweet Ajwa dates, carefully packed.' },
  { cat: 'premium-dates', name: 'Medjool Dates', nameBn: 'মেডজুল খেজুর', price: 980, unit: '500 g', weightKg: 0.6, stockQty: 28, shortDescription: 'Large, soft dates with a rich caramel-like sweetness.' },
  { cat: 'premium-dates', name: 'Premium Mabroom Dates', nameBn: 'প্রিমিয়াম মাবরুম খেজুর', price: 850, unit: '500 g', weightKg: 0.6, stockQty: 26, shortDescription: 'Delicately chewy dates with a balanced natural sweetness.' },
  { cat: 'gift-boxes', name: 'Chocolate & Nuts Gift Box', nameBn: 'চকলেট ও বাদাম গিফট বক্স', price: 1490, comparePrice: 1650, unit: '1 box', weightKg: 1, stockQty: 15, isTodaysOffer: true, offerNote: 'Gift favourite', shortDescription: 'A thoughtful assortment of chocolate and premium nuts.' },
];

// ==============================
// SEED FUNCTIONS
// ==============================

async function seedCategories() {
  const categoryMap = {};
  const legacyCategories = await Category.find({ slug: { $nin: categories.map((c) => c.slug) } }).select('_id');
  if (legacyCategories.length) {
    await Product.updateMany({ category: { $in: legacyCategories.map((c) => c._id) } }, { $set: { isActive: false } });
    await Category.updateMany({ _id: { $in: legacyCategories.map((c) => c._id) } }, { $set: { isActive: false } });
  }

  for (const category of categories) {
    const savedCategory = await Category.findOneAndUpdate(
      { slug: category.slug },
      { $set: category },
      { upsert: true, new: true, runValidators: true }
    );

    categoryMap[category.slug] = savedCategory;
  }

  console.log(`Categories ready: ${categories.length}`);

  return categoryMap;
}

async function seedProducts(categoryMap) {
  const reset = process.argv.includes('--reset');
  const productCount = await Product.countDocuments({ category: { $in: Object.values(categoryMap).map((c) => c._id) } });

  if (productCount > 0 && !reset) {
    console.log(`Products already exist: ${productCount}. Skipped.`);
    return;
  }

  if (reset) {
    await Product.deleteMany({});
  }

  for (const { cat, sold, ...product } of products) {
    const category = categoryMap[cat];

    if (!category) {
      throw new Error(`Category not found: ${cat}`);
    }

    await Product.create({
      ...product,
      slug: slugify(product.name, { lower: true, strict: true }),
      category: category._id,
      soldCount: sold || 0,
    });
  }

  console.log(`Products seeded: ${products.length}`);
}

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@cocoacrunch.com')
    .trim()
    .toLowerCase();

  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Owner';

  if (!password || password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be set and at least 8 characters long.');
  }

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    console.log(`Admin already exists: ${email}`);
    console.log('Existing password was NOT changed.');
    return;
  }

  await Admin.create({
    name,
    email,
    password,
    role: 'admin',
    isActive: true,
  });

  console.log(`Admin created successfully: ${email}`);
}

async function seedSettings() {
  const settings = await getSettings();
  settings.brand = { ...settings.brand, name: 'ESR Choco BD', nameBn: 'ইএসআর চকো বিডি', tagline: 'Premium Chocolate, Coffee & Gift Items', logo: settings.brand?.logo || '' };
  settings.banners = [
    { title: 'A Little More Chocolate in Every Day', subtitle: 'Discover rich chocolate treats, carefully selected nuts and naturally sweet dates.', ctaText: 'Explore Collection', ctaLink: '/shop', image: '', theme: 'earth', active: true },
    { title: 'Nuts That Make Every Bite Better', subtitle: 'Almonds, cashews, pistachios and more — selected for freshness and crunch.', ctaText: 'Shop Nuts', ctaLink: '/shop?category=premium-nuts', image: '', theme: 'honey', active: true },
    { title: 'Naturally Sweet. Simply Delicious.', subtitle: 'Premium dates for everyday snacking, gifting and special moments.', ctaText: 'Shop Dates', ctaLink: '/shop?category=premium-dates', image: '', theme: 'leaf', active: true },
  ];
  settings.announcement = { ...settings.announcement, active: true, text: '🍫 Premium chocolates · 🌰 Handpicked nuts · 🌴 Naturally sweet dates · Cash on Delivery available' };
  settings.trustBadges = [
    { icon: 'leaf', title: 'Carefully Selected', text: 'Thoughtful product selection' },
    { icon: 'truck', title: 'Nationwide Delivery', text: 'Delivery across Bangladesh' },
    { icon: 'shield', title: 'Packed with Care', text: 'Every order handled with care' },
    { icon: 'banknote', title: 'Cash on Delivery', text: 'Pay when you receive' },
  ];
  settings.about = { title: 'Little treats. Big moments.', body: 'We bring together delicious chocolates, carefully selected nuts and naturally sweet dates for everyday treats and thoughtful gifts. Every order is packed with care and delivered right to your door.' };
  settings.seo = { ...settings.seo, title: 'ESR Choco BD — Premium Chocolate, Nuts & Dates in Bangladesh', description: 'Shop premium chocolates, almonds, cashews, pistachios and dates online in Bangladesh. Fresh picks, secure ordering and Cash on Delivery.', keywords: 'chocolate online Bangladesh, almonds, cashew nuts, dates, premium snacks, dry fruits Bangladesh' };
  await saveSettings(settings);
  console.log('Settings ready.');
}

// ==============================
// MAIN
// ==============================

async function run() {
  try {
    await connectDB();

    console.log('Starting ESR Choco BD seed...');

    const categoryMap = await seedCategories();

    await seedProducts(categoryMap);
    await seedSettings();
    await seedAdmin();

    console.log('ESR Choco BD seed completed successfully.');
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});