import {
  postApiWithAuthorization,
  getApiWithAuthorization,
  putApiWithAuthorization,
} from '../../services/auth/ApiMethod';
import { Base_Url } from '../../BaseURL/BaseUrl';

/** Read seller/user id from localStorage */
const getLoginUserId = () => {
  try {
    const d = JSON.parse(localStorage.getItem('login') || '{}');
    return d?.userId ?? d?.UserId ?? d?.iUserId ?? null;
  } catch {
    return null;
  }
};

/**
 * Buyer: Submit a new customization request.
 * POST /api/customization/submit  (multipart/form-data)
 * Fields: iCustomerId, iSellerId, iProductId, sCustomizationDetails,
 *         dMinBudget, dMaxBudget, sPreferredColors, sTimeline
 * DB trigger auto-generates sCostReqNo and inserts seller notification.
 */
export const submitCustomDesignRequest = (data) =>
  postApiWithAuthorization(`${Base_Url}api/customization/submit`, data);

/**
 * GET /api/customization/list?sellerId={id}
 * Seller dashboard — lists requests assigned to this seller.
 */
export const getCustomizationList = (sellerId) => {
  const id = sellerId ?? getLoginUserId() ?? '';
  return getApiWithAuthorization(
    `${Base_Url}api/customization/list?sellerId=${id}`,
  );
};

// Alias kept for backward-compat
export const getSellerCustomRequests = (sellerId) =>
  getCustomizationList(sellerId);

/**
 * GET /api/customization/list?customerId={id}
 * Customer dashboard — lists requests submitted by this buyer.
 */
export const getCustomerCustomRequests = (customerId) => {
  const id = customerId ?? getLoginUserId() ?? '';
  return getApiWithAuthorization(
    `${Base_Url}api/customization/list?customerId=${id}`,
  );
};

// Seller: send quotation for a customization request
// PUT /api/customization/quotation
// Body: { iCustomizationRequestId, dQuotedPrice, dExpectedDeliveryDate, sSellerResponse }
export const sendCustomRequestQuotation = (requestId, data) =>
  putApiWithAuthorization(`${Base_Url}api/customization/quotation`, {
    iCustomizationRequestId: requestId,
    dQuotedPrice:            Number(data.amount ?? data.dQuotedPrice ?? 0),
    dExpectedDeliveryDate:   data.dExpectedDeliveryDate ?? data.deliveryDate ?? new Date().toISOString(),
    sSellerResponse:         data.note ?? data.sSellerResponse ?? '',
  });

// Seller: approve a customization request → starts the order
// PUT /api/customization/approve/{requestId}  (no body)
// Response: { statusCode: 200, message: "Quotation approved. Customization order started.", requestId }
export const approveCustomization = (requestId) =>
  putApiWithAuthorization(`${Base_Url}api/customization/approve/${requestId}`, {});

// Seller: update progress status of a customization request
// PUT /api/customization/status
// Body: { iCustomizationRequestId, sStatus }
// Response: { statusCode: 200, message: "Status updated successfully." }
export const updateCustomizationStatus = (requestId, sStatus) =>
  putApiWithAuthorization(`${Base_Url}api/customization/status`, {
    iCustomizationRequestId: requestId,
    sStatus,
  });
