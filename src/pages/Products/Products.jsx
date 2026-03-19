import React, { useMemo, useState } from "react";
import { sellerProducts } from "../../data/sellerStaticData";
import AddUpdateProduct from "./AddUpdateProduct";
import ProductList from "./ProductList";

const buildFormState = (product) => ({
  id: product?.id || "",
  productName: product?.name || "",
  category: product?.category || "Pure Paithani",
  price: product?.price ? String(product.price) : "",
  stock: product?.stock !== undefined ? String(product.stock) : "",
  palette: product?.palette || "",
  description: product?.weave || "",
});

const createProductId = (products) => {
  const highestId = products.reduce((maxId, product) => {
    const numericPart = Number(product.id?.replace(/[^0-9]/g, "")) || 0;
    return Math.max(maxId, numericPart);
  }, 100);

  return `PRD-${highestId + 1}`;
};

const buildProductPayload = (formState, fallbackProduct, existingProducts) => {
  const baseImages = fallbackProduct?.images || [
    { label: "Front View", src: sellerProducts[0].images[0].src },
    { label: "Pallu Detail", src: sellerProducts[0].images[1].src },
    { label: "Border Closeup", src: sellerProducts[0].images[2].src },
  ];

  return {
    id: fallbackProduct?.id || createProductId(existingProducts),
    name: formState.productName.trim() || "Untitled Paithani",
    category: formState.category,
    stock: Number(formState.stock) || 0,
    price: Number(formState.price) || 0,
    palette: formState.palette.trim() || "Custom palette",
    weave: formState.description.trim() || "Seller-added product description will appear here.",
    status: fallbackProduct?.status || "Active",
    images: baseImages,
  };
};

const Products = () => {
  const [products, setProducts] = useState(sellerProducts);
  const [query, setQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const editingProduct = useMemo(
    () => products.find((product) => product.id === editingProductId) || null,
    [editingProductId, products]
  );

  const openAddForm = () => {
    setEditingProductId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (productId) => {
    setEditingProductId(productId);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingProductId(null);
    setIsFormOpen(false);
  };

  const handleDeleteProduct = (productId) => {
    setProducts((current) => current.filter((product) => product.id !== productId));
    if (editingProductId === productId) {
      closeForm();
    }
  };

  const handleSaveProduct = (formState) => {
    setProducts((current) => {
      const nextProduct = buildProductPayload(formState, editingProduct, current);
      const exists = current.some((product) => product.id === nextProduct.id);

      if (exists) {
        return current.map((product) => (product.id === nextProduct.id ? nextProduct : product));
      }

      return [nextProduct, ...current];
    });

    closeForm();
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

  return (
    <>
      <ProductList
        products={products}
        query={query}
        setQuery={setQuery}
        onAddProduct={openAddForm}
        onEditProduct={openEditForm}
        onDeleteProduct={handleDeleteProduct}
        onUpdateStock={handleUpdateStock}
      />

      <AddUpdateProduct
        open={isFormOpen}
        mode={editingProduct ? "edit" : "add"}
        initialValues={buildFormState(editingProduct)}
        onClose={closeForm}
        onSave={handleSaveProduct}
      />
    </>
  );
};

export default Products;
