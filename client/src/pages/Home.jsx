import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Gift, Heart, PackageCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import Seo from '../components/Seo';
import ProductCard, { ProductGrid } from '../components/ProductCard';
import { SectionHeader, ProductGridSkeleton } from '../components/ui';
import { useSettings } from '../context/SettingsContext';
import { useFetch } from '../lib/hooks';
import { api, assetUrl } from '../lib/api';

const CATEGORY_STYLE = [
  'from-[#f6e4d6] to-[#ead0bd]',
  'from-[#eee0c9] to-[#e0c49c]',
  'from-[#e7d8c8] to-[#d7bda4]',
  'from-[#f4e5d6] to-[#e8c8a9]',
  'from-[#e8d9d0] to-[#d5b6a5]',
];

function Hero() {
  const { settings } = useSettings();
  const banner = (settings.banners || []).find((b) =>
    b.active !== false && !/(farm|agricultur|mango|honey|fruit|harvest|fresh)/i.test(`${b.title || ''} ${b.subtitle || ''}`)
  );
  const title = banner?.title || 'A little luxury in every bite.';
  const subtitle = banner?.subtitle || 'Discover chocolates, specialty coffee, premium nuts, dates and thoughtful gifts — selected for moments worth sharing.';
  return (
    <section className="container-x pt-5 sm:pt-8">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#26130f] text-white shadow-[0_28px_80px_-35px_rgba(38,19,15,.7)]">
        {banner?.image && <img src={assetUrl(banner.image)} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35" />}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_45%,rgba(190,133,82,.34),transparent_33%),radial-gradient(circle_at_15%_0%,rgba(120,65,45,.45),transparent_38%)]" />
        <div className="absolute -right-24 -top-28 -z-10 h-80 w-80 rounded-full border border-[#d8aa76]/20" />
        <div className="absolute -right-10 -top-14 -z-10 h-56 w-56 rounded-full border border-[#d8aa76]/20" />
        <div className="grid min-h-[430px] items-center gap-8 px-6 py-12 sm:px-10 lg:grid-cols-[1.1fr_.9fr] lg:px-16 lg:py-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d7ad7c]/35 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[.24em] text-[#e8c69e]">
              <Sparkles size={14} /> ESR Choco BD · Curated treats
            </span>
            <h1 className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#eadbd0] sm:text-base">{subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={banner?.ctaLink || '/shop'} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#d8ad7c] px-6 text-sm font-bold text-[#26130f] transition hover:bg-[#edc99c]">
                {banner?.ctaText || 'Explore the collection'} <ArrowRight size={17} />
              </Link>
              <a href="#collections" className="inline-flex min-h-12 items-center rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition hover:bg-white/10">
                Browse categories
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#d9c5b5]">
              <span className="inline-flex items-center gap-2"><PackageCheck size={15} /> Carefully packed</span>
              <span className="inline-flex items-center gap-2"><Truck size={15} /> Delivery across Bangladesh</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck size={15} /> Easy order support</span>
            </div>
          </div>

          <div className="relative mx-auto hidden h-[320px] w-full max-w-[430px] lg:block" aria-hidden="true">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d8ad7c]/20 bg-[#8e5538]/10 shadow-[0_0_100px_rgba(216,173,124,.12)]" />
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#8e5538]/70 to-[#321b15]/30 blur-sm" />
            <div className="absolute left-[17%] top-[15%] rotate-[-12deg] rounded-2xl border border-[#f0d5b5]/25 bg-gradient-to-br from-[#6b3928] to-[#321b15] p-5 shadow-2xl">
              <div className="grid grid-cols-3 gap-1.5">
                {Array.from({ length: 9 }).map((_, i) => <span key={i} className="h-8 w-8 rounded-md border border-[#d5a879]/30 bg-gradient-to-br from-[#a66a47] to-[#542d20] shadow-inner" />)}
              </div>
            </div>
            <div className="absolute bottom-[13%] right-[8%] rotate-[9deg] rounded-2xl border border-[#f0d5b5]/30 bg-gradient-to-br from-[#e4c39e] to-[#9c6849] p-5 text-[#321b15] shadow-2xl">
              <Gift size={54} strokeWidth={1.2} />
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[.2em]">Made to share</p>
            </div>
            <div className="absolute right-[8%] top-[10%] flex h-20 w-20 items-center justify-center rounded-full border border-[#e8c69e]/30 bg-[#3b211a] text-[#e8c69e] shadow-xl">
              <Coffee size={34} strokeWidth={1.2} />
            </div>
            <div className="absolute bottom-[8%] left-[7%] flex h-16 w-16 items-center justify-center rounded-full bg-[#d8ad7c] text-[#321b15] shadow-xl">
              <Heart size={27} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#d8ad7c] to-transparent opacity-80" />
      </div>
    </section>
  );
}

function Collections() {
  const { categories } = useSettings();
  if (!categories.length) return null;
  return (
    <section id="collections" className="container-x pt-12 sm:pt-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.24em] text-[#986b4b]">Find your favourite</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-[#321b15] sm:text-4xl">Shop by collection</h2>
          <p className="mt-2 text-sm text-[#806b5e]">A thoughtful selection for everyday treats and special occasions.</p>
        </div>
        <Link to="/shop" className="hidden items-center gap-1 text-sm font-bold text-[#70412e] hover:underline sm:flex">All products <ArrowRight size={16} /></Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((c, i) => (
          <Link key={c._id} to={`/shop?category=${c.slug}`} className={`group relative min-h-36 overflow-hidden rounded-2xl border border-[#e9d9cb] bg-gradient-to-br ${CATEGORY_STYLE[i % CATEGORY_STYLE.length]} p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(50,27,21,.45)] sm:min-h-44 sm:p-5`}>
            <span className="text-4xl transition duration-300 group-hover:scale-110 sm:text-5xl">{c.icon || '🍫'}</span>
            <div className="absolute inset-x-4 bottom-4">
              <p className="font-display text-lg font-semibold text-[#321b15] sm:text-xl">{c.name}</p>
              {c.nameBn && <p className="mt-0.5 text-xs text-[#70412e]">{c.nameBn}</p>}
            </div>
            <ArrowRight className="absolute right-4 top-4 text-[#70412e] opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" size={18} />
          </Link>
        ))}
      </div>
    </section>
  );
}

function PromiseStrip() {
  const items = [
    [PackageCheck, 'Packed with care', 'Every order handled thoughtfully'],
    [Truck, 'Nationwide delivery', 'We deliver across Bangladesh'],
    [ShieldCheck, 'Personal support', 'Help when you need it'],
    [Heart, 'Made for gifting', 'Little moments, made special'],
  ];
  return (
    <section className="container-x pt-8 sm:pt-10">
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#eadbce] bg-white p-4 sm:grid-cols-4 sm:p-5">
        {items.map(([Icon, title, desc]) => (
          <div key={title} className="flex items-start gap-3">
            <span className="rounded-xl bg-[#f6eee7] p-2.5 text-[#80523b]"><Icon size={19} /></span>
            <div><p className="text-sm font-bold text-[#39231b]">{title}</p><p className="mt-0.5 text-xs leading-5 text-[#8b7669]">{desc}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { data, loading } = useFetch(() => api.get('/products/home'), []);

  return (
    <>
      <Seo title="Premium Chocolate, Coffee, Nuts & Gifts" description="Discover premium chocolates, specialty coffee, handpicked nuts, dates and thoughtful gift boxes from ESR Choco BD. Order online with delivery across Bangladesh." />
      <Hero />
      <PromiseStrip />
      <Collections />

      {loading && <section className="container-x pt-12"><ProductGridSkeleton n={4} /></section>}

      {data?.featured?.length > 0 && (
        <section className="container-x pt-14">
          <SectionHeader eyebrow="A little something special" title="Featured favourites" subtitle="A handpicked selection from the ESR Choco BD collection." to="/shop?featured=featured" />
          <ProductGrid items={data.featured.slice(0, 8)} />
        </section>
      )}

      {data?.newArrivals?.length > 0 && (
        <section className="container-x pt-14">
          <SectionHeader eyebrow="Just arrived" title="New in store" subtitle="Discover the latest additions to your treat shelf." to="/shop?featured=new" />
          <ProductGrid items={data.newArrivals.slice(0, 8)} />
        </section>
      )}

      {data?.offers?.length > 0 && (
        <section className="container-x pt-14">
          <div className="rounded-[2rem] border border-[#ead6c2] bg-gradient-to-br from-[#f7eee5] to-[#f1dfcf] p-4 sm:p-8">
            <SectionHeader eyebrow="Special selection" title="Offers worth opening" subtitle="A little extra reason to treat yourself or someone you love." to="/shop?featured=offer" />
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {data.offers.slice(0, 4).map((p) => <ProductCard key={p._id} p={p} />)}
            </div>
          </div>
        </section>
      )}

      {(data?.bestSellers?.length > 0 || data?.popular?.length > 0) && (
        <section className="container-x pt-14">
          <SectionHeader eyebrow="Loved by customers" title="Best sellers" subtitle="Popular picks to share, gift or enjoy yourself." to="/shop?featured=best-seller" />
          <ProductGrid items={(data.bestSellers?.length ? data.bestSellers : data.popular).slice(0, 8)} />
        </section>
      )}

      <section className="container-x py-14">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#321b15] px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-[#d8ad7c]/20" />
          <div className="relative max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[.24em] text-[#d8ad7c]">The ESR Choco BD experience</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">Thoughtful treats for every occasion.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#eadbd0]">Explore chocolates, coffee, premium nuts, dates and gifts selected for everyday indulgence and special moments.</p>
            <Link to="/shop" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#d8ad7c] px-6 text-sm font-bold text-[#321b15] transition hover:bg-[#edc99c]">Shop the collection <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
