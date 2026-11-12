import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, Bell } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { money } from '../lib/format';
import { ProductImage, ProductBadges, Stars } from './ui';

export default function ProductCard({ p }) {
  const { add } = useCart();
  const nav = useNavigate();
  const sellable = p.purchasable;
  const pre = p.availability === 'preorder';
  const blockedLabel = { out_of_stock: 'Out of stock', coming_soon: 'Coming soon', out_of_season: 'Unavailable' }[p.availability] || 'Unavailable';

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#eaded4] bg-white shadow-[0_8px_28px_-20px_rgba(50,27,21,.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_-25px_rgba(50,27,21,.42)]">
      <Link to={`/product/${p.slug}`} className="relative block overflow-hidden bg-[#f6eee7]">
        <ProductImage
          src={p.images?.[0]}
          alt={p.name}
          category={p.category?.slug}
          className={`aspect-square w-full object-cover transition duration-700 group-hover:scale-[1.045] ${sellable ? '' : 'grayscale-[.45]'}`}
        />
        <div className="absolute left-2 top-2 max-w-[78%]">
          <ProductBadges p={p} compact />
        </div>
        {p.discountPercent > 0 && sellable && (
          <span className="absolute right-2 top-2 rounded-full bg-[#8f3328] px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow">SAVE {p.discountPercent}%</span>
        )}
        {!sellable && <span className="absolute inset-x-0 bottom-0 bg-[#321b15]/85 py-2 text-center text-xs font-semibold text-white">{blockedLabel}</span>}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        {p.brand && <p className="mb-1 line-clamp-1 text-[10px] font-bold uppercase tracking-[.16em] text-[#9b765e]">{p.brand}</p>}
        <Link to={`/product/${p.slug}`} className="line-clamp-2 min-h-[2.7rem] font-display text-[15px] font-semibold leading-snug text-[#321b15] transition hover:text-[#8a573b] sm:text-base">
          {p.name}
        </Link>
        {p.nameBn && <p className="mt-1 line-clamp-1 text-xs text-[#987e6d]">{p.nameBn}</p>}
        <div className="mt-2"><Stars value={p.ratingAvg} count={p.ratingCount} size={12} /></div>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-lg font-bold text-[#6c3c29]">{money(p.price)}</span>
          {p.comparePrice > p.price && <span className="text-xs text-[#a58f80] line-through">{money(p.comparePrice)}</span>}
          {p.unit && <span className="text-[11px] text-[#9b877a]">/ {p.unit}</span>}
        </div>

        <div className="mt-auto grid grid-cols-[1fr_1.25fr] gap-2 pt-4">
          {sellable ? (
            <>
              <button onClick={() => add(p, 1)} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl border border-[#9b765e]/35 px-2 text-xs font-bold text-[#70412e] transition hover:bg-[#f8f0e9]" aria-label={`Add ${p.name} to cart`}>
                <ShoppingBag size={15} /> Add
              </button>
              <button
                onClick={() => { add(p, 1, { silent: true }); nav('/checkout'); }}
                className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl bg-[#321b15] px-2 text-xs font-bold text-white transition hover:bg-[#70412e]"
              >
                <Zap size={14} /> {pre ? 'Pre-order' : 'Buy now'}
              </button>
            </>
          ) : (
            <Link to={`/product/${p.slug}`} className="col-span-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#f1e8e0] text-xs font-semibold text-[#795b49]">
              <Bell size={14} /> {blockedLabel} · Details
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ items = [] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => <ProductCard key={p._id} p={p} />)}
    </div>
  );
}
