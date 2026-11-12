import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, Menu, X, Phone, Home, Store, PackageSearch, MapPin, Mail, Clock, Facebook, MessageCircle,
  PackageCheck, Truck, ShieldCheck, Banknote, Instagram, Youtube, ExternalLink,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import { assetUrl } from '../lib/api';

const telHref = (n) => `tel:${String(n).replace(/[^\d+]/g, '')}`;

function AnnouncementBar() {
  const { settings } = useSettings();
  const a = settings.announcement;
  if (!a?.active || !a.text) return null;
  const inner = <span className="mx-8 whitespace-nowrap">{a.text}</span>;
  const content = (
    <div className="overflow-hidden bg-earth-900 py-1.5 text-xs font-medium text-leaf-50 sm:text-sm">
      <div className="flex w-max animate-marquee sm:animate-none sm:w-full sm:justify-center">
        {inner}
        <span className="sm:hidden">{inner}</span>
        <span className="sm:hidden">{inner}</span>
        <span className="sm:hidden">{inner}</span>
      </div>
    </div>
  );
  return a.link ? <Link to={a.link}>{content}</Link> : content;
}

function Logo() {
  const { settings } = useSettings();
  const b = settings.brand;

  return (
    <Link to="/" aria-label="ESR Choco BD Home" className="flex shrink-0 items-center">
      <img
        src={b.logo ? assetUrl(b.logo) : "/esr-choco-bd-logo.png"}
        alt="ESR Choco BD — Premium Chocolates, Nuts & Dates"
        className="h-11 w-auto max-w-[170px] object-contain sm:h-12 sm:max-w-[200px]"
        width="300"
        height="200"
      />
    </Link>
  );
}

function SearchBox({ className = '', onDone }) {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  return (
    <form
      className={`relative ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        nav(`/shop${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
        onDone?.();
      }}
      role="search"
    >
      <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
      <input value={q} onChange={(e) => setQ(e.target.value)} className="input !rounded-full !py-2 pl-10" placeholder="Search chocolate, coffee, nuts, dates, gifts…" aria-label="Search products" />
    </form>
  );
}

function Header() {
  const { settings, categories } = useSettings();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const phone = settings.contact.phones?.[0];
  const link = ({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-leaf-50 text-leaf-700' : 'text-earth-700 hover:bg-earth-50'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-earth-100 bg-white/95 backdrop-blur">
      <div className="container-x flex items-center gap-3 py-2.5">
        <button className="rounded-lg p-2 text-earth-700 hover:bg-earth-50 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <Logo />
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/shop" end className={link}>All Products</NavLink>
          {categories.map((c) => (
            <NavLink key={c._id} to={`/shop?category=${c.slug}`} className={() => 'rounded-lg px-3 py-2 text-sm font-semibold text-earth-700 hover:bg-earth-50'}>
              {c.icon} {c.name}
            </NavLink>
          ))}
        </nav>
        <SearchBox className="ml-auto hidden max-w-xs flex-1 md:block" />
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {phone && (
            <a href={telHref(phone)} className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-leaf-700 hover:bg-leaf-50 sm:flex">
              <Phone size={16} /> {phone}
            </a>
          )}
          <Link to="/cart" className="relative rounded-xl p-2.5 text-leaf-800 hover:bg-leaf-50" aria-label={`Cart, ${count} items`}>
            <ShoppingCart size={22} />
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-honey-500 px-1 text-[11px] font-bold text-white">{count}</span>}
          </Link>
        </div>
      </div>
      <div className="container-x pb-2.5 md:hidden">
        <SearchBox />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full max-h-[100dvh] w-72 max-w-[85%] flex-col overflow-y-auto overscroll-contain bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-earth-50" aria-label="Close menu"><X size={20} /></button>
            </div>
            <nav className="flex flex-col gap-1" onClick={() => setOpen(false)}>
              <NavLink to="/" end className={link}>🏠 Home</NavLink>
              <NavLink to="/shop" end className={link}>🛍️ All Products</NavLink>
              {categories.map((c) => (
                <Link key={c._id} to={`/shop?category=${c.slug}`} className="rounded-lg px-3 py-2 text-sm font-semibold text-earth-700 hover:bg-earth-50">
                  {c.icon} {c.name} <span className="text-earth-400">· {c.nameBn}</span>
                </Link>
              ))}
              <NavLink to="/track" className={link}>📦 Track Order</NavLink>
            </nav>
            <div className="mt-auto space-y-2 border-t border-earth-100 pt-4">
              {phone && <a href={telHref(phone)} className="btn-primary w-full"><Phone size={16} /> Call {phone}</a>}
              {settings.contact.whatsapp && <a href={`https://wa.me/${settings.contact.whatsapp}`} target="_blank" rel="noreferrer" className="btn w-full bg-[#25D366] text-white"><MessageCircle size={16} /> Message us on WhatsApp</a>}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}

const ICONS = { leaf: PackageCheck, package: PackageCheck, truck: Truck, shield: ShieldCheck, banknote: Banknote };

function Footer() {
  const { settings, categories } = useSettings();
  const { brand, contact, social, trustBadges } = settings;
  const wa = contact.whatsapp && `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Hello ${brand.name}, I'd like to know more about your products.`)}`;
  return (
    <footer className="mt-16 bg-[#26130f] text-[#eadbd0]">
      <div className="border-b border-white/10">
        <div className="container-x grid grid-cols-2 gap-4 py-6 lg:grid-cols-4">
          {trustBadges.map((t) => {
            const Icon = ICONS[t.icon] || ShieldCheck;
            return (
              <div key={t.title} className="flex items-start gap-3">
                <span className="rounded-xl bg-white/10 p-2.5 text-[#d8ad7c]"><Icon size={20} /></span>
                <div><p className="text-sm font-semibold text-white">{t.title}</p><p className="text-xs text-[#c5ad9c]">{t.text}</p></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container-x grid gap-9 py-11 sm:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_1fr_1fr]">
        <div>
          <img src={brand.logo ? assetUrl(brand.logo) : "/esr-choco-bd-logo.png"} alt="ESR Choco BD" className="h-14 w-auto max-w-[210px] object-contain object-left" width="300" height="200" />
          {brand.nameBn && <p className="mt-2 text-sm text-[#d8ad7c]">{brand.nameBn}</p>}
          <p className="mt-3 max-w-sm text-sm leading-7 text-[#c5ad9c]">Premium chocolates, specialty coffee, carefully selected nuts, dates and thoughtful gifts for every occasion.</p>
          {wa && <a href={wa} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-bold text-white transition hover:bg-[#1eae54]"><MessageCircle size={17} /> Chat on WhatsApp</a>}
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#d8ad7c]">Explore</h3>
          <ul className="space-y-3 text-sm text-[#e2d1c4]">
            <li><Link to="/shop" className="hover:text-white">All products</Link></li>
            {categories.map((c) => <li key={c._id}><Link to={`/shop?category=${c.slug}`} className="hover:text-white">{c.icon} {c.name}</Link></li>)}
            <li><Link to="/track" className="hover:text-white">Track an order</Link></li>
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#d8ad7c]">Get in touch</h3>
          {contact.phones?.map((p) => <p key={p} className="flex items-center gap-2"><Phone size={15} className="text-[#d8ad7c]" /><a href={telHref(p)} className="hover:text-white">{p}</a></p>)}
          {contact.email && <p className="flex items-center gap-2 break-all"><Mail size={15} className="text-[#d8ad7c]" /><a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a></p>}
          {contact.address && <p className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 text-[#d8ad7c]" /><span>{contact.address} {contact.mapUrl && <a href={contact.mapUrl} target="_blank" rel="noreferrer" className="underline">Map</a>}</span></p>}
          {social.facebookPageUrl && <a href={social.facebookPageUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm text-[#d8ad7c] hover:text-white"><Facebook size={16} /> Facebook Page</a>}
          {contact.messengerUsername?.trim() && <a href={`https://m.me/${contact.messengerUsername.trim().replace(/^@/, '')}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm text-[#d8ad7c] hover:text-white"><MessageCircle size={16} /> Message on Messenger</a>}
        </div>

        <div className="text-sm">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#d8ad7c]">Delivery & payment</h3>
          {contact.hours && <p className="mb-3 flex gap-2"><Clock size={15} className="mt-0.5 shrink-0 text-[#d8ad7c]" /><span>{contact.hours}{contact.hoursNote ? ` · ${contact.hoursNote}` : ''}</span></p>}
          <p className="leading-6 text-[#c5ad9c]">{settings.shipping.note || 'Delivery available across Bangladesh.'}</p>
          <p className="mt-4 text-xs text-[#b49b89]">Cash on Delivery · bKash · Nagad · Online payment options</p>
          <div className="mt-4 flex gap-2">
            {[[social.instagram, Instagram, 'Instagram'], [social.youtube, Youtube, 'YouTube']].filter(([u]) => u).map(([u, Icon, n]) => <a key={n} href={u} target="_blank" rel="noreferrer" aria-label={n} className="rounded-xl bg-white/10 p-2.5 hover:bg-white/20"><Icon size={18} /></a>)}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-[#b49b89]">© {new Date().getFullYear()} {brand.name}. All rights reserved.</div>
    </footer>
  );
}

function FloatingChat() {
  const { settings } = useSettings();
  const { contact, brand } = settings;
  const wa = contact.whatsapp && `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Hello ${brand.name}, I need help with an order.`)}`;
  if (!wa) return null;
  return (
    <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-3 z-30 md:bottom-6 md:right-5">
      <a href={wa} target="_blank" rel="noreferrer" aria-label="Message us on WhatsApp" className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_32px_-8px_rgba(37,211,102,.65)] transition hover:scale-105">
        <MessageCircle size={25} />
      </a>
    </div>
  );
}

function BottomNav() {
  const { count } = useCart();
  const { settings } = useSettings();
  const phone = settings.contact.phones?.[0];
  const item = ({ isActive }) => `relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${isActive ? 'text-leaf-700' : 'text-earth-500'}`;
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 flex min-h-16 border-t border-earth-100 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.04)] backdrop-blur md:hidden" aria-label="Quick navigation">
      <NavLink to="/" end className={item}><Home size={20} />Home</NavLink>
      <NavLink to="/shop" className={item}><Store size={20} />Shop</NavLink>
      <NavLink to="/cart" className={item}>
        <span className="relative"><ShoppingCart size={20} />{count > 0 && <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-honey-500 px-1 text-[10px] font-bold text-white">{count}</span>}</span>
        Cart
      </NavLink>
      <NavLink to="/track" className={item}><PackageSearch size={20} />Track</NavLink>
      {phone && <a href={telHref(phone)} className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-earth-500"><Phone size={20} />Call</a>}
    </nav>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="min-w-0 flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <FloatingChat />
      <BottomNav />
    </div>
  );
}
