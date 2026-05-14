import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../../components/product/ProductForm.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useSellerProducts } from '../../hooks/useSellerProducts.js';
import { useToast } from '../../hooks/useToast.js';
import { updateProduct } from '../../services/productService.js';
import { getApiError } from '../../utils/auth.js';

export default function EditProduct() {
  const { id } = useParams();
  const { products, isLoading, error } = useSellerProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const product = useMemo(() => products.find((item) => item._id === id), [id, products]);

  async function handleSubmit(formData) {
    try {
      setIsSubmitting(true);
      await updateProduct(id, formData);
      showToast('Product updated successfully');
      navigate('/seller/products');
    } catch (err) {
      showToast(getApiError(err, 'Unable to update product'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-lg bg-white p-6 text-leaf-700 shadow-soft">
        <Spinner label="Loading product" />
      </section>
    );
  }

  if (error || !product) {
    return <p className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error || 'Product not found'}</p>;
  }

  return (
    <section>
      <h1 className="text-3xl font-black text-leaf-900">Edit Product</h1>
      <p className="mt-2 text-sm text-stone-600">Update product details, stock, pricing, or add new images.</p>
      <ProductForm initialProduct={product} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </section>
  );
}
