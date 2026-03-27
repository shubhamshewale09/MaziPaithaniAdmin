import { useState } from 'react';
import { Palette, Send, Upload } from 'lucide-react';

import { showApiError, showApiSuccess } from '../../Utils/Utils';
import { submitCustomDesignRequest } from '../../ServiceCustmer/CustomDesign/CustomDesignApi';

const DESIGN_TYPES = ['Bridal', 'Traditional', 'Designer', 'Minimal', 'Temple motif'];
const COLOR_PREFS = ['Maroon', 'Green', 'Pink', 'Purple', 'Gold', 'Blue'];

const inputClassName =
  'w-full rounded-[18px] border border-[#ead9cf] bg-[#fffaf6] px-4 py-3 text-sm text-[#34160f] outline-none transition focus:border-[#7a1e2c]';

const Field = ({ label, required, children }) => (
  <div>
    <label className='mb-2 block text-sm font-semibold text-[#34160f]'>
      {label} {required ? <span className='text-[#7a1e2c]'>*</span> : null}
    </label>
    {children}
  </div>
);

const CustomDesign = () => {
  const [form, setForm] = useState({
    designType: '',
    colorPrefs: [],
    budgetMin: '',
    budgetMax: '',
    timeline: '',
    notes: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  const toggleColor = (value) => {
    updateField(
      'colorPrefs',
      form.colorPrefs.includes(value)
        ? form.colorPrefs.filter((item) => item !== value)
        : [...form.colorPrefs, value],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.designType || !form.budgetMin || !form.timeline) {
      showApiError('Please fill all required fields.');
      return;
    }

    setLoading(true);

    try {
      await submitCustomDesignRequest(form);
      showApiSuccess('Custom design request submitted successfully.');
      setForm({
        designType: '',
        colorPrefs: [],
        budgetMin: '',
        budgetMax: '',
        timeline: '',
        notes: '',
        images: [],
      });
    } catch (error) {
      showApiError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <section className='rounded-[32px] border border-[#efdcd2] bg-gradient-to-br from-[#5a1220] via-[#7a1e2c] to-[#2f0c12] p-6 text-white shadow-[0_28px_80px_rgba(66,18,28,0.22)] sm:p-8'>
        <div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-2xl'>
            <p className='text-xs font-semibold uppercase tracking-[0.3em] text-[#f5d47c]'>
              Custom Request
            </p>
            <h1 className='mt-3 text-3xl font-bold sm:text-4xl'>
              Design a Paithani that matches your occasion.
            </h1>
            <p className='mt-4 text-sm leading-7 text-white/75'>
              Share your colors, motif idea, budget, and delivery need. This page
              is now shaped for the customer journey instead of an admin form.
            </p>
          </div>

          <div className='rounded-[24px] bg-white/10 p-5 backdrop-blur-sm'>
            <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5d47c] text-[#5a1220]'>
              <Palette size={24} />
            </div>
            <p className='mt-4 text-sm font-semibold'>Popular requests</p>
            <p className='mt-1 text-sm text-white/70'>Wedding tones, peacock pallu, blouse pairing</p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className='grid gap-6 xl:grid-cols-[1fr_340px]'>
        <div className='space-y-6'>
          <section className='rounded-[30px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
              Design preferences
            </p>
            <div className='mt-5 grid gap-5 md:grid-cols-2'>
              <Field label='Design type' required>
                <select
                  value={form.designType}
                  onChange={(event) => updateField('designType', event.target.value)}
                  className={inputClassName}
                >
                  <option value=''>Select a design</option>
                  {DESIGN_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label='Preferred timeline' required>
                <select
                  value={form.timeline}
                  onChange={(event) => updateField('timeline', event.target.value)}
                  className={inputClassName}
                >
                  <option value=''>Select a timeline</option>
                  <option value='within-1-month'>Within 1 month</option>
                  <option value='1-2-months'>1 to 2 months</option>
                  <option value='2-3-months'>2 to 3 months</option>
                  <option value='flexible'>Flexible</option>
                </select>
              </Field>
            </div>

            <div className='mt-5'>
              <Field label='Color preferences'>
                <div className='flex flex-wrap gap-2'>
                  {COLOR_PREFS.map((item) => (
                    <button
                      key={item}
                      type='button'
                      onClick={() => toggleColor(item)}
                      className={[
                        'rounded-full border px-4 py-2 text-sm font-semibold transition',
                        form.colorPrefs.includes(item)
                          ? 'border-[#7a1e2c] bg-[#7a1e2c] text-white'
                          : 'border-[#ead9cf] bg-[#fffaf6] text-[#6b5048]',
                      ].join(' ')}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </section>

          <section className='rounded-[30px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
              Budget details
            </p>
            <div className='mt-5 grid gap-5 md:grid-cols-2'>
              <Field label='Minimum budget' required>
                <input
                  type='number'
                  value={form.budgetMin}
                  onChange={(event) => updateField('budgetMin', event.target.value)}
                  placeholder='10000'
                  className={inputClassName}
                />
              </Field>

              <Field label='Maximum budget'>
                <input
                  type='number'
                  value={form.budgetMax}
                  onChange={(event) => updateField('budgetMax', event.target.value)}
                  placeholder='25000'
                  className={inputClassName}
                />
              </Field>
            </div>

            <div className='mt-5'>
              <Field label='Notes for the artisan'>
                <textarea
                  rows={5}
                  value={form.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                  placeholder='Tell us about motif ideas, wedding colors, blouse style, or any reference you have in mind.'
                  className={`${inputClassName} resize-none`}
                />
              </Field>
            </div>
          </section>
        </div>

        <div className='space-y-6'>
          <section className='rounded-[30px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
              Upload reference
            </p>
            <label className='mt-5 flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#e3cfc3] bg-[#fffaf6] px-6 py-10 text-center transition hover:border-[#7a1e2c]'>
              <Upload size={28} className='text-[#7a1e2c]' />
              <p className='mt-4 text-sm font-semibold text-[#34160f]'>
                Add inspiration images
              </p>
              <p className='mt-2 text-xs leading-6 text-[#8b6759]'>
                Upload blouse references, color cards, or motif screenshots.
              </p>
              <input
                type='file'
                multiple
                accept='image/*'
                className='hidden'
                onChange={(event) =>
                  updateField('images', Array.from(event.target.files || []))
                }
              />
            </label>

            {form.images.length > 0 ? (
              <p className='mt-4 text-sm font-semibold text-[#7a1e2c]'>
                {form.images.length} image(s) selected
              </p>
            ) : null}
          </section>

          <section className='rounded-[30px] border border-[#efdcd2] bg-[#fff6df] p-6 shadow-[0_18px_45px_rgba(94,35,23,0.06)]'>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#9b6a08]'>
              Before you submit
            </p>
            <ul className='mt-4 space-y-3 text-sm leading-7 text-[#6b5048]'>
              <li>Include your delivery timeline if the saree is for a wedding or event.</li>
              <li>Share at least one preferred color so the artisan can suggest matching zari work.</li>
              <li>Reference images make it much easier to quote accurately.</li>
            </ul>

            <button
              type='submit'
              disabled={loading}
              className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7a1e2c] px-5 py-3.5 text-sm font-bold text-white disabled:opacity-60'
            >
              <Send size={16} />
              {loading ? 'Submitting...' : 'Submit request'}
            </button>
          </section>
        </div>
      </form>
    </div>
  );
};

export default CustomDesign;
