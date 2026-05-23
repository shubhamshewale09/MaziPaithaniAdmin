import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  Palette,
  RefreshCw,
  Send,
  X,
} from 'lucide-react';
import { getCustomerCustomRequests } from '../../ServiceCustmer/CustomDesign/CustomDesignApi';
import { useChatConnection } from '../../hooks/useChatConnection';

/* ─── helpers ────────────────────────────────────────────────────────────── */
const getCustomerId = () => {
  try {
    const d = JSON.parse(localStorage.getItem('login') || '{}');
    return d?.userId ?? d?.UserId ?? d?.iUserId ?? null;
  } catch { return null; }
};

const fmtDate = (s) => {
  if (!s) return '';
  try {
    return new Date(s).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return ''; }
};

const fmtBudget = (min, max) => {
  const lo = Number(min || 0);
  const hi = Number(max || 0);
  if (!lo && !hi) return '—';
  const fmt = (n) => n >= 1000 ? `\u20B9${Math.round(n / 1000)}k` : `\u20B9${n}`;
  return hi && hi !== lo ? `${fmt(lo)} \u2013 ${fmt(hi)}` : `${fmt(lo)}+`;
};

const timeAgo = (s) => {
  if (!s) return '';
  try {
    const diff = Math.floor((Date.now() - new Date(s)) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return fmtDate(s);
  } catch { return ''; }
};

/* normalise API row */
const norm = (r) => ({
  id:           r.iCustomizationRequestId ?? r.id,
  crNo:         r.sCostReqNo ?? `CR-${r.iCustomizationRequestId}`,
  details:      r.sCustomizationDetails ?? '',
  imageUrl:     r.sReferenceImageUrl ?? '',
  budgetMin:    Number(r.dMinBudget ?? 0),
  budgetMax:    Number(r.dMaxBudget ?? 0),
  colors:       r.sPreferredColors
                  ? r.sPreferredColors.split(',').map((c) => c.trim()).filter(Boolean)
                  : [],
  timeline:     r.sTimeline ?? '',
  status:       (r.sStatus ?? 'Requested').trim(),
  quotedPrice:  r.dQuotedPrice ?? null,
  deliveryDate: r.dExpectedDeliveryDate ?? null,
  sellerResp:   r.sSellerResponse ?? '',
  isApproved:   r.isApproved ?? false,
  createdAt:    r.dCreatedDate ?? r.dCreatedAt ?? null,
});

/* ─── Status config ──────────────────────────────────────────────────────── */
const STATUS_CFG = {
  requested:      { label: 'Requested',     bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   step: 1 },
  pending:        { label: 'Pending',       bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-400',  step: 1 },
  reviewing:      { label: 'Reviewing',     bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400',    step: 2 },
  approved:       { label: 'Approved',      bg: 'bg-green-50',   text: 'text-green-700',   dot: 'bg-green-400',   step: 3 },
  quotation_sent: { label: 'Quotation Sent',bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-400',  step: 3 },
  starting_work:  { label: 'Starting Work', bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400',    step: 4 },
  in_progress:    { label: 'In Progress',   bg: 'bg-yellow-50',  text: 'text-yellow-700',  dot: 'bg-yellow-400',  step: 4 },
  in_production:  { label: 'In Production', bg: 'bg-yellow-50',  text: 'text-yellow-700',  dot: 'bg-yellow-400',  step: 4 },
  quality_check:  { label: 'Quality Check', bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-400',  step: 4 },
  ready_to_ship:  { label: 'Ready to Ship', bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-400',  step: 4 },
  completed:      { label: 'Completed',     bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', step: 5 },
  rejected:       { label: 'Rejected',      bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-400',     step: 0 },
};

const getStatusCfg = (s) =>
  STATUS_CFG[(s ?? '').toLowerCase().replace(/\s+/g, '_')] ?? STATUS_CFG.requested;

/* StatusBadge — when isApproved=true always show green Approved */
const StatusBadge = ({ status, isApproved }) => {
  if (isApproved) {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold bg-green-50 text-green-700'>
        <span className='h-1.5 w-1.5 rounded-full bg-green-500' />
        Approved
      </span>
    );
  }
  const c = getStatusCfg(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

/* ─── Progress stepper ───────────────────────────────────────────────────── */
const STEPS = ['Submitted', 'Reviewing', 'Approved', 'In Production', 'Completed'];

const ProgressStepper = ({ status }) => {
  const cfg = getStatusCfg(status);
  const current = cfg.step ?? 1;
  return (
    <div className='flex items-center gap-0'>
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const done    = stepNum < current;
        const active  = stepNum === current;
        return (
          <div key={label} className='flex flex-1 items-center'>
            <div className='flex flex-col items-center'>
              <div className={[
                'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all',
                done   ? 'bg-[#7a1e2c] text-white'
                : active ? 'bg-[#7a1e2c] text-white ring-4 ring-[#7a1e2c]/20'
                : 'bg-[#f0e4de] text-[#b19588]',
              ].join(' ')}>
                {done ? <CheckCircle2 size={13} /> : stepNum}
              </div>
              <p className={`mt-1 text-[9px] font-semibold text-center leading-tight ${active ? 'text-[#7a1e2c]' : done ? 'text-[#7a1e2c]/70' : 'text-[#b19588]'}`}>
                {label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mb-4 h-0.5 flex-1 ${done ? 'bg-[#7a1e2c]' : 'bg-[#f0e4de]'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ─── Detail drawer ──────────────────────────────────────────────────────── */
const DetailDrawer = ({ req, onClose }) => (
  <div className='fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/40 p-4 backdrop-blur-sm'>
    <div className='relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] sm:rounded-[28px] bg-white shadow-[0_32px_80px_rgba(66,18,28,0.28)]'>

      {/* header */}
      <div className='flex shrink-0 items-center justify-between border-b border-[#f0e4de] px-5 py-4'>
        <div>
          <p className='text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a6806f]'>My Request</p>
          <h2 className='mt-0.5 text-base font-bold text-[#34160f]'>{req.crNo}</h2>
        </div>
        <div className='flex items-center gap-3'>
          <StatusBadge status={req.status} />
          <button type='button' onClick={onClose}
            className='flex h-8 w-8 items-center justify-center rounded-full bg-[#fff0e8] text-[#7a1e2c] hover:bg-[#fde0d0]'>
            <X size={15} />
          </button>
        </div>
      </div>

      {/* body */}
      <div className='flex-1 overflow-y-auto px-5 py-5 [scrollbar-width:thin] space-y-5'>

        {/* Progress */}
        <div className='rounded-[20px] border border-[#f0e4de] bg-[#fffaf6] px-4 py-4'>
          <p className='mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6806f]'>Request Progress</p>
          <ProgressStepper status={req.status} />
        </div>

        {/* Details grid */}
        <div className='grid grid-cols-2 gap-3'>
          {[
            { label: 'CR Number', value: req.crNo },
            { label: 'Submitted', value: timeAgo(req.createdAt) },
            { label: 'Budget',    value: fmtBudget(req.budgetMin, req.budgetMax) },
            { label: 'Timeline',  value: req.timeline || '—' },
          ].map(({ label, value }) => (
            <div key={label} className='rounded-2xl border border-[#f0e4de] bg-[#fffaf6] px-4 py-3'>
              <p className='text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6806f]'>{label}</p>
              <p className='mt-1 text-sm font-semibold text-[#34160f]'>{value}</p>
            </div>
          ))}
        </div>

        {/* Colors */}
        {req.colors.length > 0 && (
          <div className='rounded-2xl border border-[#f0e4de] bg-[#fffaf6] px-4 py-3'>
            <p className='mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6806f]'>Preferred Colors</p>
            <div className='flex flex-wrap gap-2'>
              {req.colors.map((c) => (
                <span key={c} className='rounded-full border border-[#ead9cf] bg-white px-3 py-1 text-xs font-semibold text-[#6b5048]'>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Customization details */}
        {req.details && (
          <div className='rounded-2xl border border-[#f0e4de] bg-[#fffaf6] px-4 py-4'>
            <p className='text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6806f]'>Your Requirements</p>
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

        {/* Quotation from seller */}
        {req.quotedPrice && (
          <div className='rounded-[20px] border border-purple-200 bg-purple-50 px-4 py-4'>
            <div className='flex items-center gap-2 mb-3'>
              <Send size={14} className='text-purple-600' />
              <p className='text-sm font-bold text-purple-800'>Seller Quotation Received</p>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='rounded-xl bg-white px-3 py-2.5'>
                <p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-purple-500'>Quoted Price</p>
                <p className='mt-1 text-base font-bold text-purple-800'>
                  &#8377;{Number(req.quotedPrice).toLocaleString('en-IN')}
                </p>
              </div>
              {req.deliveryDate && (
                <div className='rounded-xl bg-white px-3 py-2.5'>
                  <p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-purple-500'>Delivery By</p>
                  <p className='mt-1 text-sm font-bold text-purple-800'>{fmtDate(req.deliveryDate)}</p>
                </div>
              )}
            </div>
            {req.sellerResp && (
              <p className='mt-3 text-xs leading-5 text-purple-700 italic'>
                &ldquo;{req.sellerResp}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Approved banner */}
        {req.isApproved && (
          <div className='flex items-start gap-3 rounded-[20px] border border-green-200 bg-green-50 px-4 py-4'>
            <CheckCircle2 size={18} className='mt-0.5 shrink-0 text-green-600' />
            <div>
              <p className='text-sm font-bold text-green-800'>Order Started</p>
              <p className='mt-0.5 text-xs text-green-700'>
                Your customization order is in progress. The seller will update you on production status.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

/* ─── Request card ───────────────────────────────────────────────────────── */
const RequestCard = ({ req, onView }) => {
  const cfg = getStatusCfg(req.status);
  return (
    <div className='rounded-[24px] border border-[#f0e4de] bg-white p-5 shadow-[0_4px_20px_rgba(94,35,23,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(94,35,23,0.12)]'>

      {/* top row */}
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='font-mono text-sm font-bold text-[#7a1e2c]'>{req.crNo}</span>
            <StatusBadge status={req.status} />
          </div>
          <p className='mt-1 text-xs text-[#9b7b69]'>{timeAgo(req.createdAt)}</p>
        </div>
        <button
          type='button'
          onClick={() => onView(req)}
          className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff0e8] text-[#7a1e2c] transition hover:bg-[#fde0d0]'
          title='View details'
        >
          <Eye size={15} />
        </button>
      </div>

      {/* colors */}
      {req.colors.length > 0 && (
        <div className='mt-3 flex flex-wrap gap-1.5'>
          {req.colors.map((c) => (
            <span key={c} className='rounded-full border border-[#ead9cf] bg-[#fffaf6] px-2.5 py-0.5 text-[10px] font-semibold text-[#6b5048]'>
              {c}
            </span>
          ))}
        </div>
      )}

      {/* budget + timeline */}
      <div className='mt-3 flex items-center justify-between border-t border-[#f5ece8] pt-3'>
        <span className='text-xs font-semibold text-[#34160f]'>
          {fmtBudget(req.budgetMin, req.budgetMax)}
        </span>
        <span className='flex items-center gap-1 text-[10px] text-[#b19588]'>
          <Clock3 size={10} />
          {req.timeline || '—'}
        </span>
      </div>

      {/* mini progress bar */}
      <div className='mt-3'>
        <div className='flex items-center gap-1'>
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={[
                'h-1 flex-1 rounded-full transition-all',
                s <= (cfg.step ?? 1) ? 'bg-[#7a1e2c]' : 'bg-[#f0e4de]',
              ].join(' ')}
            />
          ))}
        </div>
        <p className='mt-1 text-[10px] font-semibold text-[#a6806f]'>{cfg.label}</p>
      </div>

      {/* quotation received highlight */}
      {req.quotedPrice && (
        <div className='mt-3 flex items-center justify-between rounded-xl bg-purple-50 px-3 py-2'>
          <span className='text-xs font-semibold text-purple-700'>Quotation received</span>
          <span className='text-sm font-bold text-purple-800'>
            &#8377;{Number(req.quotedPrice).toLocaleString('en-IN')}
          </span>
        </div>
      )}
    </div>
  );
};

/* ─── Main MyRequests component ──────────────────────────────────────────── */
const MyRequests = ({ onNewRequest }) => {
  const customerId  = getCustomerId();
  const connection  = useChatConnection();

  const [rows,        setRows]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selected,    setSelected]    = useState(null);
  const [quotationAlert, setQuotationAlert] = useState(null); // { crNo, amount }
  const fetchedRef = useRef(false);

  const loadList = useCallback(() => {
    setLoading(true);
    getCustomerCustomRequests(customerId)
      .then((res) => {
        const raw = Array.isArray(res?.data) ? res.data
                  : Array.isArray(res)       ? res
                  : [];
        setRows(raw.map(norm));
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [customerId]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    loadList();
  }, [loadList]);

  /* ── SignalR: seller sent a quotation ── */
  useEffect(() => {
    if (!connection) return;

    const handleQuotation = (data) => {
      // Refresh the list so the new quotedPrice appears on the card
      loadList();
      // Show a notification banner
      const crNo   = data?.sCostReqNo ?? data?.crNo ?? '';
      const amount = data?.dQuotedPrice ?? data?.amount ?? null;
      setQuotationAlert({ crNo, amount });
      // Auto-dismiss after 8 seconds
      setTimeout(() => setQuotationAlert(null), 8000);
    };

    // Backend may fire any of these event names
    connection.on('QuotationReceived',        handleQuotation);
    connection.on('CustomizationQuotation',   handleQuotation);
    connection.on('NewQuotationNotification', handleQuotation);

    return () => {
      connection.off('QuotationReceived',        handleQuotation);
      connection.off('CustomizationQuotation',   handleQuotation);
      connection.off('NewQuotationNotification', handleQuotation);
    };
  }, [connection, loadList]);

  const activeCount   = rows.filter((r) => !['completed','rejected'].includes(r.status.toLowerCase())).length;
  const quotedCount   = rows.filter((r) => r.quotedPrice).length;

  return (
    <div className='space-y-6'>

      {/* ── Page header ── */}
      <section className='relative overflow-hidden rounded-[30px] border border-[#efdcd2] bg-gradient-to-br from-[#5a1220] via-[#7a1e2c] to-[#2f0c12] p-6 text-white shadow-[0_28px_80px_rgba(66,18,28,0.22)] sm:p-8'>
        <div className='absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#f5d47c]/10 blur-3xl' />
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.3em] text-[#f5d47c]'>My Customizations</p>
            <h1 className='mt-2 text-2xl font-bold sm:text-3xl'>Your Design Requests</h1>
            <p className='mt-1 text-sm text-white/70'>
              Track all your customization requests and quotations from sellers.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <div className='rounded-2xl bg-white/10 px-5 py-3 text-center backdrop-blur-sm'>
              <p className='text-2xl font-bold'>{rows.length}</p>
              <p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70'>Total</p>
            </div>
            {activeCount > 0 && (
              <div className='rounded-2xl bg-[#f5d47c]/20 px-5 py-3 text-center'>
                <p className='text-2xl font-bold text-[#f5d47c]'>{activeCount}</p>
                <p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f5d47c]/80'>Active</p>
              </div>
            )}
            <button
              type='button'
              onClick={loadList}
              className='flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20'
              title='Refresh'
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* flow steps */}
        <div className='mt-5 flex flex-wrap items-center gap-2 text-xs text-white/60'>
          {['Submit Request', 'Seller Reviews', 'Get Quotation', 'Order Starts', 'Completed'].map((step, i, arr) => (
            <span key={step} className='flex items-center gap-2'>
              <span className='rounded-full bg-white/15 px-3 py-1 font-semibold text-white/90'>{step}</span>
              {i < arr.length - 1 && <ChevronRight size={11} />}
            </span>
          ))}
        </div>
      </section>

      {/* ── Quotation received alert (SignalR live) ── */}
      {quotationAlert && (
        <div className='flex items-start gap-3 rounded-2xl border border-purple-300 bg-purple-50 px-4 py-4 shadow-md'>
          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600'>
            <Bell size={16} />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-bold text-purple-900'>
              Quotation received{quotationAlert.crNo ? ` for ${quotationAlert.crNo}` : ''}!
            </p>
            <p className='mt-0.5 text-xs text-purple-700'>
              {quotationAlert.amount
                ? `The seller has quoted ₹${Number(quotationAlert.amount).toLocaleString('en-IN')}. Tap the card to review.`
                : 'The seller has sent you a quotation. Tap the card to review.'}
            </p>
          </div>
          <button
            type='button'
            onClick={() => setQuotationAlert(null)}
            className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200'
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── Quotation pending alert (from list data) ── */}
      {quotedCount > 0 && !quotationAlert && (
        <div className='flex items-center gap-3 rounded-2xl border border-purple-200 bg-purple-50 px-4 py-3'>
          <Send size={16} className='shrink-0 text-purple-600' />
          <p className='text-sm font-semibold text-purple-800'>
            {quotedCount} quotation{quotedCount > 1 ? 's' : ''} received from seller — tap a card to review.
          </p>
        </div>
      )}

      {/* ── New request CTA ── */}
      {onNewRequest && (
        <button
          type='button'
          onClick={onNewRequest}
          className='inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#ead9cf] bg-white py-4 text-sm font-semibold text-[#7a1e2c] transition hover:border-[#7a1e2c] hover:bg-[#fff1e7]'
        >
          <Palette size={16} />
          Submit a New Customization Request
        </button>
      )}

      {/* ── List ── */}
      {loading ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-44 animate-pulse rounded-[24px] bg-[#f5ece8]' />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-[28px] border border-[#f0e4de] bg-white py-20 text-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0e8]'>
            <Palette size={24} className='text-[#7a1e2c]' />
          </div>
          <p className='mt-4 text-base font-bold text-[#34160f]'>No requests yet</p>
          <p className='mt-2 text-sm text-[#9b7b69]'>
            Click a product with the Customize badge to submit your first request.
          </p>
          {onNewRequest && (
            <button
              type='button'
              onClick={onNewRequest}
              className='mt-5 inline-flex items-center gap-2 rounded-full bg-[#7a1e2c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#651623]'
            >
              <Palette size={15} /> Start Customizing
            </button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {rows.map((r) => (
            <RequestCard key={r.id} req={r} onView={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <DetailDrawer req={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default MyRequests;
