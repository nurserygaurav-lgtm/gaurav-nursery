import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/product/ProductForm.jsx';
import { useToast } from '../../hooks/useToast.js';
import { createProduct } from '../../services/productService.js';
import { getApiError } from '../../utils/auth.js';

export default function AddProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(formData) {
    try {
      setIsSubmitting(true);
      await createProduct(formData);
      showToast('Product added successfully');
      navigate('/seller/products');
    } catch (error) {
      showToast(getApiError(error, 'Unable to add product'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-black text-leaf-900">Add Product</h1>
      <p className="mt-2 text-sm text-stone-600">Create a listing with pricing, stock, category, and product images.</p>
      <ProductForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </section>
  );
}
