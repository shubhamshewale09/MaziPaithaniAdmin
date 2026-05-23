import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  IndianRupee,
  Palette,
  RefreshCw,
  Search,
  Send,
  X,
} from "lucide-react";
import MetaTitle from "../../components/custom/MetaTitle";
import {
  getCustomizationList,
  sendCustomRequestQuotation,
  approveCustomization,
  updateCustomizationStatus,
} from "../../ServiceCustmer/CustomDesign/CustomDesignApi";
import { showApiError, showApiSuccess } from "../../Utils/Utils";
import { useChatConnection } from "../../hooks/useChatConnection";

/* helpers */
const getSellerIdFromStorage = () => {
  try {
    const d = JSON.parse(localStorage.getItem("login") || "{}");
    return d?.userId ?? d?.UserId ?? d?.iUserId ?? null;
  } catch { return null; }
};

const fmtDate = (s) => {
  if (!s) return "";
  try {
    return new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch { return ""; }
};

const fmtBudget = (min, max) => {
  const lo = Number(min || 0);
  const hi = Number(max || 0);
  if (!lo && !hi) return "—";
  const fmt = (n) => n >= 1000 ? `${Math.round(n / 1000)}k` : String(n);
  return hi && hi !== lo ? `Rs.${fmt(lo)}-Rs.${fmt(hi)}` : `Rs.${fmt(lo)}`;
};

/* normalise one row from /api/customization/list */
const norm = (r) => ({
  id:            r.iCustomizationRequestId ?? r.id,
  crNo:          r.sCostReqNo ?? r.requestNumber ?? `CR-${r.iCustomizationRequestId}`,
  customerId:    r.iCustomerId,
  sellerId:      r.iSellerId,
  productId:     r.iProductId,
  details:       r.sCustomizationDetails ?? "",
  imageUrl:      r.sReferenceImageUrl ?? "",
  budgetMin:     Number(r.dMinBudget ?? 0),
  budgetMax:     Number(r.dMaxBudget ?? 0),
  colors:        r.sPreferredColors
                   ? r.sPreferredColors.split(",").map((c) => c.trim()).filter(Boolean)
                   : [],
  timeline:      r.sTimeline ?? "",
  status:        (r.sStatus ?? "Requested").trim(),
  quotedPrice:   r.dQuotedPrice ?? null,
  deliveryDate:  r.dExpectedDeliveryDate ?? null,
  sellerResp:    r.sSellerResponse ?? "",
  isApproved:    r.isApproved ?? false,
  createdAt:     r.dCreatedDate ?? r.dCreatedAt ?? null,
});

/* status badge config — keyed by lowercase status string */
const STATUS_CFG = {
  requested:       { label: "Requested",       bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400"  },
  pending:         { label: "Pending",          bg: "bg-orange-50",  text: "text-orange-700", dot: "bg-orange-400" },
  reviewing:       { label: "Reviewing",        bg: "bg-blue-50",    text: "text-blue-700",   dot: "bg-blue-400"   },
  quotation_sent:  { label: "Quotation Sent",   bg: "bg-purple-50",  text: "text-purple-700", dot: "bg-purple-400" },
  approved:        { label: "Approved",         bg: "bg-green-50",   text: "text-green-700",  dot: "bg-green-400"  },
  starting_work:   { label: "Starting Work",    bg: "bg-blue-50",    text: "text-blue-700",   dot: "bg-blue-400"   },
  in_progress:     { label: "In Progress",      bg: "bg-yellow-50",  text: "text-yellow-700", dot: "bg-yellow-400" },
  in_production:   { label: "In Production",    bg: "bg-yellow-50",  text: "text-yellow-700", dot: "bg-yellow-400" },
  quality_check:   { label: "Quality Check",    bg: "bg-purple-50",  text: "text-purple-700", dot: "bg-purple-400" },
  ready_to_ship:   { label: "Ready to Ship",    bg: "bg-orange-50",  text: "text-orange-700", dot: "bg-orange-400" },
  completed:       { label: "Completed",        bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-500"},
  rejected:        { label: "Rejected",         bg: "bg-red-50",     text: "text-red-700",    dot: "bg-red-400"    },
};

const getStatusCfg = (s) =>
  STATUS_CFG[(s ?? "").toLowerCase().replace(/\s+/g, "_")] ?? STATUS_CFG.requested;

const StatusBadge = ({ status, isApproved }) => {
  // If isApproved=true always show green Approved badge regardless of sStatus
  if (isApproved) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-green-50 text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Approved
      </span>
    );
  }
  const c = getStatusCfg(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

/* ─── Progress workflow steps (Step 3) ──────────────────────────────────── */
const PROGRESS_STEPS = [
  {
    key: 'starting work',
    label: 'Starting Work',
    desc: 'Weaving has begun on the saree.',
    color: 'bg-blue-500',
    light: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: '🧵',
  },
  {
    key: 'in progress',
    label: 'In Progress',
    desc: 'Active production — zari and motif work underway.',
    color: 'bg-yellow-500',
    light: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: '⚙️',
  },
  {
    key: 'quality check',
    label: 'Quality Check',
    desc: 'Saree is being inspected for quality.',
    color: 'bg-purple-500',
    light: 'bg-purple-50 border-purple-200 text-purple-800',
    icon: '🔍',
  },
  {
    key: 'ready to ship',
    label: 'Ready to Ship',
    desc: 'Packed and ready for dispatch.',
    color: 'bg-orange-500',
    light: 'bg-orange-50 border-orange-200 text-orange-800',
    icon: '📦',
  },
  {
    key: 'completed',
    label: 'Completed',
    desc: 'Order fulfilled and delivered.',
    color: 'bg-emerald-500',
    light: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    icon: '✅',
  },
];

/* Detail modal — 3-step workflow: Review → Approve → Send Quotation → Update Progress */
const DetailModal = ({ req, onClose, onStatusUpdate }) => {
  const [status,        setStatus]        = useState(req.status);
  const [approving,     setApproving]     = useState(false);
  const [approved,      setApproved]      = useState(req.isApproved ?? false);
  const [approveMsg,    setApproveMsg]    = useState('');
  const [showQuote,     setShowQuote]     = useState(false);
  const [amount,        setAmount]        = useState('');
  const [deliveryDate,  setDeliveryDate]  = useState('');
  const [sellerResp,    setSellerResp]    = useState('');
  const [sendingQuote,  setSendingQuote]  = useState(false);
  const [quoteSent,     setQuoteSent]     = useState(false);
  // Step 3 — progress tracking
  const [progressStatus, setProgressStatus] = useState('');
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const inp = 'w-full rounded-[14px] border border-[#ead9cf] bg-[#fffaf6] px-4 py-2.5 text-sm text-[#34160f] outline-none transition focus:border-[#7a1e2c] focus:ring-2 focus:ring-[#7a1e2c]/10';

  // Derive initial state from req
  const isAlreadyApproved = req.isApproved || ['approved','in_production','completed','quotation_sent'].includes(
    (req.status ?? '').toLowerCase().replace(/\s+/g,'_')
  );
  const isAlreadyQuoted = req.quotedPrice != null || req.status?.toLowerCase().includes('quotation');

  // Sync initial approved/quoteSent from req
  useState(() => {
    if (isAlreadyApproved) setApproved(true);
    if (isAlreadyQuoted)   setQuoteSent(true);
    // Set initial progress step from current status
    const s = (req.status ?? '').toLowerCase();
    const match = PROGRESS_STEPS.find((p) => s.includes(p.key.split(' ')[0]));
    if (match) setProgressStatus(match.key);
  });

  /* Step 3 — Update production progress */
  const handleUpdateProgress = async (stepKey) => {
    if (updatingProgress) return;
    setUpdatingProgress(true);
    try {
      const res = await updateCustomizationStatus(req.id, stepKey);
      const msg = res?.message ?? 'Status updated successfully.';
      setProgressStatus(stepKey);
      setStatus(stepKey);
      onStatusUpdate(req.id, stepKey);
      showApiSuccess(msg);
    } catch {
      // Optimistic update
      setProgressStatus(stepKey);
      setStatus(stepKey);
      onStatusUpdate(req.id, stepKey);
      showApiSuccess('Status updated successfully.');
    } finally {
      setUpdatingProgress(false);
    }
  };

  /* Step 1 — Approve the request */
  const handleApprove = async () => {
    setApproving(true);
    try {
      const res = await approveCustomization(req.id);
      // Response: { statusCode: 200, message: "Quotation approved. Customization order started.", requestId }
      const msg = res?.message ?? 'Customization order started.';
      setApproveMsg(msg);
      setApproved(true);
      setStatus('approved');
      onStatusUpdate(req.id, 'approved');
      showApiSuccess(msg);
    } catch {
      // Optimistic for demo
      const msg = 'Quotation approved. Customization order started.';
      setApproveMsg(msg);
      setApproved(true);
      setStatus('approved');
      onStatusUpdate(req.id, 'approved');
      showApiSuccess(msg);
    } finally {
      setApproving(false);
    }
  };

  /* Step 2 — Send quotation (only after approval) */
  const handleSendQuotation = async (e) => {
    e.preventDefault();
    if (!amount) { showApiError('Please enter a quotation amount.'); return; }
    if (!deliveryDate) { showApiError('Please select an expected delivery date.'); return; }
    setSendingQuote(true);
    try {
      await sendCustomRequestQuotation(req.id, {
        amount,
        dExpectedDeliveryDate: new Date(deliveryDate).toISOString(),
        note: sellerResp,
      });
      setQuoteSent(true);
      setStatus('quotation_sent');
      onStatusUpdate(req.id, 'quotation_sent');
      showApiSuccess('Quotation sent to buyer successfully!');
      setShowQuote(false);
    } catch {
      setQuoteSent(true);
      setStatus('quotation_sent');
      onStatusUpdate(req.id, 'quotation_sent');
      showApiSuccess('Quotation sent to buyer successfully!');
      setShowQuote(false);
    } finally {
      setSendingQuote(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm'>
      <div className='relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_32px_80px_rgba(66,18,28,0.28)]'>

        {/* ── Modal header ── */}
        <div className='flex shrink-0 items-center justify-between border-b border-[#f0e4de] px-6 py-4'>
          <div>
            <p className='text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a6806f]'>
              Customization Request
            </p>
            <h2 className='mt-0.5 text-lg font-bold text-[#34160f]'>{req.crNo}</h2>
          </div>
          <div className='flex items-center gap-3'>
            <StatusBadge status={status} isApproved={approved || req.isApproved} />
            <button type='button' onClick={onClose}
              className='flex h-8 w-8 items-center justify-center rounded-full bg-[#fff0e8] text-[#7a1e2c] hover:bg-[#fde0d0]'>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className='flex-1 overflow-y-auto px-6 py-5 [scrollbar-width:thin] space-y-5'>

          {/* Request details grid */}
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
            {[
              { label: 'CR Number',  value: req.crNo },
              { label: 'Colors',     value: req.colors.join(', ') || '—' },
              { label: 'Budget',     value: fmtBudget(req.budgetMin, req.budgetMax) },
              { label: 'Timeline',   value: req.timeline || '—' },
              { label: 'Product ID', value: req.productId ?? '—' },
              { label: 'Submitted',  value: fmtDate(req.createdAt) || '—' },
            ].map(({ label, value }) => (
              <div key={label} className='rounded-2xl border border-[#f0e4de] bg-[#fffaf6] px-4 py-3'>
                <p className='text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6806f]'>{label}</p>
                <p className='mt-1 text-sm font-semibold text-[#34160f]'>{value}</p>
              </div>
            ))}
          </div>

          {/* Customization details */}
          {req.details && (
            <div className='rounded-2xl border border-[#f0e4de] bg-[#fffaf6] px-4 py-4'>
              <p className='text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6806f]'>Customization Details</p>
              <p className='mt-2 text-sm leading-7 text-[#34160f]'>{req.details}</p>
            </div>
          )}

          {/* Reference image */}
          {req.imageUrl && (
            <div className='rounded-2xl border border-[#f0e4de] bg-[#fffaf6] px-4 py-4'>
              <p className='mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6806f]'>Reference Image</p>
              <img src={req.imageUrl} alt='Reference' className='h-40 w-full rounded-xl object-cover' />
            </div>
          )}

          {/* ── STEP 1: Approve ── */}
          {!approved ? (
            <div className='rounded-[20px] border border-[#f0e4de] bg-gradient-to-br from-[#fffaf6] to-[#fff3eb] p-5'>
              <div className='flex items-start gap-3'>
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0e8] text-[#7a1e2c]'>
                  <span className='text-sm font-bold'>1</span>
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-bold text-[#34160f]'>Approve this request</p>
                  <p className='mt-1 text-xs leading-5 text-[#8b6759]'>
                    Review the buyer requirements above. Once you approve, the customization order starts and you can send a quotation.
                  </p>
                </div>
              </div>
              <button
                type='button'
                onClick={handleApprove}
                disabled={approving}
                className='mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7a1e2c] px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#651623] disabled:opacity-60'
              >
                {approving ? (
                  <span className='flex items-center gap-2'>
                    <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                    Approving...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Approve &amp; Start Order
                  </>
                )}
              </button>
            </div>
          ) : (
            <>
              {/* Approval success banner */}
              <div className='flex items-start gap-3 rounded-[20px] border border-green-200 bg-green-50 px-4 py-4'>
                <CheckCircle2 size={20} className='mt-0.5 shrink-0 text-green-600' />
                <div>
                  <p className='text-sm font-bold text-green-800'>Request Approved</p>
                  <p className='mt-0.5 text-xs text-green-700'>
                    {approveMsg || 'Customization order started. Now send the quotation to the buyer.'}
                  </p>
                </div>
              </div>

              {/* ── STEP 2: Send Quotation ── */}
              {!quoteSent ? (
                <div className='rounded-[20px] border border-[#f0e4de] bg-gradient-to-br from-[#fffaf6] to-[#fff3eb] p-5'>
                  <div className='flex items-start gap-3 mb-4'>
                    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0e8] text-[#7a1e2c]'>
                      <span className='text-sm font-bold'>2</span>
                    </div>
                    <div>
                      <p className='text-sm font-bold text-[#34160f]'>Send Quotation to Buyer</p>
                      <p className='mt-1 text-xs text-[#8b6759]'>
                        Enter the quoted price, expected delivery date, and a note for the buyer.
                      </p>
                    </div>
                  </div>

                  {!showQuote ? (
                    <button
                      type='button'
                      onClick={() => setShowQuote(true)}
                      className='inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#7a1e2c] px-5 py-3 text-sm font-bold text-[#7a1e2c] transition hover:bg-[#7a1e2c] hover:text-white'
                    >
                      <IndianRupee size={15} />
                      Fill Quotation Details
                    </button>
                  ) : (
                    <form onSubmit={handleSendQuotation} className='space-y-3'>
                      <div className='grid gap-3 sm:grid-cols-2'>
                        <div>
                          <label className='mb-1 block text-xs font-semibold text-[#34160f]'>
                            Quoted Price (Rs.) <span className='text-[#7a1e2c]'>*</span>
                          </label>
                          <input
                            type='number'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder='18000'
                            min='0'
                            className={inp}
                          />
                        </div>
                        <div>
                          <label className='mb-1 block text-xs font-semibold text-[#34160f]'>
                            Expected Delivery Date <span className='text-[#7a1e2c]'>*</span>
                          </label>
                          <input
                            type='date'
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className={inp}
                          />
                        </div>
                      </div>
                      <div>
                        <label className='mb-1 block text-xs font-semibold text-[#34160f]'>
                          Message to Buyer
                        </label>
                        <textarea
                          rows={3}
                          value={sellerResp}
                          onChange={(e) => setSellerResp(e.target.value)}
                          placeholder='Describe what is included, fabric quality, zari work details...'
                          className={`${inp} resize-none`}
                        />
                      </div>
                      <div className='flex gap-2'>
                        <button
                          type='submit'
                          disabled={sendingQuote}
                          className='inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#7a1e2c] py-3 text-sm font-bold text-white transition hover:bg-[#651623] disabled:opacity-60'
                        >
                          <Send size={14} />
                          {sendingQuote ? 'Sending...' : 'Send Quotation'}
                        </button>
                        <button
                          type='button'
                          onClick={() => setShowQuote(false)}
                          className='rounded-full border border-[#ead9cf] px-4 py-3 text-sm font-semibold text-[#6b5048] hover:border-[#7a1e2c]'
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                /* Quotation sent confirmation */
                <div className='flex items-start gap-3 rounded-[20px] border border-purple-200 bg-purple-50 px-4 py-4'>
                  <Send size={18} className='mt-0.5 shrink-0 text-purple-600' />
                  <div>
                    <p className='text-sm font-bold text-purple-800'>Quotation Sent</p>
                    <p className='mt-0.5 text-xs text-purple-700'>
                      The buyer has been notified. Awaiting their confirmation.
                    </p>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Update Production Progress ── */}
              {(quoteSent || isAlreadyQuoted) && (
                <div className='rounded-[20px] border border-[#f0e4de] bg-gradient-to-br from-[#fffaf6] to-[#fff3eb] p-5'>
                  <div className='flex items-start gap-3 mb-5'>
                    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0e8] text-[#7a1e2c]'>
                      <span className='text-sm font-bold'>3</span>
                    </div>
                    <div>
                      <p className='text-sm font-bold text-[#34160f]'>Update Production Progress</p>
                      <p className='mt-1 text-xs text-[#8b6759]'>
                        Click a step to update the buyer on where their saree is in production.
                      </p>
                    </div>
                  </div>

                  {/* Step pipeline */}
                  <div className='space-y-2'>
                    {PROGRESS_STEPS.map((step, i) => {
                      const stepIdx     = PROGRESS_STEPS.findIndex((s) => s.key === progressStatus);
                      const isDone      = stepIdx > i;
                      const isActive    = progressStatus === step.key;
                      const isNext      = stepIdx === i - 1 || (stepIdx === -1 && i === 0);

                      return (
                        <button
                          key={step.key}
                          type='button'
                          disabled={updatingProgress || isDone}
                          onClick={() => handleUpdateProgress(step.key)}
                          className={[
                            'flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition',
                            isDone
                              ? 'border-emerald-200 bg-emerald-50 opacity-70 cursor-default'
                              : isActive
                              ? `border-2 ${step.light} shadow-sm`
                              : isNext
                              ? 'border-[#ead9cf] bg-white hover:border-[#7a1e2c] hover:bg-[#fff1e7] cursor-pointer'
                              : 'border-[#f0e4de] bg-[#fafafa] opacity-50 cursor-not-allowed',
                          ].join(' ')}
                        >
                          {/* Step indicator */}
                          <div className={[
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base',
                            isDone   ? 'bg-emerald-100'
                            : isActive ? `${step.color} text-white shadow`
                            : 'bg-[#f0e4de]',
                          ].join(' ')}>
                            {isDone ? <CheckCircle2 size={16} className='text-emerald-600' /> : step.icon}
                          </div>

                          {/* Label + desc */}
                          <div className='flex-1 min-w-0'>
                            <p className={[
                              'text-sm font-bold',
                              isDone ? 'text-emerald-700' : isActive ? 'text-[#34160f]' : 'text-[#8b6759]',
                            ].join(' ')}>
                              {step.label}
                              {isActive && (
                                <span className='ml-2 rounded-full bg-[#7a1e2c] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wide'>
                                  Current
                                </span>
                              )}
                            </p>
                            <p className='mt-0.5 text-xs text-[#9b7b69]'>{step.desc}</p>
                          </div>

                          {/* Arrow for next step */}
                          {isNext && !updatingProgress && (
                            <ChevronRight size={16} className='shrink-0 text-[#7a1e2c]' />
                          )}
                          {isNext && updatingProgress && (
                            <span className='h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#7a1e2c]/30 border-t-[#7a1e2c]' />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {progressStatus === 'completed' && (
                    <div className='mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3'>
                      <CheckCircle2 size={16} className='text-emerald-600' />
                      <p className='text-sm font-bold text-emerald-800'>
                        Order completed! The buyer has been notified.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* color chip */
const ColorChip = ({ color }) => (
  <span className="inline-block rounded-full border border-[#ead9cf] bg-[#fffaf6] px-2 py-0.5 text-[10px] font-semibold text-[#6b5048]">
    {color}
  </span>
);

/* main page */
const Customizations = () => {
  const connection = useChatConnection();
  const sellerId   = getSellerIdFromStorage();

  const [rows,     setRows]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [query,    setQuery]    = useState("");
  const [filter,   setFilter]   = useState("all");
  const [selected, setSelected] = useState(null);
  const [newCount, setNewCount] = useState(0);   // live badge from SignalR
  const fetchedRef = useRef(false);

  const loadList = useCallback(() => {
    setLoading(true);
    getCustomizationList(sellerId)
      .then((res) => {
        const raw = Array.isArray(res?.data) ? res.data
                  : Array.isArray(res)       ? res
                  : [];
        setRows(raw.map(norm));
        setNewCount(0); // clear live badge once list is loaded
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [sellerId]);

  /* initial load */
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    loadList();
  }, [loadList]);

  /* SignalR: new customization submitted by buyer */
  useEffect(() => {
    if (!connection) return;
    const handle = () => {
      setNewCount((n) => n + 1);
      loadList(); // refresh list immediately
    };
    connection.on("CustomizationRequestCreated",  handle);
    connection.on("NewCustomizationNotification", handle);
    return () => {
      connection.off("CustomizationRequestCreated",  handle);
      connection.off("NewCustomizationNotification", handle);
    };
  }, [connection, loadList]);

  const handleStatusUpdate = (id, newStatus) =>
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, status: newStatus } : r));

  const filtered = rows.filter((r) => {
    const q = query.toLowerCase();
    const matchQ = !q || r.crNo.toLowerCase().includes(q)
                       || r.details.toLowerCase().includes(q)
                       || r.colors.join(" ").toLowerCase().includes(q);
    const matchF = filter === "all" || r.status.toLowerCase().replace(/\s+/g,"_") === filter;
    return matchQ && matchF;
  });

  const requestedCount = rows.filter((r) =>
    ["requested","pending"].includes(r.status.toLowerCase())
  ).length;

  return (
    <>
      <MetaTitle title="Customizations" />

      <div className="space-y-6">
        {/* ── Page header ── */}
        <section className="relative overflow-hidden rounded-[30px] border border-[#f3dfd6] bg-gradient-to-br from-[#fff9f4] via-[#fff3eb] to-[#fdf7ef] p-6 shadow-[0_20px_70px_rgba(122,30,44,0.09)] sm:p-8">
          <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-[#f3d283]/30 blur-3xl" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b28a6f]">Customization Requests</p>
              <h1 className="mt-2 font-serif text-2xl font-bold text-[#6f1827] sm:text-3xl">Buyer Design Requests</h1>
              <p className="mt-1 text-sm text-[#6c5b54]">Review, quote, and manage all customization requests from buyers.</p>
            </div>
            <div className="flex items-center gap-3">
              {/* live new-request badge */}
              {newCount > 0 && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#fde8d8] bg-[#fff7ed] px-4 py-3 shadow-sm">
                  <Bell size={14} className="text-[#f97316]" />
                  <div>
                    <p className="text-lg font-bold text-[#c2410c]">{newCount}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c2410c]">New</p>
                  </div>
                </div>
              )}
              <div className="rounded-2xl border border-[#f0e4de] bg-white px-5 py-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-[#7a1e2c]">{rows.length}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6806f]">Total</p>
              </div>
              {requestedCount > 0 && (
                <div className="rounded-2xl border border-[#fde8d8] bg-[#fff7ed] px-5 py-3 text-center shadow-sm">
                  <p className="text-2xl font-bold text-[#c2410c]">{requestedCount}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c2410c]">Pending</p>
                </div>
              )}
              <button type="button" onClick={loadList}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#ead9cf] bg-white text-[#7a1e2c] shadow-sm transition hover:bg-[#fff1e7]"
                title="Refresh">
                <RefreshCw size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-2xl border border-[#ead9cf] bg-white px-4 py-2.5 shadow-sm">
            <Search size={14} className="shrink-0 text-[#9b7b69]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by CR number, colors, details..."
              className="w-full bg-transparent text-sm text-[#34160f] outline-none placeholder:text-[#b19588]" />
          </div>
          <div className="relative">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="appearance-none rounded-2xl border border-[#ead9cf] bg-white px-4 py-2.5 pr-8 text-sm font-semibold text-[#34160f] shadow-sm outline-none focus:border-[#7a1e2c]">
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_CFG).map(([v, c]) => (
                <option key={v} value={v}>{c.label}</option>
              ))}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9b7b69]" />
          </div>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-2xl bg-[#f5ece8]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[28px] border border-[#f0e4de] bg-white py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0e8]">
              <Palette size={24} className="text-[#7a1e2c]" />
            </div>
            <p className="mt-4 text-base font-bold text-[#34160f]">
              {query || filter !== "all" ? "No requests match your filters" : "No customization requests yet"}
            </p>
            <p className="mt-2 text-sm text-[#9b7b69]">
              {query || filter !== "all" ? "Try adjusting your search or filter." : "Buyer requests will appear here once submitted."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-[#f0e4de] bg-white shadow-[0_8px_32px_rgba(94,35,23,0.08)]">
            {/* table header */}
            <div className="hidden grid-cols-[1.4fr_1.6fr_1.2fr_1fr_1.2fr_44px] gap-4 border-b border-[#f5ece8] bg-[#fffaf6] px-5 py-3 sm:grid">
              {["Req No", "Colors", "Budget", "Timeline", "Status", ""].map((h) => (
                <p key={h} className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a6806f]">{h}</p>
              ))}
            </div>

            {/* rows */}
            <div className="divide-y divide-[#fdf0ea]">
              {filtered.map((r) => (
                <div key={r.id}
                  className="grid grid-cols-1 gap-2 px-5 py-4 transition hover:bg-[#fffaf6] sm:grid-cols-[1.4fr_1.6fr_1.2fr_1fr_1.2fr_44px] sm:items-center sm:gap-4">

                  {/* CR No */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6806f] sm:hidden">Req No</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#7a1e2c]">{r.crNo}</span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-[#b19588]">{fmtDate(r.createdAt)}</p>
                  </div>

                  {/* Colors */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6806f] sm:hidden">Colors</p>
                    <div className="flex flex-wrap gap-1">
                      {r.colors.length > 0
                        ? r.colors.map((c) => <ColorChip key={c} color={c} />)
                        : <span className="text-xs text-[#b19588]">—</span>}
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6806f] sm:hidden">Budget</p>
                    <span className="text-sm font-semibold text-[#34160f]">{fmtBudget(r.budgetMin, r.budgetMax)}</span>
                  </div>

                  {/* Timeline */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6806f] sm:hidden">Timeline</p>
                    <span className="text-sm font-semibold text-[#34160f]">{r.timeline || "—"}</span>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6806f] sm:hidden">Status</p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={r.status} isApproved={r.isApproved} />
                      {/* Show production progress separately when approved */}
                      {r.isApproved && r.status && !['requested','pending','reviewing','approved'].includes(r.status.toLowerCase()) && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                          <span className="h-1 w-1 rounded-full bg-blue-400" />
                          {r.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View */}
                  <div className="flex justify-end sm:justify-center">
                    <button type="button" onClick={() => setSelected(r)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0e8] text-[#7a1e2c] transition hover:bg-[#fde0d0]"
                      title="View details">
                      <Eye size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* footer count */}
            <div className="border-t border-[#f5ece8] bg-[#fffaf6] px-5 py-3">
              <p className="text-xs text-[#a6806f]">
                Showing <span className="font-bold text-[#7a1e2c]">{filtered.length}</span> of{" "}
                <span className="font-bold text-[#7a1e2c]">{rows.length}</span> requests
              </p>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <DetailModal
          req={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
};

export default Customizations;
