import { useState } from 'react';
import { Star, Minus, Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../lib/api';
import { AVAILABILITY } from '../lib/format';

const PLACEHOLDER = {
  chocolates: { emoji: '🍫', cls: 'from-[#f1dfd2] to-[#c99a7d]' },
  coffee: { emoji: '☕', cls: 'from-[#e8d4c2] to-[#9a6b4c]' },
  'premium-nuts': { emoji: '🌰', cls: 'from-[#f1e5d1] to-[#c7a77e]' },
  'premium-dates': { emoji: '🌴', cls: 'from-[#ead7c2] to-[#b58a62]' },
  'gift-boxes': { emoji: '🎁', cls: 'from-[#f2e2d8] to-[#c58d79]' },
  'gift-items': { emoji: '🎁', cls: 'from-[#f2e2d8] to-[#c58d79]' },
};


export function ProductImage({
  src,
  alt,
  category,
  className = '',
  priority = false,
}) {
  const [failed, setFailed] = useState(false);
  const ph = PLACEHOLDER[category] || { emoji: '🍫', cls: 'from-[#f4e9df] to-[#d9b99f]' };
  if (!src || failed)
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br ${ph.cls} ${className}`} role="img" aria-label={alt}>
        <span className="text-5xl drop-shadow-sm sm:text-6xl">{ph.emoji}</span>
      </div>
    );
  return (
    <img
      src={assetUrl(src)}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

export function Stars({ value = 0, count, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-earth-500">
      <span className="inline-flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} size={size} className={n <= Math.round(value) ? 'fill-honey-400 text-honey-400' : 'fill-earth-100 text-earth-200'} />
        ))}
      </span>
      {count > 0 && <span>({count})</span>}
    </span>
  );
}

export function AvailabilityChip({ value }) {
  const a = AVAILABILITY[value] || AVAILABILITY.in_stock;
  return <span className={`chip ${a.cls}`}>{a.label}</span>;
}

// Trust + dynamic badges. Limited/Pre-order tags come from inventory counts automatically.
export function ProductBadges({ p, compact = false }) {
  const b = [];
  if (p.isBestSeller) b.push(['Best Seller', 'bg-honey-400 text-earth-900']);
  if (p.isNewArrival) b.push(['New Arrival', 'bg-sky-600 text-white']);
  if (p.isTodaysOffer) b.push(['Special Offer', 'bg-red-600 text-white']);
  if (p.isFeatured) b.push(['Featured', 'bg-leaf-600 text-white']);
  if (p.availability === 'limited') b.push([`Only ${p.stockQty} left`, 'bg-red-600 text-white']);
  if (p.availability === 'preorder') b.push(['Pre-Order', 'bg-sky-600 text-white']);

  return (
    <div className="flex flex-wrap gap-1">
      {(compact ? b.slice(0, 2) : b).map(([t, c]) => (
        <span key={t} className={`chip shadow-sm ${c}`}>{t}</span>
      ))}
    </div>
  );
}

export function QtyStepper({ value, onChange, max = 99 }) {
  return (
    <div className="inline-flex items-center rounded-xl border border-earth-200 bg-white">
      <button type="button" aria-label="Decrease" className="p-2.5 text-earth-700 disabled:opacity-30" disabled={value <= 1} onClick={() => onChange(value - 1)}>
        <Minus size={16} />
      </button>
      <span className="w-9 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button type="button" aria-label="Increase" className="p-2.5 text-earth-700 disabled:opacity-30" disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus size={16} />
      </button>
    </div>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, to, linkText = 'View all', icon: Icon }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#986b4b]">
            {Icon && <Icon size={14} />}
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold text-[#4a2b20] sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 max-w-xl text-sm text-earth-600">{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="flex shrink-0 items-center gap-0.5 text-sm font-semibold text-[#70412e] hover:underline">
          {linkText} <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-earth-100 ${className}`} />;
}

export function ProductGridSkeleton({ n = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <Skeleton className="aspect-square rounded-none" />
          <div className="space-y-2 p-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Empty({ icon = '🍫', title, text, children }) {
  return (
    <div className="card mx-auto max-w-md p-8 text-center">
      <div className="text-5xl">{icon}</div>
      <h3 className="mt-3 text-xl font-bold text-[#4a2b20]">{title}</h3>
      {text && <p className="mt-1 text-sm text-earth-600">{text}</p>}
      <div className="mt-4 flex justify-center gap-2">{children}</div>
    </div>
  );
}
