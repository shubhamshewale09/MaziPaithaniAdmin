import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Minus,
  Package,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import ConfirmationModal from "../../components/custom/ConfirmationModal";
import Loader from "../../components/custom/Loader";
import MetaTitle from "../../components/custom/MetaTitle";
import { sellerProducts } from "../../data/sellerStaticData";
import AddUpdateProduct from "./AddUpdateProduct";
import {
  SellerBadge,
  SellerButton,
  SellerEmptyState,
  SellerPageShell,
  SellerSearchField,
  SellerSectionCard,
  SellerStatCard,
} from "../../components/seller/SellerUI";
import {
  GetProductCategories,
  DeleteProductDetails,
  GetAllProductData,
  SaveProductDetails,
  UpdateProductDetails,
  UpdateProductImage,
  UploadProductImages,
  UpdateStock,
} from "../../services/Product/ProductApi";
import { showApiError, showApiSuccess } from "../../Utils/Utils";

const formatCurrency = (value) => `Rs ${value.toLocaleString("en-IN")}`;

const getLoginData = () => {
  try {
    return JSON.parse(localStorage.getItem("login") || "{}");
  } catch (error) {
    return {};
  }
};

const getSellerIdFromLogin = () => {
  const loginData = getLoginData();
  return (
    loginData?.iSellerId ??
    loginData?.sellerId ??
    loginData?.SellerId ??
    null
  );
};

const getUserIdFromLogin = () => {
  const loginData = getLoginData();
  return (
    loginData?.userId ??
    loginData?.UserId ??
    localStorage.getItem("UserId") ??
    null
  );
};

const getResponseMessage = (response) =>
  response?.message ||
  response?.responseData?.message ||
  response?.data?.message ||
  "";

const getResponseProductId = (response, fallbackProductId) =>
  response?.productId ??
  response?.data?.productId ??
  response?.responseData?.productId ??
  response?.data?.iProductId ??
  response?.responseData?.iProductId ??
  response?.iProductId ??
  fallbackProductId;

const getFirstArray = (value) => {
  if (Array.isArray(value) && value.length > 0) {
    return value;
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const nestedValue of Object.values(value)) {
      if (Array.isArray(nestedValue) && nestedValue.length > 0) {
        return nestedValue;
      }
    }
  }

  return null;
};

const normalizeImageUrl = (value) => {
  if (!value || typeof value !== "string") {
    return value;
  }

  return value.replace(
    "http://majhipaithani-api.onrender.com/",
    "https://majhipaithani-api.onrender.com/"
  );
};

const getProductImageList = (product) => {
  const rawImages =
    getFirstArray(product?.images) ??
    getFirstArray(product?.productImages) ??
    getFirstArray(product?.Files) ??
    [];

  const mappedImages = rawImages
    .map((image, index) => {
      const src =
        image?.src ??
        image?.sImageUrl ??
        image?.sImagePath ??
        image?.imagePath ??
        image?.sFilePath ??
        image?.filePath ??
        image?.url ??
        image?.ImageUrl;

      if (!src) {
        return null;
      }

      return {
        imageId:
          image?.imageId ??
          image?.iImageId ??
          image?.ImageId ??
          image?.id ??
          null,
        label:
          image?.label ||
          image?.sImageTitle ||
          (image?.bIsPrimary ? "Main Image" : `Gallery ${index + 1}`),
        src: normalizeImageUrl(src),
      };
    })
    .filter(Boolean);

  return mappedImages.length > 0
    ? mappedImages
    : [
        { label: "Front View", src: sellerProducts[0].images[0].src },
        { label: "Pallu Detail", src: sellerProducts[0].images[1].src },
        { label: "Border Closeup", src: sellerProducts[0].images[2].src },
      ];
};

const normalizeApiProducts = (response, categoryMap = {}) => {
  const rawProducts =
    getFirstArray(response?.data) ??
    getFirstArray(response?.responseData) ??
    getFirstArray(response?.products) ??
    getFirstArray(response) ??
    [];

  return rawProducts
    .filter((product) => product?.bIsDeleted !== true)
    .map((product, index) => {
    const productId =
      product?.iProductId ??
      product?.productId ??
      product?.ProductId ??
      product?.id ??
      index + 1;

    const price = Number(
      product?.dcBasePrice ?? product?.price ?? product?.basePrice ?? 0
    );
    const stock = Number(product?.productstock ?? product?.iStock ?? product?.stock ?? 0);
    const color = product?.sColor ?? product?.color ?? product?.palette ?? "";
    const description =
      product?.sDescription ?? product?.description ?? product?.weave ?? "";

    return {
      id: `PRD-${productId}`,
      iProductId: Number(productId) || productId,
      iCategoryId:
        product?.iCategoryId ?? product?.categoryId ?? product?.CategoryId ?? null,
      name:
        product?.sProductTitle ?? product?.productName ?? product?.name ?? "Untitled Paithani",
      category:
        product?.sCategoryName ??
        product?.category ??
        product?.categoryName ??
        categoryMap[product?.iCategoryId ?? product?.categoryId ?? product?.CategoryId] ??
        "Category",
      stock,
      price,
      color,
      palette: color || "Custom palette",
      fabric: product?.sFabric ?? product?.fabric ?? "",
      designType: product?.sDesignType ?? product?.designType ?? "",
      weave: description || "Seller-added product description will appear here.",
      description:
        description || "Seller-added product description will appear here.",
      isCustomizationAvailable:
        product?.bIsCustomizationAvailable ??
        product?.isCustomizationAvailable ??
        false,
      status:
        product?.bIsActive === false
          ? "Inactive"
          : stock > 0
          ? "Active"
          : "Out of Stock",
      images: getProductImageList(product),
    };
    })
    .filter((product) => product.iProductId && product.status !== undefined);
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [inventorySummary, setInventorySummary] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ category: "", status: "", customizable: "", priceMin: "", priceMax: "" });
  const [activeImages, setActiveImages] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageViewer, setImageViewer] = useState(null);
  const [pendingStock, setPendingStock] = useState({});
  const [stockConfirm, setStockConfirm] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const userId = getUserIdFromLogin() ?? "0";

      try {
        setIsLoadingProducts(true);
        const [response, categoryResponse] = await Promise.all([
          GetAllProductData(userId),
          GetProductCategories(),
        ]);

        const categoryOptions = getFirstArray(categoryResponse?.data) ??
          getFirstArray(categoryResponse?.responseData) ??
          getFirstArray(categoryResponse?.categories) ??
          getFirstArray(categoryResponse) ??
          [];

        const categoryMap = categoryOptions.reduce((accumulator, item) => {
          const categoryId =
            item?.iCategoryId ??
            item?.categoryId ??
            item?.value ??
            item?.id ??
            item?.KeyId ??
            item?.iId;
          const categoryLabel =
            item?.sCategoryName ??
            item?.categoryName ??
            item?.sName ??
            item?.name ??
            item?.label ??
            item?.Value;

          if (categoryId !== undefined && categoryId !== null && categoryLabel) {
            accumulator[categoryId] = String(categoryLabel);
          }

          return accumulator;
        }, {});

        setProducts(normalizeApiProducts(response, categoryMap));
        setInventorySummary(response?.inventorySummary || null);
      } catch (error) {
        showApiError(
          error?.response?.data || {
            message: "Unable to load product list right now.",
          }
        );
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const categoryOptions = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const text = `${product.name} ${product.category} ${product.palette} ${product.weave}`.toLowerCase();
    if (query && !text.includes(query.toLowerCase())) return false;
    if (filters.category && product.category !== filters.category) return false;
    if (filters.status && product.status !== filters.status) return false;
    if (filters.customizable !== "" && String(product.isCustomizationAvailable) !== filters.customizable) return false;
    if (filters.priceMin !== "" && product.price < Number(filters.priceMin)) return false;
    if (filters.priceMax !== "" && product.price > Number(filters.priceMax)) return false;
    return true;
  }), [products, query, filters]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const clearFilters = () => setFilters({ category: "", status: "", customizable: "", priceMin: "", priceMax: "" });

  const activeProducts = inventorySummary?.availableStock ?? products.filter((p) => p.stock > 0).length;
  const featuredProducts = products.filter((p) => p.status === "Featured").length;
  const inventoryValue = inventorySummary?.inventoryValue ?? products.reduce((t, p) => t + p.price * p.stock, 0);
  const totalProducts = inventorySummary?.productCount ?? products.length;

  const changeImage = (productId, direction, totalImages) => {
    setActiveImages((current) => {
      const currentIndex = current[productId] || 0;
      const nextIndex = (currentIndex + direction + totalImages) % totalImages;
      return { ...current, [productId]: nextIndex };
    });
  };

  const openAddProductModal = () => {
    setProductModalMode("add");
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setProductModalMode("edit");
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
    setProductModalMode("add");
  };

  const openImageViewer = (product, imageIndex) => {
    setImageViewer({
      productName: product.name,
      images: product.images,
      activeIndex: imageIndex,
    });
  };

  const changeViewerImage = (direction) => {
    setImageViewer((current) => {
      if (!current?.images?.length) {
        return current;
      }

      const nextIndex =
        (current.activeIndex + direction + current.images.length) %
        current.images.length;

      return {
        ...current,
        activeIndex: nextIndex,
      };
    });
  };

  const selectViewerImage = (index) => {
    setImageViewer((current) =>
      current
        ? {
            ...current,
            activeIndex: index,
          }
        : current
    );
  };

  const handleSaveProduct = async (nextProduct, mode) => {
    const sellerId = getSellerIdFromLogin();

    if (!sellerId) {
      showApiError("Seller ID is not available in the login response.");
      return;
    }

    if (!nextProduct.iCategoryId) {
      showApiError("Please select a category.");
      return;
    }

    const payload = {
      iProductId: mode === "edit" ? nextProduct.iProductId : null,
      iSellerId: sellerId,
      iCategoryId: nextProduct.iCategoryId,
      sProductTitle: nextProduct.name,
      sDescription: nextProduct.description,
      dcBasePrice: Number(nextProduct.price) || 0,
      sColor: nextProduct.color,
      sFabric: nextProduct.fabric,
      sDesignType: nextProduct.designType,
      bIsCustomizationAvailable: nextProduct.isCustomizationAvailable,
      iStock: Number(nextProduct.stock) || 0,
    };

    if (mode === "edit" && !payload.iProductId) {
      showApiError("Product ID is required to update this item.");
      return;
    }

    try {
      const response =
        mode === "edit"
          ? await UpdateProductDetails(payload)
          : await SaveProductDetails({
              requestedFor: 4,
              taskid: 1,
              ...payload,
            });
      const savedProduct = {
        ...nextProduct,
        iProductId: getResponseProductId(response, nextProduct.iProductId),
      };

      setProducts((current) => {
        const existingProduct = current.find((product) => product.id === savedProduct.id);
        const productWithImages = {
          ...savedProduct,
          images: savedProduct.images?.length > 0
            ? savedProduct.images
            : existingProduct?.images || [],
        };
        const exists = current.some((product) => product.id === savedProduct.id);
        return exists
          ? current.map((product) =>
              product.id === savedProduct.id ? productWithImages : product
            )
          : [productWithImages, ...current];
      });

      showApiSuccess(
        getResponseMessage(response) ||
          (mode === "edit"
            ? "Product updated successfully."
            : "Product added successfully.")
      );
      return savedProduct;
    } catch (error) {
      showApiError(
        error?.response?.data || {
          message:
            mode === "edit"
              ? "Unable to update product right now."
              : "Unable to add product right now.",
        }
      );
      return null;
    }
  };

  const handleUploadProductImages = async (productId, files) => {
    const userId = getUserIdFromLogin();

    if (!productId) {
      showApiError("Please save product details first.");
      return false;
    }

    if (!userId) {
      showApiError("User ID is not available in the login response.");
      return false;
    }

    if (!files?.length) {
      showApiError("Please select at least one image.");
      return false;
    }

    try {
      const response = await UploadProductImages({
        ProductId: productId,
        userId,
        Files: files,
      });

      setProducts((current) =>
        current.map((product) =>
          product.iProductId === productId
            ? {
                ...product,
                images: files.map((file, index) => ({
                  label: index === 0 ? "Main Image" : `Gallery ${index + 1}`,
                  src: URL.createObjectURL(file),
                })),
              }
            : product
        )
      );

      showApiSuccess(
        getResponseMessage(response) || "Product images uploaded successfully."
      );
      closeProductModal();
      return true;
    } catch (error) {
      showApiError(
        error?.response?.data || {
          message: "Unable to upload product images right now.",
        }
      );
      return false;
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!product?.iProductId) {
      showApiError("Product ID is required to delete this item.");
      return;
    }

    try {
      const response = await DeleteProductDetails(product.iProductId);
      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );
      showApiSuccess(
        getResponseMessage(response) || "Product deleted successfully."
      );
      setPendingDelete(null);
    } catch (error) {
      showApiError(
        error?.response?.data || {
          message: "Unable to delete product right now.",
        }
      );
    }
  };

  const handleUpdateSingleProductImage = async (productId, imageId, file, slotIndex, fileUrl) => {
    if (!productId) {
      showApiError("Product ID is required to update this image.");
      return false;
    }

    if (!imageId) {
      showApiError("Image ID is not available for this image.");
      return false;
    }

    if (!file) {
      showApiError("Please select an image first.");
      return false;
    }

    try {
      const response = await UpdateProductImage({
        imageId,
        file,
        fileUrl,
      });

      const previewUrl = URL.createObjectURL(file);

      setProducts((current) =>
        current.map((product) =>
          product.iProductId === productId
            ? {
                ...product,
                images: product.images.map((image, index) =>
                  index === slotIndex
                    ? {
                        ...image,
                        src: previewUrl,
                      }
                    : image
                ),
              }
            : product
        )
      );

      showApiSuccess(
        getResponseMessage(response) || "Product image updated successfully."
      );
      return true;
    } catch (error) {
      showApiError(
        error?.response?.data || {
          message: "Unable to update product image right now.",
        }
      );
      return false;
    }
  };

  const handleUpdateStock = (productId, currentStock, direction) => {
    const next = Math.max(0, currentStock + direction);
    setPendingStock((s) => ({ ...s, [productId]: next }));
  };

  const handleConfirmStock = (product) => {
    const pending = pendingStock[product.id];
    if (pending === undefined || pending === product.stock) return;
    setStockConfirm({ product, newStock: pending });
  };

  const handleSubmitStock = async () => {
    if (!stockConfirm) return;
    const { product, newStock } = stockConfirm;
    try {
      const response = await UpdateStock({ iProductId: product.iProductId, iStock: newStock });
      setProducts((current) =>
        current.map((p) => p.id === product.id ? { ...p, stock: newStock } : p)
      );
      setPendingStock((s) => { const n = { ...s }; delete n[product.id]; return n; });
      showApiSuccess(getResponseMessage(response) || "Stock updated successfully.");
    } catch (error) {
      showApiError(error?.response?.data || { message: "Unable to update stock right now." });
    } finally {
      setStockConfirm(null);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await handleDeleteProduct(pendingDelete);
  };

  return (
    <>
      <MetaTitle title="Products" />
      <SellerPageShell
        eyebrow="Seller Studio"
        title="Curate your Paithani collection with a cleaner catalogue view."
        description="Manage category-linked products with add, update, and delete actions connected to the new product save API."
        actions={[
          <SellerButton
            key="filter"
            variant="ghost"
            type="button"
            className="min-h-[32px] rounded-[10px] px-3 text-[11px] sm:w-auto"
            onClick={() => setIsFilterOpen((v) => !v)}
          >
            <Filter size={13} /> Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </SellerButton>,
          <SellerButton
            key="add"
            type="button"
            className="min-h-[32px] rounded-[10px] px-3 text-[11px] sm:w-auto"
            onClick={openAddProductModal}
          >
            <Plus size={13} /> Add Product
          </SellerButton>,
        ]}
      >
        {isLoadingProducts ? <Loader /> : null}

        {isFilterOpen ? (
          <div className="rounded-[18px] border border-[#ead8cf] bg-[#fffaf6] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a27c68]">Filter Products</p>
              {activeFilterCount > 0 ? (
                <button type="button" onClick={clearFilters} className="text-xs font-semibold text-[#7a1e2c] hover:underline">Clear all</button>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#a27c68]">Category</label>
                <select value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))} className="seller-select mt-1">
                  <option value="">All Categories</option>
                  {categoryOptions.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#a27c68]">Status</label>
                <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="seller-select mt-1">
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#a27c68]">Customizable</label>
                <select value={filters.customizable} onChange={(e) => setFilters((f) => ({ ...f, customizable: e.target.value }))} className="seller-select mt-1">
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#a27c68]">Min Price</label>
                <input type="number" value={filters.priceMin} onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value }))} placeholder="0" className="seller-input mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#a27c68]">Max Price</label>
                <input type="number" value={filters.priceMax} onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value }))} placeholder="Any" className="seller-input mt-1" />
              </div>
            </div>
          </div>
        ) : null}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SellerStatCard
            icon={<Package size={20} />}
            label="Total Products"
            value={totalProducts}
            note="Crafted listings"
            accent="wine"
          />
          <SellerStatCard
            icon={<Sparkles size={20} />}
            label="Featured Pieces"
            value={featuredProducts}
            note="Homepage ready"
            accent="gold"
          />
          <SellerStatCard
            icon={<Package size={20} />}
            label="Available Stock"
            value={activeProducts}
            note="Ready to dispatch"
            accent="forest"
          />
          <SellerStatCard
            icon={<Package size={20} />}
            label="Inventory Value"
            value={formatCurrency(inventoryValue)}
            note="Based on current stock"
            accent="cocoa"
          />
        </section>

        <SellerSectionCard
          title="Product library"
          description="Product add, edit, and delete now use the shared product save API while the catalogue layout stays seller-friendly."
          action={
            <div className="w-full sm:w-[280px]">
              <SellerSearchField
                icon={<Search size={18} />}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, category, or color"
              />
            </div>
          }
        >
          {filteredProducts.length === 0 ? (
            <SellerEmptyState
              icon={<Package size={28} />}
              title="No product matches this search"
              description="Try a broader keyword. New products added from the form will appear here after a successful API response."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {filteredProducts.map((product, index) => {
                const badgeTone =
                  product.status === "Out of Stock"
                    ? "danger"
                    : product.status === "Limited"
                    ? "warning"
                    : product.status === "Featured"
                    ? "success"
                    : "neutral";

                const imageIndex = activeImages[product.id] || 0;
                const currentImage = product.images[imageIndex];

                return (
                  <article
                    key={product.id}
                    className="seller-panel seller-panel-hover seller-rise flex h-full flex-col overflow-hidden rounded-[28px]"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <div className="relative overflow-hidden bg-[#f8ede7] p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <SellerBadge tone={badgeTone}>{product.status}</SellerBadge>
                          <SellerBadge tone="neutral">{product.category}</SellerBadge>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProductModal(product)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#7a1e2c] shadow-sm transition hover:bg-white"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(product)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#b42318] shadow-sm transition hover:bg-white"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="relative mt-4 overflow-hidden rounded-[24px] border border-[#eadad2] bg-white shadow-[0_12px_35px_rgba(94,35,23,0.08)]">
                        <button
                          type="button"
                          onClick={() => openImageViewer(product, imageIndex)}
                          className="block w-full"
                          aria-label={`View ${currentImage.label} for ${product.name}`}
                        >
                          <img
                            src={currentImage.src}
                            alt={`${product.name} - ${currentImage.label}`}
                            className="h-[240px] w-full object-cover transition duration-200 hover:scale-[1.02] sm:h-[270px]"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            changeImage(product.id, -1, product.images.length)
                          }
                          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#7a1e2c] shadow-md transition hover:bg-white"
                          aria-label={`Previous image for ${product.name}`}
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            changeImage(product.id, 1, product.images.length)
                          }
                          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#7a1e2c] shadow-md transition hover:bg-white"
                          aria-label={`Next image for ${product.name}`}
                        >
                          <ChevronRight size={18} />
                        </button>

                        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#351915]/60 px-3 py-2 backdrop-blur-sm">
                          {product.images.map((image, dotIndex) => (
                            <button
                              key={`${product.id}-${image.label}`}
                              type="button"
                              onClick={() =>
                                setActiveImages((current) => ({
                                  ...current,
                                  [product.id]: dotIndex,
                                }))
                              }
                              className={`h-2.5 rounded-full transition-all ${
                                dotIndex === imageIndex
                                  ? "w-8 bg-white"
                                  : "w-2.5 bg-white/45"
                              }`}
                              aria-label={`Show ${image.label}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold text-[#331915]">
                            {product.name}
                          </h2>
                          <p className="mt-2 text-sm leading-7 text-[#7c665d]">
                            {product.weave}
                          </p>
                        </div>
                        <p className="shrink-0 text-xl font-bold text-[#5f1320]">
                          {formatCurrency(product.price)}
                        </p>
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="seller-soft-panel rounded-2xl px-4 py-3">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a27c68]">
                            Details
                          </p>
                          <p className="mt-1 font-semibold text-[#351915]">
                            {product.palette}
                          </p>
                        </div>
                        <div className="seller-soft-panel rounded-2xl px-4 py-3">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a27c68]">
                            Customizable
                          </p>
                          <p className="mt-1 font-semibold text-[#351915]">
                            {product.isCustomizationAvailable ? "Yes" : "No"}
                          </p>
                        </div>
                        <div className="seller-soft-panel rounded-2xl px-4 py-3 sm:col-span-2">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a27c68]">
                            Available Stock
                          </p>
                          <p className="mt-1 font-semibold text-[#351915]">
                            {product.stock} pieces
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-[#f0e1db] pt-5">
                        <div className="rounded-[22px] border border-[#ecd8d0] bg-[#fff9f5] p-4">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a27c68]">Manage Stock</p>
                              <p className="mt-1 text-sm text-[#6d5850]">
                                Current: <span className="font-semibold text-[#351915]">{product.stock}</span> pieces
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="inline-flex items-center gap-2 rounded-full border border-[#ead8cf] bg-white p-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStock(product.id, pendingStock[product.id] ?? product.stock, -1)}
                                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8ede7] text-[#7a1e2c] shadow-sm transition hover:bg-[#f1ddd4]"
                                  aria-label={`Decrease stock for ${product.name}`}
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="min-w-[48px] text-center text-sm font-semibold text-[#351915]">
                                  {pendingStock[product.id] ?? product.stock}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStock(product.id, pendingStock[product.id] ?? product.stock, 1)}
                                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7a1e2c] text-white shadow-sm transition hover:bg-[#651623]"
                                  aria-label={`Increase stock for ${product.name}`}
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              {pendingStock[product.id] !== undefined && pendingStock[product.id] !== product.stock ? (
                                <button
                                  type="button"
                                  onClick={() => handleConfirmStock(product)}
                                  className="rounded-[10px] bg-[#7a1e2c] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#651623]"
                                >
                                  Update Stock
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </SellerSectionCard>
      </SellerPageShell>

      <AddUpdateProduct
        open={isProductModalOpen}
        mode={productModalMode}
        product={selectedProduct}
        products={products}
        onClose={closeProductModal}
        onSaveProduct={handleSaveProduct}
        onUploadImages={handleUploadProductImages}
        onUpdateImage={handleUpdateSingleProductImage}
      />

      <ConfirmationModal
        open={Boolean(stockConfirm)}
        title="Update stock?"
        message={
          stockConfirm
            ? `Update stock for "${stockConfirm.product.name}" from ${stockConfirm.product.stock} to ${stockConfirm.newStock} pieces?`
            : ""
        }
        confirmLabel="Update"
        cancelLabel="Cancel"
        onConfirm={handleSubmitStock}
        onClose={() => setStockConfirm(null)}
      />

      <ConfirmationModal
        open={Boolean(pendingDelete)}
        title="Delete product?"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.name}"? This product will be permanently removed.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Keep Product"
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />

      {imageViewer ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#2d140f]/80 px-4 py-8 backdrop-blur-[4px]">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[24px] border border-[#ead8cf] bg-[#fffaf6] shadow-[0_30px_80px_rgba(45,20,15,0.22)]">
            <button
              type="button"
              onClick={() => setImageViewer(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#7a1e2c] shadow-sm transition hover:bg-white"
              aria-label="Close image preview"
            >
              <X size={18} />
            </button>

            <div className="bg-[#f8ede7] p-4 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a27c68]">
                Image Preview
              </p>
              <h3 className="mt-2 text-xl font-bold text-[#381c17]">
                {imageViewer.productName}
              </h3>
              <p className="mt-1 text-sm text-[#7a645b]">
                {imageViewer.images[imageViewer.activeIndex]?.label}
              </p>
            </div>

            <div className="relative bg-white p-4 sm:p-6">
              <img
                src={imageViewer.images[imageViewer.activeIndex]?.src}
                alt={`${imageViewer.productName} - ${imageViewer.images[imageViewer.activeIndex]?.label}`}
                className="max-h-[80vh] w-full rounded-[20px] object-contain"
              />

              {imageViewer.images.length > 1 ? (
                <button
                  type="button"
                  onClick={() => changeViewerImage(-1)}
                  className="absolute left-6 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#7a1e2c] shadow-md transition hover:bg-white"
                  aria-label="Previous full size image"
                >
                  <ChevronLeft size={18} />
                </button>
              ) : null}

              {imageViewer.images.length > 1 ? (
                <button
                  type="button"
                  onClick={() => changeViewerImage(1)}
                  className="absolute right-6 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#7a1e2c] shadow-md transition hover:bg-white"
                  aria-label="Next full size image"
                >
                  <ChevronRight size={18} />
                </button>
              ) : null}
            </div>

            {imageViewer.images.length > 1 ? (
              <div className="flex items-center justify-center gap-2 border-t border-[#f1dfd7] bg-[#fffaf6] px-4 py-4">
                {imageViewer.images.map((image, index) => (
                  <button
                    key={`${image.label}-${index}`}
                    type="button"
                    onClick={() => selectViewerImage(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === imageViewer.activeIndex
                        ? "w-8 bg-[#7a1e2c]"
                        : "w-2.5 bg-[#d7b6aa]"
                    }`}
                    aria-label={`Show ${image.label} in full size`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProductList;
