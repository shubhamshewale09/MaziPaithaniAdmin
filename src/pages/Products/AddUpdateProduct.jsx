import React, { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { sellerProducts } from "../../data/sellerStaticData";
import { SellerButton } from "../../components/seller/SellerUI";
import { GetProductCategories } from "../../services/Product/ProductApi";
import { showApiError } from "../../Utils/Utils";

const emptyForm = {
  id: "",
  iProductId: null,
  productName: "",
  categoryId: "",
  categoryLabel: "",
  price: "",
  stock: "",
  color: "",
  fabric: "",
  designType: "",
  description: "",
  isCustomizationAvailable: "false",
};

const imageSlots = ["Main Image", "Gallery 2", "Gallery 3", "Gallery 4", "Gallery 5"];
const MAX_IMAGE_WIDTH = 1600;
const MAX_IMAGE_HEIGHT = 1600;
const IMAGE_OUTPUT_QUALITY = 0.8;

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(objectUrl); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("Unable to read selected image.")); };
    image.src = objectUrl;
  });

const canvasToFile = (canvas, fileName, fileType) =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error("Unable to process selected image.")); return; }
      resolve(new File([blob], fileName, { type: fileType }));
    }, fileType, IMAGE_OUTPUT_QUALITY);
  });

const compressImageFile = async (file) => {
  if (!file.type.startsWith("image/")) return file;
  const image = await loadImage(file);
  const scaleRatio = Math.min(MAX_IMAGE_WIDTH / image.width, MAX_IMAGE_HEIGHT / image.height, 1);
  const nextWidth = Math.round(image.width * scaleRatio);
  const nextHeight = Math.round(image.height * scaleRatio);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return file;
  canvas.width = nextWidth;
  canvas.height = nextHeight;
  context.drawImage(image, 0, 0, nextWidth, nextHeight);
  const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const normalizedName = file.name.replace(/\.[^/.]+$/, "");
  const outputName = outputType === "image/png" ? `${normalizedName}.png` : `${normalizedName}.jpg`;
  return canvasToFile(canvas, outputName, outputType);
};

const buildFormState = (product) => ({
  id: product?.id || "",
  iProductId: product?.iProductId ?? null,
  productName: product?.name || "",
  categoryId: product?.iCategoryId ? String(product.iCategoryId) : "",
  categoryLabel: product?.category || "",
  price: product?.price ? String(product.price) : "",
  stock: product?.stock !== undefined ? String(product.stock) : "",
  color: product?.color || product?.palette || "",
  fabric: product?.fabric || "",
  designType: product?.designType || "",
  description: product?.weave || "",
  isCustomizationAvailable: product?.isCustomizationAvailable ? "true" : "false",
});

const createProductId = (products) => {
  const highestId = products.reduce((maxId, product) => {
    const numericPart = Number(product.id?.replace(/[^0-9]/g, "")) || 0;
    return Math.max(maxId, numericPart);
  }, 100);
  return `PRD-${highestId + 1}`;
};

const getFirstArray = (value) => {
  if (Array.isArray(value) && value.length > 0) return value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const nestedValue of Object.values(value)) {
      if (Array.isArray(nestedValue) && nestedValue.length > 0) return nestedValue;
    }
  }
  return null;
};

const normalizeCategoryOptions = (response) => {
  const rawList = getFirstArray(response?.data) ?? getFirstArray(response?.responseData) ?? getFirstArray(response?.categories) ?? getFirstArray(response) ?? [];
  return rawList
    .map((item, index) => {
      const value = item?.iCategoryId ?? item?.categoryId ?? item?.value ?? item?.id ?? item?.KeyId ?? item?.iId;
      const label = item?.sCategoryName ?? item?.categoryName ?? item?.sName ?? item?.name ?? item?.label ?? item?.Value;
      if (value === undefined || value === null || !label) return null;
      return { value: String(value), label: String(label), sortOrder: item?.iDisplayOrder ?? item?.displayOrder ?? index };
    })
    .filter(Boolean)
    .sort((left, right) => left.sortOrder - right.sortOrder);
};

const buildProductPayload = (formState, fallbackProduct, products, categoryOptions) => {
  const baseImages = fallbackProduct?.images || [
    { label: "Front View", src: sellerProducts[0].images[0].src },
    { label: "Pallu Detail", src: sellerProducts[0].images[1].src },
    { label: "Border Closeup", src: sellerProducts[0].images[2].src },
  ];
  const selectedCategory = categoryOptions.find((item) => item.value === String(formState.categoryId));
  return {
    id: fallbackProduct?.id || createProductId(products),
    iProductId: formState.iProductId,
    iCategoryId: Number(formState.categoryId) || null,
    name: formState.productName.trim() || "Untitled Paithani",
    category: selectedCategory?.label || formState.categoryLabel || "Category",
    stock: Number(formState.stock) || 0,
    price: Number(formState.price) || 0,
    color: formState.color.trim(),
    palette: formState.color.trim() || "Custom palette",
    fabric: formState.fabric.trim(),
    designType: formState.designType.trim(),
    weave: formState.description.trim() || "Seller-added product description will appear here.",
    description: formState.description.trim() || "Seller-added product description will appear here.",
    isCustomizationAvailable: formState.isCustomizationAvailable === "true",
    status: fallbackProduct?.status || "Active",
    images: baseImages,
  };
};

const FieldError = ({ error }) =>
  error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null;

const AddUpdateProduct = ({
  open,
  mode = "add",
  product = null,
  products = [],
  onClose,
  onSaveProduct,
  onUploadImages,
  onUpdateImage,
}) => {
  const [formState, setFormState] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [singleImageFiles, setSingleImageFiles] = useState({});
  const [singleImagePreviews, setSingleImagePreviews] = useState({});
  const [savedProduct, setSavedProduct] = useState(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isPreparingImages, setIsPreparingImages] = useState(false);
  const [updatingImageIndex, setUpdatingImageIndex] = useState(null);
  const hasFetchedCategoriesRef = useRef(false);

  useEffect(() => {
    if (open) {
      setFormState(buildFormState(product));
      setFormErrors({});
      setSavedProduct(product);
      setSingleImageFiles({});
      setSingleImagePreviews({});
    }
  }, [product, open]);

  useEffect(() => {
    return () => {
      Object.values(singleImagePreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [singleImagePreviews]);

  useEffect(() => {
    if (!open) { hasFetchedCategoriesRef.current = false; return; }
    if (hasFetchedCategoriesRef.current) return;
    const fetchCategories = async () => {
      try {
        hasFetchedCategoriesRef.current = true;
        setCategoryLoading(true);
        const response = await GetProductCategories();
        setCategoryOptions(normalizeCategoryOptions(response));
      } catch (error) {
        hasFetchedCategoriesRef.current = false;
        showApiError(error?.response?.data || { message: "Unable to load categories right now." });
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, [open]);

  const categoryPlaceholder = useMemo(() => {
    if (categoryLoading) return "Loading categories...";
    return categoryOptions.length > 0 ? "Select category" : "No categories found";
  }, [categoryLoading, categoryOptions.length]);

  const canUploadImages = mode === "edit" || Boolean(savedProduct?.iProductId);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormErrors((e) => ({ ...e, [name]: "" }));
    setFormState((current) => {
      if (name === "categoryId") {
        const selectedCategory = categoryOptions.find((item) => item.value === value);
        return { ...current, categoryId: value, categoryLabel: selectedCategory?.label || "" };
      }
      return { ...current, [name]: value };
    });
  };

  const handleSaveProductDetails = async (event) => {
    event.preventDefault();
    if (mode === "add") {
      const errors = {};
      if (!formState.productName.trim()) errors.productName = "Product name is required.";
      if (!formState.categoryId) errors.categoryId = "Category is required.";
      if (!formState.color.trim()) errors.color = "Color is required.";
      if (!formState.price || Number(formState.price) <= 0) errors.price = "Valid price is required.";
      if (formState.stock === "" || Number(formState.stock) < 0) errors.stock = "Stock is required.";
      if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    }
    const nextProduct = buildProductPayload(formState, product, products, categoryOptions);
    setIsSavingProduct(true);
    try {
      const response = await onSaveProduct(nextProduct, mode);
      if (response) {
        setSavedProduct(response);
        setFormState(buildFormState(response));
        if (mode === "edit") onClose();
      }
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleUploadSelectedImages = async () => {
    const productId = savedProduct?.iProductId ?? formState.iProductId;
    const files = imageSlots.map((_, index) => singleImageFiles[index]).filter(Boolean);
    if (mode === "add" && files.length < 2) {
      setFormErrors((e) => ({ ...e, images: "Please select at least 2 images before uploading." }));
      return;
    }
    setIsUploadingImages(true);
    try {
      const isSuccess = await onUploadImages(productId, files);
      if (isSuccess) {
        setSingleImageFiles({});
        Object.values(singleImagePreviews).forEach((url) => URL.revokeObjectURL(url));
        setSingleImagePreviews({});
        setFormErrors((e) => ({ ...e, images: "" }));
      }
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleSingleImageSelection = async (event, index) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setSingleImageFiles((current) => ({ ...current, [index]: file }));
      setSingleImagePreviews((current) => {
        if (current[index]) URL.revokeObjectURL(current[index]);
        return { ...current, [index]: URL.createObjectURL(file) };
      });
      if (mode === "add") setFormErrors((e) => ({ ...e, images: "" }));
    } catch (error) {
      showApiError(error?.message || "Unable to process selected image.");
    }
  };

  const handleUpdateSingleImage = async (index) => {
    const targetFile = singleImageFiles[index];
    const targetImage = savedProduct?.images?.[index];
    if (!targetFile) { showApiError("Please select an image first."); return; }
    setUpdatingImageIndex(index);
    try {
      const isSuccess = await onUpdateImage(savedProduct?.iProductId, targetImage?.imageId, targetFile, index, targetImage?.src);
      if (isSuccess) {
        setSavedProduct((current) => {
          if (!current) return current;
          return {
            ...current,
            images: current.images.map((image, imageIndex) =>
              imageIndex === index ? { ...image, src: singleImagePreviews[index] || image.src } : image
            ),
          };
        });
        setSingleImageFiles((current) => { const n = { ...current }; delete n[index]; return n; });
        setSingleImagePreviews((current) => {
          const n = { ...current };
          if (n[index]) { URL.revokeObjectURL(n[index]); delete n[index]; }
          return n;
        });
      }
    } finally {
      setUpdatingImageIndex(null);
    }
  };

  const selectedImageCount = Object.keys(singleImageFiles).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#2d140f]/45 px-4 py-8 backdrop-blur-[3px] sm:py-12">
      <div className="w-full max-w-5xl rounded-[22px] border border-[#ead8cf] bg-[#fffaf6] shadow-[0_30px_80px_rgba(45,20,15,0.22)]">
        <div className="flex items-center justify-between gap-4 border-b border-[#f1dfd7] px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#a27c68]">Seller Product Form</p>
            <h2 className="mt-2 text-2xl font-bold text-[#381c17] sm:text-[1.8rem]">
              {mode === "edit" ? "Edit Product" : "Add Product"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white text-[#7a1e2c] shadow-sm transition hover:bg-[#f8ede7]" aria-label="Close product form">
            <X size={18} />
          </button>
        </div>

        <form className="grid gap-6 px-5 py-5 sm:px-7 sm:py-7 lg:grid-cols-[1.1fr_0.9fr]" onSubmit={handleSaveProductDetails}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="seller-label" htmlFor="productName">Product Name <span className="text-red-500">*</span></label>
              <input
                id="productName" name="productName" value={formState.productName} onChange={handleChange}
                className={`seller-input${formErrors.productName ? " ring-2 ring-red-400" : ""}`}
                placeholder="Enter Paithani product name"
              />
              <FieldError error={formErrors.productName} />
            </div>

            <div>
              <label className="seller-label" htmlFor="categoryId">Category <span className="text-red-500">*</span></label>
              <select
                id="categoryId" name="categoryId" value={formState.categoryId} onChange={handleChange}
                className={`seller-select${formErrors.categoryId ? " ring-2 ring-red-400" : ""}`}
              >
                <option value="">{categoryPlaceholder}</option>
                {categoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
              <FieldError error={formErrors.categoryId} />
            </div>

            <div>
              <label className="seller-label" htmlFor="color">Color <span className="text-red-500">*</span></label>
              <input
                id="color" name="color" value={formState.color} onChange={handleChange}
                className={`seller-input${formErrors.color ? " ring-2 ring-red-400" : ""}`}
                placeholder="Mulberry and Gold"
              />
              <FieldError error={formErrors.color} />
            </div>

            <div>
              <label className="seller-label" htmlFor="fabric">Fabric</label>
              <input id="fabric" name="fabric" value={formState.fabric} onChange={handleChange} className="seller-input" placeholder="Pure Silk" />
            </div>

            <div>
              <label className="seller-label" htmlFor="designType">Design Type</label>
              <input id="designType" name="designType" value={formState.designType} onChange={handleChange} className="seller-input" placeholder="Peacock Border" />
            </div>

            <div>
              <label className="seller-label" htmlFor="price">Price <span className="text-red-500">*</span></label>
              <input
                id="price" name="price" value={formState.price} onChange={handleChange}
                className={`seller-input${formErrors.price ? " ring-2 ring-red-400" : ""}`}
                placeholder="48500"
              />
              <FieldError error={formErrors.price} />
            </div>

            <div>
              <label className="seller-label" htmlFor="stock">Available Stock <span className="text-red-500">*</span></label>
              <input
                id="stock" name="stock" value={formState.stock} onChange={handleChange}
                className={`seller-input${formErrors.stock ? " ring-2 ring-red-400" : ""}`}
                placeholder="4"
              />
              <FieldError error={formErrors.stock} />
            </div>

            <div className="sm:col-span-2">
              <label className="seller-label">Customization Available</label>
              <div className="mt-2 flex flex-wrap gap-3">
                <label className="flex items-center gap-3 rounded-[14px] border border-[#e9d8ce] bg-white px-4 py-3 text-sm font-medium text-[#381c17]">
                  <input type="radio" name="isCustomizationAvailable" value="true" checked={formState.isCustomizationAvailable === "true"} onChange={handleChange} className="accent-[#7a1e2c]" />
                  Yes
                </label>
                <label className="flex items-center gap-3 rounded-[14px] border border-[#e9d8ce] bg-white px-4 py-3 text-sm font-medium text-[#381c17]">
                  <input type="radio" name="isCustomizationAvailable" value="false" checked={formState.isCustomizationAvailable === "false"} onChange={handleChange} className="accent-[#7a1e2c]" />
                  No
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="seller-label" htmlFor="description">Description</label>
              <textarea
                id="description" name="description" value={formState.description} onChange={handleChange}
                className="seller-textarea min-h-[120px]"
                placeholder="Write a short product description for the seller catalogue."
              />
            </div>
          </div>

          {canUploadImages ? (
            <div className="seller-soft-panel rounded-[18px] p-5 sm:p-6">
              <div className="flex min-h-[220px] items-center justify-center rounded-[16px] border border-dashed border-[#d8b8ab] bg-white/80 px-4 py-6">
                <div className="w-full text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#fff1e7] text-[#7a1e2c]">
                    <ImagePlus size={24} />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-[#381c17]">
                    Upload up to 5 product images {mode === "add" ? <span className="text-red-500">(min. 2 required)</span> : null}
                  </p>
                  <p className="mx-auto mt-2 max-w-[260px] text-sm leading-6 text-[#7a645b]">
                    {mode === "edit" ? "Update one image at a time for this product." : "Select images per slot below, or use bulk select to fill all slots at once."}
                  </p>
                  {mode !== "edit" ? (
                    <>
                      <input
                        type="file" accept="image/*" multiple
                        onChange={async (event) => {
                          const files = Array.from(event.target.files || []).slice(0, imageSlots.length);
                          if (!files.length) return;
                          setIsPreparingImages(true);
                          try {
                            const processed = await Promise.all(files.map(compressImageFile));
                            Object.values(singleImagePreviews).forEach((url) => URL.revokeObjectURL(url));
                            const nextFiles = {};
                            const nextPreviews = {};
                            processed.forEach((file, i) => { nextFiles[i] = file; nextPreviews[i] = URL.createObjectURL(file); });
                            setSingleImageFiles(nextFiles);
                            setSingleImagePreviews(nextPreviews);
                            setFormErrors((e) => ({ ...e, images: "" }));
                          } catch (error) {
                            showApiError(error?.message || "Unable to process selected images.");
                          } finally {
                            setIsPreparingImages(false);
                            event.target.value = "";
                          }
                        }}
                        className="mt-4 block w-full cursor-pointer text-sm text-[#6f5a53] file:mr-4 file:cursor-pointer file:rounded-[12px] file:border-0 file:bg-[#7a1e2c] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                      />
                      {isPreparingImages ? (
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#a27c68]">Optimizing images...</p>
                      ) : null}
                      {formErrors.images ? (
                        <p className="mt-2 text-xs font-semibold text-red-500">{formErrors.images}</p>
                      ) : null}
                    </>
                  ) : null}
                  {savedProduct?.iProductId ? (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#a27c68]">Product ID: {savedProduct.iProductId}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {imageSlots.map((label, index) => {
                  const file = singleImageFiles[index];
                  const previewUrl = mode === "edit"
                    ? singleImagePreviews[index] || savedProduct?.images?.[index]?.src
                    : singleImagePreviews[index];

                  return (
                    <div key={label} className="overflow-hidden rounded-[16px] border border-[#e9d8ce] bg-white text-center text-xs font-semibold text-[#7d655d]">
                      {previewUrl ? (
                        <img src={previewUrl} alt={label} className="h-28 w-full object-cover" />
                      ) : (
                        <div className="flex h-28 items-center justify-center bg-[#faf3ee] text-[#b08c78]">
                          <ImagePlus size={20} />
                        </div>
                      )}
                      <div className="px-3 py-4">
                        <p>{label}</p>
                        <p className="mt-1 truncate text-[10px] font-medium uppercase tracking-[0.12em] text-[#b08c78]">
                          {file ? file.name : `Slot ${index + 1}`}
                        </p>
                        <div className="mt-3">
                          <input
                            type="file" accept="image/*"
                            onChange={(event) => handleSingleImageSelection(event, index)}
                            className="block w-full cursor-pointer text-[10px] text-[#6f5a53] file:mr-2 file:cursor-pointer file:rounded-[10px] file:border-0 file:bg-[#f3dfd6] file:px-3 file:py-1.5 file:font-semibold file:text-[#7a1e2c]"
                          />
                          {mode === "edit" ? (
                            <SellerButton
                              type="button" variant="secondary"
                              disabled={!singleImageFiles[index] || updatingImageIndex === index}
                              className="mt-2 min-h-[32px] w-full rounded-[10px] px-3 text-[11px]"
                              onClick={() => handleUpdateSingleImage(index)}
                            >
                              {updatingImageIndex === index ? "Updating..." : "Update Image"}
                            </SellerButton>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="seller-soft-panel flex items-center justify-center rounded-[18px] p-5 text-center sm:p-6">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#fff1e7] text-[#7a1e2c]">
                  <ImagePlus size={24} />
                </div>
                <p className="mt-4 text-sm font-semibold text-[#381c17]">Save product details first</p>
                <p className="mx-auto mt-2 max-w-[260px] text-sm leading-6 text-[#7a645b]">
                  After the product is saved and the product ID is created, image upload options will appear here.
                </p>
              </div>
            </div>
          )}

          <div className="lg:col-span-2 flex flex-col gap-3 border-t border-[#f1dfd7] pt-2 sm:flex-row sm:justify-end">
            {!savedProduct?.iProductId || mode === "edit" ? (
              <SellerButton type="submit" disabled={isSavingProduct} className="min-h-[38px] rounded-[12px] px-4 text-sm sm:w-auto">
                {isSavingProduct ? "Saving..." : "Save Product Details"}
              </SellerButton>
            ) : null}
            {canUploadImages && mode !== "edit" ? (
              <SellerButton
                type="button" variant="secondary"
                disabled={!savedProduct?.iProductId || selectedImageCount === 0 || isUploadingImages || isPreparingImages}
                className="min-h-[38px] rounded-[12px] px-4 text-sm sm:w-auto"
                onClick={handleUploadSelectedImages}
              >
                {isUploadingImages ? "Saving Images..." : "Save Images"}
              </SellerButton>
            ) : null}
            <SellerButton type="button" variant="ghost" className="min-h-[38px] rounded-[12px] px-4 text-sm sm:w-auto" onClick={onClose}>
              Cancel
            </SellerButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUpdateProduct;
