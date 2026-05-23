import { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Palette,
  Send,
  Upload,
  X,
} from 'lucide-react';

import { showApiError, showApiSuccess } from '../../Utils/Utils';
import { submitCustomDesignRequest } from '../../ServiceCustmer/CustomDesign/CustomDesignApi';

/* ─── constants ──────────────────────────────────────────────────────────── */
const DESIGN_TYPES = [
  'Bridal',
  'Traditional',
  'Designer',
  'Minimal',
  'Temple motif',
];

const COLOR_PREFS = ['Maroon', 'Green', 'Pink', 'Purple', 'Gold', 'Blue'];

const TIMELINE_OPTIONS = [
  { value: '30 Days', label: 'Within 1 month (30 Days)' },
  { value: '60 Days', label: '1 to 2 months (60 Days)' },
  { value: '90 Days', label: '2 to 3 months (90 Days)' },
  { value: 'Flexible', label: 'Flexible' },
];

const OCCASION_OPTIONS = [
  'Wedding',
  'Engagement',
  'Festival',
  'Birthday',
  'Anniversary',
  'Other',
];

/* ─── helpers ────────────────────────────────────────────────────────────── */
const inputCls =
  'w-full rounded-[18px] border border-[#ead9cf] bg-[#fffaf6] px-4 py-3 text-sm text-[#34160f] outline-none transition focus:border-[#7a1e2c] focus:ring-2 focus:ring-[#7a1e2c]/10';

/** Read logged-in customer id from localStorage */
const getCustomerId = () => {
  try {
    const d = JSON.parse(localStorage.getItem('login') || '{}');
    return d?.userId ?? d?.UserId ?? d?.iUserId ?? 0;
  } catch {
    return 0;
  }
};

const Field = ({ label, required, hint, children }) => (
  <div>
    <label className='mb-1.5 block text-sm font-semibold text-[#34160f]'>
      {label}{' '}
      {required && <span className='text-[#7a1e2c]'>*</span>}
    </label>
    {hint && <p className='mb-2 text-xs text-[#9b7b69]'>{hint}</p>}
    {children}
  </div>
);

/* ─── Success screen ─────────────────────────────────────────────────────── */
const SuccessScreen = ({ requestNumber, onReset, onViewRequests }) => (
  <div className='flex flex-col items-center justify-center rounded-[32px] border border-[#efdcd2] bg-white px-6 py-16 text-center shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
    <div className='flex h-20 w-20 items-center justify-center rounded-full bg-[#f0fdf4]'>
      <CheckCircle2 size={40} className='text-[#16a34a]' />
    </div>
    <h2 className='mt-6 text-2xl font-bold text-[#34160f]'>
      Request Submitted!
    </h2>
    <p className='mt-3 max-w-sm text-sm leading-7 text-[#6b5048]'>
      Your customization request has been sent to the seller. You will receive
      a quotation once they review your requirements.
    </p>
    {requestNumber && (
      <div className='mt-6 rounded-2xl border border-[#ead9cf] bg-[#fffaf6] px-6 py-4'>
        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[#a6806f]'>
          Request Number
        </p>
        <p className='mt-1 text-xl font-bold text-[#7a1e2c]'>{requestNumber}</p>
      </div>
    )}
    <div className='mt-8 flex flex-wrap justify-center gap-3'>
      <button
        type='button'
        onClick={onReset}
        className='rounded-full border border-[#ead9cf] bg-white px-6 py-3 text-sm font-semibold text-[#6b5048] transition hover:border-[#7a1e2c] hover:text-[#7a1e2c]'
      >
        Submit Another Request
      </button>
      {onViewRequests && (
        <button
          type='button'
          onClick={onViewRequests}
          className='rounded-full bg-[#7a1e2c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#651623]'
        >
          View My Requests
        </button>
      )}
    </div>
  </div>
);

/* ─── Main component ─────────────────────────────────────────────────────── */
const CustomDesign = ({ sellerId = 0, productId = 0, onViewRequests }) => {
  const [form, setForm] = useState({
    designType: '',
    occasion: '',
    colorPrefs: [],
    budgetMin: '',
    budgetMax: '',
    timeline: '',
    sareeLength: '',
    blouseRequired: false,
    notes: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestNumber, setRequestNumber] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleColor = (value) => {
    updateField(
      'colorPrefs',
      form.colorPrefs.includes(value)
        ? form.colorPrefs.filter((c) => c !== value)
        : [...form.colorPrefs, value],
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    updateField('images', files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    updateField('images', form.images.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.designType) {
      showApiError('Please select a design type.');
      return;
    }
    if (!form.timeline) {
      showApiError('Please select a preferred timeline.');
      return;
    }
    if (!form.budgetMin) {
      showApiError('Please enter your minimum budget.');
      return;
    }

    setLoading(true);
    try {
      /*
       * Build the payload that matches the API contract exactly.
       * POST /api/customization/submit  (multipart/form-data)
       *
       * Required fields:
       *   iCustomerId          – logged-in buyer id
       *   iSellerId            – seller id (passed as prop or 0)
       *   iProductId           – product id (passed as prop or 0)
       *   sCustomizationDetails – free-text description
       *   dMinBudget           – number
       *   dMaxBudget           – number
       *   sPreferredColors     – comma-separated string  e.g. "Maroon,Gold"
       *   sTimeline            – e.g. "30 Days"
       *
       * After insert the DB trigger auto-generates the CR number
       * and inserts a seller notification row.
       */
      const customerId = getCustomerId();

      // Build a human-readable customization details string from the form
      const detailParts = [
        form.designType && `Design: ${form.designType}`,
        form.occasion && `Occasion: ${form.occasion}`,
        form.sareeLength && `Length: ${form.sareeLength} yards`,
        form.blouseRequired && 'Blouse piece required',
        form.notes && `Notes: ${form.notes}`,
      ].filter(Boolean);

      const sCustomizationDetails =
        detailParts.join('. ') || form.designType;

      const sPreferredColors = form.colorPrefs.join(',');

      // Use FormData so image files can be attached
      const payload = new FormData();
      payload.append('iCustomerId', customerId);
      payload.append('iSellerId', sellerId);
      payload.append('iProductId', productId);
      payload.append('sCustomizationDetails', sCustomizationDetails);
      payload.append('dMinBudget', form.budgetMin);
      payload.append('dMaxBudget', form.budgetMax || form.budgetMin);
      payload.append('sPreferredColors', sPreferredColors);
      payload.append('sTimeline', form.timeline);

      // Attach reference images if any
      form.images.forEach((img) => payload.append('images', img));

      const res = await submitCustomDesignRequest(payload);

      /*
       * API response: { statusCode: 200, message: "...", requestId: 4, referenceImageUrl: null }
       * The DB trigger generates sCostReqNo automatically.
       * We show the requestId immediately; the CR number (e.g. CR000004) is
       * visible on the seller's /api/customization/list response.
       */
      const reqNum =
        res?.requestNumber ??
        res?.sRequestNumber ??
        res?.crNumber ??
        res?.data?.requestNumber ??
        (res?.requestId ? `Request #${res.requestId}` : null) ??
        `CR-${Date.now().toString().slice(-6)}`;

      setRequestNumber(reqNum);
      setSubmitted(true);
      showApiSuccess('Customization request submitted successfully!');
    } catch {
      showApiError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      designType: '',
      occasion: '',
      colorPrefs: [],
      budgetMin: '',
      budgetMax: '',
      timeline: '',
      sareeLength: '',
      blouseRequired: false,
      notes: '',
      images: [],
    });
    setImagePreviews([]);
    setSubmitted(false);
    setRequestNumber('');
  };

  return (
    <div className='space-y-6'>
      {/* ── Hero banner ── */}
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
              Share your colors, motif idea, budget, and delivery need. Fill
              the form below and a seller will send you a personalised
              quotation.
            </p>
          </div>

          <div className='rounded-[24px] bg-white/10 p-5 backdrop-blur-sm'>
            <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5d47c] text-[#5a1220]'>
              <Palette size={24} />
            </div>
            <p className='mt-4 text-sm font-semibold'>Popular requests</p>
            <p className='mt-1 text-sm text-white/70'>
              Wedding tones, peacock pallu, blouse pairing
            </p>
          </div>
        </div>

        {/* Flow steps */}
        <div className='mt-6 flex flex-wrap items-center gap-2 text-xs text-white/60'>
          {[
            'Fill form',
            'Upload images',
            'Seller reviews',
            'Get quotation',
            'Confirm order',
          ].map((step, i, arr) => (
            <span key={step} className='flex items-center gap-2'>
              <span className='rounded-full bg-white/15 px-3 py-1 font-semibold text-white/90'>
                {step}
              </span>
              {i < arr.length - 1 && <ChevronRight size={12} />}
            </span>
          ))}
        </div>
      </section>

      {/* ── Success or Form ── */}
      {submitted ? (
        <SuccessScreen requestNumber={requestNumber} onReset={handleReset} onViewRequests={onViewRequests} />
      ) : (
        <form
          onSubmit={handleSubmit}
          className='grid gap-6 lg:grid-cols-[1fr_320px]'
        >
          {/* ── Left column ── */}
          <div className='space-y-6'>
            {/* Design preferences */}
            <section className='rounded-[30px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
                Design Preferences
              </p>

              <div className='mt-5 grid gap-5 md:grid-cols-2'>
                <Field label='Design type' required>
                  <select
                    value={form.designType}
                    onChange={(e) => updateField('designType', e.target.value)}
                    className={inputCls}
                  >
                    <option value=''>Select a design</option>
                    {DESIGN_TYPES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label='Occasion'>
                  <select
                    value={form.occasion}
                    onChange={(e) => updateField('occasion', e.target.value)}
                    className={inputCls}
                  >
                    <option value=''>Select an occasion</option>
                    {OCCASION_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label='Preferred timeline' required>
                  <select
                    value={form.timeline}
                    onChange={(e) => updateField('timeline', e.target.value)}
                    className={inputCls}
                  >
                    <option value=''>Select a timeline</option>
                    {TIMELINE_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label='Saree length (yards)' hint='Standard is 5.5 yards'>
                  <input
                    type='number'
                    value={form.sareeLength}
                    onChange={(e) => updateField('sareeLength', e.target.value)}
                    placeholder='5.5'
                    step='0.5'
                    min='4'
                    max='9'
                    className={inputCls}
                  />
                </Field>
              </div>

              {/* Color preferences */}
              <div className='mt-5'>
                <Field label='Color preferences'>
                  <div className='flex flex-wrap gap-2'>
                    {COLOR_PREFS.map((c) => (
                      <button
                        key={c}
                        type='button'
                        onClick={() => toggleColor(c)}
                        className={[
                          'rounded-full border px-4 py-2 text-sm font-semibold transition',
                          form.colorPrefs.includes(c)
                            ? 'border-[#7a1e2c] bg-[#7a1e2c] text-white'
                            : 'border-[#ead9cf] bg-[#fffaf6] text-[#6b5048] hover:border-[#7a1e2c]',
                        ].join(' ')}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              {/* Blouse toggle */}
              <div className='mt-5'>
                <label className='flex cursor-pointer items-center gap-3'>
                  <div
                    role='switch'
                    aria-checked={form.blouseRequired}
                    onClick={() =>
                      updateField('blouseRequired', !form.blouseRequired)
                    }
                    className={[
                      'relative h-6 w-11 rounded-full transition-colors duration-200',
                      form.blouseRequired ? 'bg-[#7a1e2c]' : 'bg-[#e5d5cf]',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
                        form.blouseRequired
                          ? 'translate-x-5'
                          : 'translate-x-0.5',
                      ].join(' ')}
                    />
                  </div>
                  <span className='text-sm font-semibold text-[#34160f]'>
                    Include matching blouse piece
                  </span>
                </label>
              </div>
            </section>

            {/* Budget details */}
            <section className='rounded-[30px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
                Budget Details
              </p>
              <div className='mt-5 grid gap-5 md:grid-cols-2'>
                <Field label='Minimum budget (&#8377;)' required>
                  <input
                    type='number'
                    value={form.budgetMin}
                    onChange={(e) => updateField('budgetMin', e.target.value)}
                    placeholder='10000'
                    min='0'
                    className={inputCls}
                  />
                </Field>

                <Field label='Maximum budget (&#8377;)'>
                  <input
                    type='number'
                    value={form.budgetMax}
                    onChange={(e) => updateField('budgetMax', e.target.value)}
                    placeholder='25000'
                    min='0'
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className='mt-5'>
                <Field
                  label='Notes for the artisan'
                  hint='Describe motif ideas, wedding colors, blouse style, or any reference you have in mind.'
                >
                  <textarea
                    rows={5}
                    value={form.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder='E.g. I want a peacock motif pallu in deep maroon with gold zari, for my daughter&#39;s wedding in December...'
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              </div>
            </section>
          </div>

          {/* ── Right column ── */}
          <div className='space-y-6'>
            {/* Image upload */}
            <section className='rounded-[30px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
                Upload Reference
              </p>

              <label className='mt-5 flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#e3cfc3] bg-[#fffaf6] px-6 py-8 text-center transition hover:border-[#7a1e2c]'>
                <Upload size={28} className='text-[#7a1e2c]' />
                <p className='mt-3 text-sm font-semibold text-[#34160f]'>
                  Add inspiration images
                </p>
                <p className='mt-1 text-xs leading-6 text-[#8b6759]'>
                  Upload blouse references, color cards, or motif screenshots.
                </p>
                <p className='mt-1 text-[10px] text-[#b19588]'>
                  PNG, JPG up to 5 MB each
                </p>
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  className='hidden'
                  onChange={handleImageChange}
                />
              </label>

              {/* Image previews */}
              {imagePreviews.length > 0 && (
                <div className='mt-4 grid grid-cols-2 gap-2'>
                  {imagePreviews.map((src, i) => (
                    <div key={i} className='relative'>
                      <img
                        src={src}
                        alt={`Reference ${i + 1}`}
                        className='h-24 w-full rounded-2xl object-cover'
                      />
                      <button
                        type='button'
                        onClick={() => removeImage(i)}
                        className='absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#7a1e2c] text-white shadow'
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Tips + submit */}
            <section className='rounded-[30px] border border-[#efdcd2] bg-[#fff6df] p-6 shadow-[0_18px_45px_rgba(94,35,23,0.06)]'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#9b6a08]'>
                Before you submit
              </p>
              <ul className='mt-4 space-y-3 text-sm leading-7 text-[#6b5048]'>
                <li>
                  Include your delivery timeline if the saree is for a wedding
                  or event.
                </li>
                <li>
                  Share at least one preferred color so the artisan can suggest
                  matching zari work.
                </li>
                <li>
                  Reference images make it much easier to quote accurately.
                </li>
              </ul>

              <button
                type='submit'
                disabled={loading}
                className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7a1e2c] px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#651623] disabled:opacity-60'
              >
                <Send size={16} />
                {loading ? 'Submitting\u2026' : 'Submit Request'}
              </button>
            </section>
          </div>
        </form>
      )}
    </div>
  );
};

export default CustomDesign;
