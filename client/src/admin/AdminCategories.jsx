import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Tags, Eye, EyeOff, Loader2, Save, X } from 'lucide-react';
import { api } from '../lib/api';
import { useSettings } from '../context/SettingsContext';

const blank = {
  name: '', nameBn: '', slug: '', icon: '🏷️',
  description: '', sortOrder: 0, isActive: true,
};

export default function AdminCategories() {
  const { refresh } = useSettings();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    try {
      setItems(await api.aget('/admin/categories'));
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function edit(category) {
    setEditing(category._id);
    setForm({
      name: category.name || '',
      nameBn: category.nameBn || '',
      slug: category.slug || '',
      icon: category.icon || '🏷️',
      description: category.description || '',
      sortOrder: category.sortOrder ?? 0,
      isActive: category.isActive !== false,
    });
    setError('');
    setMessage('');
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = { ...form, sortOrder: Number(form.sortOrder || 0) };
      if (editing === 'new') await api.apost('/categories', payload);
      else await api.aput('/categories/' + editing, payload);

      setEditing(null);
      setMessage('Category saved successfully.');
      await load();
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggle(category) {
    setError('');
    setMessage('');
    try {
      await api.aput('/categories/' + category._id, { isActive: !category.isActive });
      setMessage(category.isActive ? 'Category hidden from store.' : 'Category activated.');
      await load();
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(category) {
    if (!window.confirm(`Delete "${category.name}"?`)) return;
    setError('');
    setMessage('');
    try {
      await api.adel('/categories/' + category._id);
      setMessage('Category deleted.');
      await load();
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  const field = 'input mt-1 w-full';

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-leaf-700"><Tags size={18} /> Store organization</div>
          <h1 className="text-2xl font-bold text-earth-900">Categories</h1>
          <p className="mt-1 text-sm text-earth-500">Create and organize your store categories.</p>
        </div>
        <button className="btn-primary" onClick={() => {
          setEditing('new'); setForm(blank); setError(''); setMessage('');
        }}><Plus size={17} /> Add category</button>
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}

      {editing !== null && (
        <form onSubmit={save} className="card mb-6 space-y-4 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">{editing === 'new' ? 'New category' : 'Edit category'}</h2>
            <button type="button" className="btn-ghost !p-2" onClick={() => setEditing(null)}><X size={18} /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">Name *
              <input className={field} required maxLength={80} value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Coffee" />
            </label>
            <label className="text-sm font-medium">বাংলা নাম
              <input className={field} value={form.nameBn}
                onChange={e => setForm({ ...form, nameBn: e.target.value })} placeholder="কফি" />
            </label>
            <label className="text-sm font-medium">Slug (optional)
              <input className={field} value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="coffee" />
            </label>
            <label className="text-sm font-medium">Icon / Emoji
              <input className={field} value={form.icon}
                onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="☕" />
            </label>
            <label className="text-sm font-medium">Display order
              <input type="number" min="0" className={field} value={form.sortOrder}
                onChange={e => setForm({ ...form, sortOrder: e.target.value })} />
            </label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm">
              <input type="checkbox" checked={form.isActive}
                onChange={e => setForm({ ...form, isActive: e.target.checked })} />
              Visible in store
            </label>
            <label className="text-sm font-medium sm:col-span-2">Description
              <textarea className={field} rows={3} value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </label>
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-ghost flex-1" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving…' : 'Save category'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-12 text-center"><Loader2 className="mx-auto animate-spin" /></div>
      ) : items.length ? (
        <div className="space-y-3">
          {items.map(category => (
            <article key={category._id} className="card flex flex-wrap items-center gap-3 p-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-earth-50 text-2xl">{category.icon || '🏷️'}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{category.name}</h3>
                  <span className="text-xs text-earth-500">{category.isActive ? 'Active' : 'Hidden'}</span>
                </div>
                <p className="text-sm text-earth-500">{category.nameBn || category.slug} · Order {category.sortOrder ?? 0}</p>
                {category.description && <p className="mt-1 text-xs text-earth-500">{category.description}</p>}
              </div>
              <div className="flex gap-1">
                <button className="btn-ghost !p-2" title="Toggle visibility" onClick={() => toggle(category)}>
                  {category.isActive ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
                <button className="btn-ghost !p-2" title="Edit" onClick={() => edit(category)}><Pencil size={17} /></button>
                <button className="btn-ghost !p-2 text-red-600" title="Delete" onClick={() => remove(category)}><Trash2 size={17} /></button>
              </div>
            </article>
          ))}
        </div>
      ) : <div className="card p-10 text-center text-sm text-earth-500">No categories found.</div>}
    </div>
  );
}
