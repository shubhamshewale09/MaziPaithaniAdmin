const API_LOADER_EVENT = "paithani:api-loader";

let activeRequests = 0;

const emitLoaderState = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(API_LOADER_EVENT, {
      detail: {
        isLoading: activeRequests > 0,
      },
    })
  );
};

export const startApiLoader = () => {
  activeRequests += 1;
  emitLoaderState();
};

export const stopApiLoader = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  emitLoaderState();
};

export { API_LOADER_EVENT };
