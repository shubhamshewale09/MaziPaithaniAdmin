import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Minus, Package, Pencil, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import ConfirmationModal from "../../components/custom/ConfirmationModal";
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

const formatCurrency = (value) => `Rs ${value.toLocaleString("en-IN")}`;

const ProductList = () => {
  const [products, setProducts] = useState(sellerProducts);
  const [query, setQuery] = useState("");
  const [activeImages, setActiveImages] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const text = `${product.name} ${product.category} ${product.palette} ${product.weave}`.toLowerCase();
        return text.includes(query.toLowerCase());
      }),
    [products, query]
  );

  const activeProducts = products.filter((product) => product.stock > 0).length;
  const featuredProducts = products.filter((product) => product.status === "Featured").length;
  const inventoryValue = products.reduce((total, product) => total + product.price * product.stock, 0);

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

  const handleSaveProduct = (nextProduct) => {
    setProducts((current) => {
      const exists = current.some((product) => product.id === nextProduct.id);
      return exists
        ? current.map((product) => (product.id === nextProduct.id ? nextProduct : product))
        : [nextProduct, ...current];
    });
    closeProductModal();
  };

  const handleDeleteProduct = (productId) => {
    setProducts((current) => current.filter((product) => product.id !== productId));
  };

  const handleUpdateStock = (productId, direction) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? { ...product, stock: Math.max(0, product.stock + direction) }
          : product
      )
    );
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    handleDeleteProduct(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <>
      <MetaTitle title="Products" />
      <SellerPageShell
        eyebrow="Seller Studio"
        title="Curate your Paithani collection with a cleaner catalogue view."
        description="Use this static design layout for featured products, palette planning, and stock visibility. The structure is ready for API wiring later."
        actions={[
          <SellerButton key="filter" variant="ghost" type="button" className="min-h-[32px] rounded-[10px] px-3 text-[11px] sm:w-auto"><Filter size={13} /> Filter</SellerButton>,
          <SellerButton key="add" type="button" className="min-h-[32px] rounded-[10px] px-3 text-[11px] sm:w-auto" onClick={openAddProductModal}><Plus size={13} /> Add Product</SellerButton>,
        ]}
      >
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SellerStatCard icon={<Package size={20} />} label="Total Products" value={products.length} note="Crafted listings" accent="wine" />
          <SellerStatCard icon={<Sparkles size={20} />} label="Featured Pieces" value={featuredProducts} note="Homepage ready" accent="gold" />
          <SellerStatCard icon={<Package size={20} />} label="Available Stock" value={activeProducts} note="Ready to dispatch" accent="forest" />
          <SellerStatCard icon={<Package size={20} />} label="Inventory Value" value={formatCurrency(inventoryValue)} note="Based on current stock" accent="cocoa" />
        </section>

        <SellerSectionCard
          title="Product library"
          description="A cleaner seller-side product layout with image navigation, stock management, and separate edit/delete actions."
          action={<div className="w-full sm:w-[280px]"><SellerSearchField icon={<Search size={18} />} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, category, or palette" /></div>}
        >
          {filteredProducts.length === 0 ? (
            <SellerEmptyState
              icon={<Package size={28} />}
              title="No product matches this search"
              description="Try a broader keyword. Once backend wiring is added, the same layout can handle filtering and pagination."
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
                        <img
                          src={currentImage.src}
                          alt={`${product.name} - ${currentImage.label}`}
                          className="h-[240px] w-full object-cover sm:h-[270px]"
                        />

                        <button
                          type="button"
                          onClick={() => changeImage(product.id, -1, product.images.length)}
                          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#7a1e2c] shadow-md transition hover:bg-white"
                          aria-label={`Previous image for ${product.name}`}
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => changeImage(product.id, 1, product.images.length)}
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
                              onClick={() => setActiveImages((current) => ({ ...current, [product.id]: dotIndex }))}
                              className={`h-2.5 rounded-full transition-all ${dotIndex === imageIndex ? "w-8 bg-white" : "w-2.5 bg-white/45"}`}
                              aria-label={`Show ${image.label}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold text-[#331915]">{product.name}</h2>
                          <p className="mt-2 text-sm leading-7 text-[#7c665d]">{product.weave}</p>
                        </div>
                        <p className="shrink-0 text-xl font-bold text-[#5f1320]">{formatCurrency(product.price)}</p>
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="seller-soft-panel rounded-2xl px-4 py-3">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a27c68]">Details</p>
                          <p className="mt-1 font-semibold text-[#351915]">{product.palette}</p>
                        </div>
                        <div className="seller-soft-panel rounded-2xl px-4 py-3">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a27c68]">Available Stock</p>
                          <p className="mt-1 font-semibold text-[#351915]">{product.stock} pieces</p>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-[#f0e1db] pt-5">
                        <div className="rounded-[22px] border border-[#ecd8d0] bg-[#fff9f5] p-4">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a27c68]">Manage Stock</p>
                              <p className="mt-1 text-sm text-[#6d5850]">Adjust available pieces while designing the seller inventory view.</p>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#ead8cf] bg-white p-1.5">
                              <button
                                type="button"
                                onClick={() => handleUpdateStock(product.id, -1)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8ede7] text-[#7a1e2c] shadow-sm transition hover:bg-[#f1ddd4]"
                                aria-label={`Decrease stock for ${product.name}`}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="min-w-[48px] text-center text-sm font-semibold text-[#351915]">{product.stock}</span>
                              <button
                                type="button"
                                onClick={() => handleUpdateStock(product.id, 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7a1e2c] text-white shadow-sm transition hover:bg-[#651623]"
                                aria-label={`Increase stock for ${product.name}`}
                              >
                                <Plus size={16} />
                              </button>
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
      />

      <ConfirmationModal
        open={Boolean(pendingDelete)}
        title="Delete product?"
        message={pendingDelete ? `Do you want to delete ${pendingDelete.name}? This is a local UI delete for now and can be reused later with APIs.` : ""}
        confirmLabel="Delete"
        cancelLabel="Keep Product"
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
};

export default ProductList;
