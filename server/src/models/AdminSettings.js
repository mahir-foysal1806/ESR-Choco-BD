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
    tagline: 'Premium Chocolate · Coffee · Nuts · Dates · Gifts',
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
    phones: ['01722-931841'],
    whatsapp: '8801722931841', // international format, no +
    messengerUsername: '',
    email: 'shamimhossain0502@gmail.com',
    address: '',
    mapUrl: '',
    hours: '',
    hoursNote: '',
  },
  social: {
    facebookPageUrl: 'https://www.facebook.com/esr.choco.bd?mibextid=ZbWKwL',
    facebookReviewsUrl: '',
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
    title: 'ESR Choco BD — Premium Chocolate, Coffee, Nuts & Gifts',
    description: 'Shop premium chocolates, specialty coffee, nuts, dates and gift boxes online in Bangladesh. Secure ordering and delivery across Bangladesh.',
    ogImage: '',
    keywords: 'chocolate online Bangladesh, coffee, premium nuts, dates, gift boxes, chocolate gifts',
  },
};

export async function getSettings() {
  const doc = await AdminSettings.findOne({ key: 'main' }).lean();
  const settings = deepMerge(DEFAULT_SETTINGS, doc?.data || {});
  // Replace only the starter-template placeholders; preserve owner-entered custom values.
  if (settings.contact?.phones?.some((p) => /01700-000000/.test(String(p)))) settings.contact.phones = ['01722-931841'];
  if (settings.contact?.whatsapp === '8801700000000') settings.contact.whatsapp = '8801722931841';
  if (settings.contact?.messengerUsername === 'yourpage') settings.contact.messengerUsername = '';
  if (settings.contact?.email === 'hello@cocoacrunch.com') settings.contact.email = 'shamimhossain0502@gmail.com';
  if (String(settings.contact?.address || '').includes('House 12, Road 5, Mirpur-10')) settings.contact.address = '';
  if (String(settings.contact?.mapUrl || '').includes('Mirpur+10+Dhaka')) settings.contact.mapUrl = '';
  if (String(settings.social?.facebookPageUrl || '').includes('/yourpage')) settings.social.facebookPageUrl = 'https://www.facebook.com/esr.choco.bd?mibextid=ZbWKwL';
  if (String(settings.social?.facebookReviewsUrl || '').includes('/yourpage')) settings.social.facebookReviewsUrl = '';
  if (/farm|agricultur|fresh|mango|honey|Premium Chocolate, Nuts & Dates in Bangladesh/i.test(`${settings.brand?.tagline || ''} ${settings.seo?.title || ''} ${settings.seo?.description || ''}`)) {
    settings.brand.tagline = 'Premium Chocolate · Coffee · Nuts · Dates · Gifts';
    settings.seo.title = 'ESR Choco BD — Premium Chocolate, Coffee, Nuts & Gifts';
    settings.seo.description = 'Shop premium chocolates, specialty coffee, nuts, dates and gift boxes online in Bangladesh. Secure ordering and delivery across Bangladesh.';
    settings.seo.keywords = 'chocolate online Bangladesh, coffee, premium nuts, dates, gift boxes, chocolate gifts';
  }
  if (/farm|agricultur|mango|honey|fresh/i.test(settings.announcement?.text || '')) {
    settings.announcement = { ...settings.announcement, active: true, text: '🍫 Premium chocolates · ☕ Specialty coffee · 🌰 Premium nuts · 🎁 Thoughtful gifts', link: '/shop' };
  }
  if ((settings.trustBadges || []).some((item) => /farm|agricultur|fresh|organic|pure honey/i.test(`${item.title || ''} ${item.text || ''}`))) {
    settings.trustBadges = DEFAULT_SETTINGS.trustBadges;
  }
  const banners = (settings.banners || []).filter((item) =>
    !/farm|agricultur|mango|honey|fruit|harvest|fresh/i.test(`${item.title || ''} ${item.subtitle || ''}`)
  );
  if (banners.length !== (settings.banners || []).length) settings.banners = banners.length ? banners : DEFAULT_SETTINGS.banners;
  if (/farm|agricultur|mango|honey|fresh/i.test(`${settings.about?.title || ''} ${settings.about?.body || ''}`)) {
    settings.about = DEFAULT_SETTINGS.about;
  }
  return settings;
}

export async function saveSettings(data) {
  await AdminSettings.findOneAndUpdate({ key: 'main' }, { data }, { upsert: true, new: true, setDefaultsOnInsert: true });
  return data;
}

// Strip private fields before sending to the public storefront
export const publicSettings = (s) => ({ ...s, sms: { enabled: s.sms.enabled } });

export default AdminSettings;
