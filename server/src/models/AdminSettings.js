import mongoose from 'mongoose';
import { deepMerge } from '../utils/helpers.js';

// Single-document store for everything the owner edits without touching code.
const schema = new mongoose.Schema(
  { key: { type: String, default: 'main', unique: true }, data: { type: mongoose.Schema.Types.Mixed, default: {} } },
  { timestamps: true, minimize: false }
);
const AdminSettings = mongoose.model('AdminSettings', schema);

export const DEFAULT_SETTINGS = {
  brand: {
    name: 'ESR Choco BD',
    nameBn: 'ইএসআর চকো বিডি',
    tagline: 'Premium Chocolate, Coffee & Gift Items — delivered across Bangladesh',
    logo: '',
  },
  announcement: {
    active: true,
    text: '🍫 Premium chocolates · 🌰 Handpicked nuts · 🌴 Naturally sweet dates · Cash on Delivery available',
    link: '/shop',
  },
  banners: [
    { title: 'A Little More Chocolate in Every Day', subtitle: 'Discover rich chocolate treats, carefully selected nuts and naturally sweet dates.', ctaText: 'Explore Collection', ctaLink: '/shop', image: '', theme: 'earth', active: true },
    { title: 'Nuts That Make Every Bite Better', subtitle: 'Almonds, cashews, pistachios and more — selected for freshness and crunch.', ctaText: 'Shop Nuts', ctaLink: '/shop?category=premium-nuts', image: '', theme: 'honey', active: true },
    { title: 'Naturally Sweet. Simply Delicious.', subtitle: 'Premium dates for everyday snacking, gifting and special moments.', ctaText: 'Shop Dates', ctaLink: '/shop?category=premium-dates', image: '', theme: 'leaf', active: true },
  ],
  contact: {
    phones: ['01700-000000'],
    whatsapp: '8801700000000', // international format, no +
    messengerUsername: 'yourpage', // m.me/<username>
    email: '',
    address: 'House 12, Road 5, Mirpur-10, Dhaka-1216, Bangladesh',
    mapUrl: 'https://maps.google.com/?q=Mirpur+10+Dhaka',
    hours: 'Saturday – Thursday: 9:00 AM – 9:00 PM',
    hoursNote: 'Friday: Online orders only',
  },
  social: {
    facebookPageUrl: 'https://www.facebook.com/yourpage',
    facebookReviewsUrl: 'https://www.facebook.com/yourpage/reviews',
    instagram: '',
    youtube: '',
    tiktok: '',
  },
  shipping: {
    insideDhaka: 60,
    outsideDhaka: 120,
    weightBased: false,
    baseWeightKg: 2,
    extraPerKg: 20,
    freeShippingThreshold: 0,
    note: 'Dhaka: 1–2 days · Other districts: 2–4 days via courier',
  },
  payment: {
    cod: { enabled: true },
    bkash: { enabled: false, number: '', instructions: 'Send Money to the bKash Personal number above, then enter the TrxID.' },
    nagad: { enabled: false, number: '', instructions: 'Send Money to the Nagad Personal number above, then enter the TrxID.' },
    sslcommerz: { enabled: false },
  },
  sms: { enabled: false, notifyOnStatus: true, adminPhone: '' },
  trustBadges: [
    { icon: 'leaf', title: 'Carefully Selected', text: 'Thoughtful product selection' },
    { icon: 'truck', title: 'Nationwide Delivery', text: 'Delivery across Bangladesh' },
    { icon: 'shield', title: 'Packed with Care', text: 'Every order handled with care' },
    { icon: 'banknote', title: 'Cash on Delivery', text: 'Pay when you receive' },
  ],
  facebookReviews: [], // owner pastes real customer feedback from the Facebook page here
  about: {
    title: 'Little treats. Big moments.',
    body: 'We bring together delicious chocolates, carefully selected nuts and naturally sweet dates for everyday treats and thoughtful gifts. Every order is packed with care and delivered right to your door.',
  },
  seo: {
    title: 'ESR Choco BD — Premium Chocolate, Nuts & Dates in Bangladesh',
    description: 'Shop premium chocolates, almonds, cashews, pistachios and dates online in Bangladesh. Fresh picks, secure ordering and Cash on Delivery.',
    ogImage: '',
    keywords: 'chocolate online Bangladesh, almonds, cashew nuts, dates, premium snacks, dry fruits Bangladesh',
  },
};

export async function getSettings() {
  const doc = await AdminSettings.findOne({ key: 'main' }).lean();
  return deepMerge(DEFAULT_SETTINGS, doc?.data || {});
}

export async function saveSettings(data) {
  await AdminSettings.findOneAndUpdate({ key: 'main' }, { data }, { upsert: true, new: true, setDefaultsOnInsert: true });
  return data;
}

// Strip private fields before sending to the public storefront
export const publicSettings = (s) => ({ ...s, sms: { enabled: s.sms.enabled } });

export default AdminSettings;
