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
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    for (const nestedValue of Object.values(value)) {
      if (Array.isArray(nestedValue)) {
        return nestedValue;
      }
    }
  }

  return [];
};

const normalizeCategoryOptions = (response) => {
  const rawList = getFirstArray(response?.data) || getFirstArray(response?.responseData) || getFirstArray(response);

  return rawList
    .map((item, index) => {
      const value =
        item?.iCategoryId ??
        item?.categoryId ??
        item?.value ??
        item?.id ??
        item?.KeyId ??
        item?.iId;

      const label =
        item?.sCategoryName ??
        item?.categoryName ??
        item?.sName ??
        item?.name ??
        item?.label ??
        item?.Value;

      if (value === undefined || value === null || !label) {
        return null;
      }

      return {
        value: String(value),
        label: String(label),
        sortOrder: item?.iDisplayOrder ?? item?.displayOrder ?? index,
      };
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

  const selectedCategory = categoryOptions.find(
    (item) => item.value === String(formState.categoryId)
  );

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
    weave:
      formState.description.trim() ||
      "Seller-added product description will appear here.",
    description:
      formState.description.trim() ||
      "Seller-added product description will appear here.",
    isCustomizationAvailable: formState.isCustomizationAvailable === "true",
    status: fallbackProduct?.status || "Active",
    images: baseImages,
  };
};

const AddUpdateProduct = ({
  open,
  mode = "add",
  product = null,
  products = [],
  onClose,
  onSaveProduct,
}) => {
  const [formState, setFormState] = useState(emptyForm);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const hasFetchedCategoriesRef = useRef(false);

  useEffect(() => {
    if (open) {
      setFormState(buildFormState(product));
    }
  }, [product, open]);

  useEffect(() => {
    if (!open) {
      hasFetchedCategoriesRef.current = false;
      return;
    }

    if (hasFetchedCategoriesRef.current) {
      return;
    }

    const fetchCategories = async () => {
      try {
        hasFetchedCategoriesRef.current = true;
        setCategoryLoading(true);
        const response = await GetProductCategories();
        setCategoryOptions(normalizeCategoryOptions(response));
      } catch (error) {
        hasFetchedCategoriesRef.current = false;
        showApiError(
          error?.response?.data || {
            message: "Unable to load categories right now.",
          }
        );
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, [open]);

  const categoryPlaceholder = useMemo(() => {
    if (categoryLoading) {
      return "Loading categories...";
    }

    return categoryOptions.length > 0 ? "Select category" : "No categories found";
  }, [categoryLoading, categoryOptions.length]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState((current) => {
      if (name === "categoryId") {
        const selectedCategory = categoryOptions.find((item) => item.value === value);
        return {
          ...current,
          categoryId: value,
          categoryLabel: selectedCategory?.label || "",
        };
      }

      return { ...current, [name]: value };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextProduct = buildProductPayload(
      formState,
      product,
      products,
      categoryOptions
    );

    onSaveProduct(nextProduct, mode);
  };

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
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white text-[#7a1e2c] shadow-sm transition hover:bg-[#f8ede7]"
            aria-label="Close product form"
          >
            <X size={18} />
          </button>
        </div>

        <form className="grid gap-6 px-5 py-5 sm:px-7 sm:py-7 lg:grid-cols-[1.1fr_0.9fr]" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="seller-label" htmlFor="productName">Product Name</label>
              <input
                id="productName"
                name="productName"
                value={formState.productName}
                onChange={handleChange}
                className="seller-input"
                placeholder="Enter Paithani product name"
              />
            </div>

            <div>
              <label className="seller-label" htmlFor="categoryId">Category</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formState.categoryId}
                onChange={handleChange}
                className="seller-select"
              >
                <option value="">{categoryPlaceholder}</option>
                {categoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="seller-label" htmlFor="color">Color</label>
              <input
                id="color"
                name="color"
                value={formState.color}
                onChange={handleChange}
                className="seller-input"
                placeholder="Mulberry and Gold"
              />
            </div>

            <div>
              <label className="seller-label" htmlFor="fabric">Fabric</label>
              <input
                id="fabric"
                name="fabric"
                value={formState.fabric}
                onChange={handleChange}
                className="seller-input"
                placeholder="Pure Silk"
              />
            </div>

            <div>
              <label className="seller-label" htmlFor="designType">Design Type</label>
              <input
                id="designType"
                name="designType"
                value={formState.designType}
                onChange={handleChange}
                className="seller-input"
                placeholder="Peacock Border"
              />
            </div>

            <div>
              <label className="seller-label" htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                value={formState.price}
                onChange={handleChange}
                className="seller-input"
                placeholder="48500"
              />
            </div>

            <div>
              <label className="seller-label" htmlFor="stock">Available Stock</label>
              <input
                id="stock"
                name="stock"
                value={formState.stock}
                onChange={handleChange}
                className="seller-input"
                placeholder="4"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="seller-label">Customization Available</label>
              <div className="mt-2 flex flex-wrap gap-3">
                <label className="flex items-center gap-3 rounded-[14px] border border-[#e9d8ce] bg-white px-4 py-3 text-sm font-medium text-[#381c17]">
                  <input
                    type="radio"
                    name="isCustomizationAvailable"
                    value="true"
                    checked={formState.isCustomizationAvailable === "true"}
                    onChange={handleChange}
                    className="accent-[#7a1e2c]"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-3 rounded-[14px] border border-[#e9d8ce] bg-white px-4 py-3 text-sm font-medium text-[#381c17]">
                  <input
                    type="radio"
                    name="isCustomizationAvailable"
                    value="false"
                    checked={formState.isCustomizationAvailable === "false"}
                    onChange={handleChange}
                    className="accent-[#7a1e2c]"
                  />
                  No
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="seller-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                className="seller-textarea min-h-[120px]"
                placeholder="Write a short product description for the seller catalogue."
              />
            </div>
          </div>

          <div className="seller-soft-panel rounded-[18px] p-5 sm:p-6">
            <div className="flex min-h-[220px] items-center justify-center rounded-[16px] border border-dashed border-[#d8b8ab] bg-white/80 px-4 py-6">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#fff1e7] text-[#7a1e2c]">
                  <ImagePlus size={24} />
                </div>
                <p className="mt-4 text-sm font-semibold text-[#381c17]">Upload up to 5 product images</p>
                <p className="mt-2 max-w-[260px] text-sm leading-6 text-[#7a645b]">
                  Keep this area for main image plus 4 gallery images while the image upload API is still pending.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {imageSlots.map((label, index) => (
                <div key={label} className="rounded-[16px] border border-[#e9d8ce] bg-white px-3 py-4 text-center text-xs font-semibold text-[#7d655d]">
                  <p>{label}</p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#b08c78]">Slot {index + 1}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3 border-t border-[#f1dfd7] pt-2 sm:flex-row sm:justify-end">
            <SellerButton type="submit" className="min-h-[38px] rounded-[12px] px-4 text-sm sm:w-auto">
              {mode === "edit" ? "Update Product" : "Save Product"}
            </SellerButton>
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
