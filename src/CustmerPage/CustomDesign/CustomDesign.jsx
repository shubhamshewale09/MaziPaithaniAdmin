import { useState } from 'react';
import { Upload, Send, Palette } from 'lucide-react';
import { showApiSuccess, showApiError } from '../../Utils/Utils';
import { submitCustomDesignRequest } from '../../ServiceCustmer/CustomDesign/CustomDesignApi';

const DESIGN_TYPES = ['Traditional', 'Bridal', 'Designer', 'Minimalist', 'Custom Motif'];
const COLOR_PREFS  = ['Red', 'Green', 'Blue', 'Purple', 'Gold', 'Pink', 'Maroon', 'Orange'];

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-sm font-semibold text-[#3d1e17] mb-1.5">
      {label} {required && <span className="text-[#7a1e2c]">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = 'w-full rounded-xl border border-[#e9d7cf] bg-white px-4 py-2.5 text-sm text-[#3d1e17] placeholder-[#b8a09a] outline-none focus:border-[#7a1e2c] focus:ring-1 focus:ring-[#7a1e2c] transition';

const CustomDesign = () => {
  const [form, setForm] = useState({
    designType: '', colorPrefs: [], budgetMin: '', budgetMax: '',
    timeline: '', notes: '', images: [],
  });
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const toggleColor = (c) =>
    set('colorPrefs', form.colorPrefs.includes(c)
      ? form.colorPrefs.filter((x) => x !== c)
      : [...form.colorPrefs, c]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.designType || !form.budgetMin || !form.timeline) {
      showApiError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      await submitCustomDesignRequest(form);
      showApiSuccess('Custom design request submitted successfully!');
      setForm({ designType: '', colorPrefs: [], budgetMin: '', budgetMax: '', timeline: '', notes: '', images: [] });
    } catch {
      showApiError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] text-white shadow-lg">
          <Palette size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#3d1e17]">Custom Design Request</h1>
          <p className="text-sm text-[#9b7b69] mt-0.5">Tell artisans exactly what you want</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Design Type */}
        <div className="rounded-[22px] border border-[#f0e4de] bg-white p-6 shadow-sm space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9b7b69]">Design Preferences</p>

          <Field label="Design Type" required>
            <select
              value={form.designType}
              onChange={(e) => set('designType', e.target.value)}
              className={inputCls}
            >
              <option value="">Select design type</option>
              {DESIGN_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>

          <Field label="Color Preferences">
            <div className="flex flex-wrap gap-2 mt-1">
              {COLOR_PREFS.map((c) => (
                <button
                  key={c} type="button"
                  onClick={() => toggleColor(c)}
                  className={[
                    'rounded-xl border px-3 py-1.5 text-xs font-medium transition',
                    form.colorPrefs.includes(c)
                      ? 'border-[#7a1e2c] bg-[#7a1e2c] text-white'
                      : 'border-[#e9d7cf] bg-white text-[#6a4a42] hover:border-[#7a1e2c]',
                  ].join(' ')}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* Budget & Timeline */}
        <div className="rounded-[22px] border border-[#f0e4de] bg-white p-6 shadow-sm space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9b7b69]">Budget & Timeline</p>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Min Budget (₹)" required>
              <input
                type="number" placeholder="e.g. 10000"
                value={form.budgetMin}
                onChange={(e) => set('budgetMin', e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Max Budget (₹)">
              <input
                type="number" placeholder="e.g. 25000"
                value={form.budgetMax}
                onChange={(e) => set('budgetMax', e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Delivery Timeline" required>
            <select
              value={form.timeline}
              onChange={(e) => set('timeline', e.target.value)}
              className={inputCls}
            >
              <option value="">Select timeline</option>
              <option value="1month">Within 1 Month</option>
              <option value="2months">1–2 Months</option>
              <option value="3months">2–3 Months</option>
              <option value="flexible">Flexible</option>
            </select>
          </Field>
        </div>

        {/* Notes & Images */}
        <div className="rounded-[22px] border border-[#f0e4de] bg-white p-6 shadow-sm space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9b7b69]">Additional Details</p>

          <Field label="Additional Notes">
            <textarea
              rows={4}
              placeholder="Describe your design vision, special requirements, occasion..."
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Upload Reference Images">
            <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#e9d7cf] bg-[#fff8f3] p-8 cursor-pointer transition hover:border-[#7a1e2c]">
              <Upload size={24} className="text-[#9b7b69]" />
              <div className="text-center">
                <p className="text-sm font-medium text-[#3d1e17]">Click to upload images</p>
                <p className="text-xs text-[#9b7b69] mt-1">PNG, JPG up to 5MB each</p>
              </div>
              <input type="file" multiple accept="image/*" className="hidden"
                onChange={(e) => set('images', Array.from(e.target.files))} />
            </label>
            {form.images.length > 0 && (
              <p className="text-xs text-[#7a1e2c] mt-2 font-medium">{form.images.length} file(s) selected</p>
            )}
          </Field>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7a1e2c] to-[#a52b39] py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
        >
          <Send size={16} />
          {loading ? 'Submitting...' : 'Submit Custom Design Request'}
        </button>
      </form>
    </div>
  );
};

export default CustomDesign;
