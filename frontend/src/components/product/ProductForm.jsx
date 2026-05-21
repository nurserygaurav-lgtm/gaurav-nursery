import { ImagePlus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Button from '../ui/Button.jsx';
import Spinner from '../ui/Spinner.jsx';
import { buildProductFormData, validateProductForm } from '../../utils/productValidation.js';

const initialValues = {
  title: '',
  description: '',
  benefits: '',
  category: '',
  subcategory: '',
  price: '',
  offerPrice: '',
  stock: '',
  sku: '',
  tags: '',
  height: '',
  potSize: '',
  watering: '',
  sunlight: '',
  fertilizer: '',
  difficulty: 'Easy',
  airPurification: '',
  seoTitle: '',
  metaDescription: '',
  altText: '',
  status: 'active'
};

export default function ProductForm({ initialProduct, isSubmitting, onSubmit }) {
  const [values, setValues] = useState(() => ({
    ...initialValues,
    title: initialProduct?.title || initialProduct?.name || '',
    description: initialProduct?.description || '',
    benefits: initialProduct?.benefits || '',
    category: initialProduct?.category || '',
    subcategory: initialProduct?.subcategory || '',
    price: initialProduct?.price ?? '',
    offerPrice: initialProduct?.offerPrice ?? '',
    stock: initialProduct?.stock ?? '',
    sku: initialProduct?.sku || '',
    tags: initialProduct?.tags?.join(', ') || '',
    height: initialProduct?.care?.height || '',
    potSize: initialProduct?.care?.potSize || '',
    watering: initialProduct?.care?.watering || '',
    sunlight: initialProduct?.care?.sunlight || '',
    fertilizer: initialProduct?.care?.fertilizer || '',
    difficulty: initialProduct?.care?.difficulty || 'Easy',
    airPurification: initialProduct?.care?.airPurification || '',
    seoTitle: initialProduct?.seo?.title || '',
    metaDescription: initialProduct?.seo?.metaDescription || '',
    altText: initialProduct?.seo?.altText || '',
    status: initialProduct?.status || 'active'
  }));
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const previews = useMemo(() => images.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })), [images]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  function handleImages(event) {
    const selected = Array.from(event.target.files || []).slice(0, 6);
    setImages(selected);
  }

  function removeImage(name) {
    setImages((current) => current.filter((file) => file.name !== name));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateProductForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    onSubmit(buildProductFormData(values, images));
  }

  return (
    <form className="mt-6 grid gap-5 rounded-lg bg-white p-5 shadow-soft lg:grid-cols-2" onSubmit={handleSubmit}>
      <Field error={errors.title} label="Product title">
        <input className="form-input" name="title" onChange={handleChange} value={values.title} />
      </Field>
      <Field error={errors.category} label="Category">
        <select className="form-input" name="category" onChange={handleChange} value={values.category}>
          <option value="">Select category</option>
          <option value="Indoor Plants">Indoor Plants</option>
          <option value="Flowering Plants">Flowering Plants</option>
          <option value="Fruit Plants">Fruit Plants</option>
          <option value="Seeds">Seeds</option>
          <option value="Planters">Planters</option>
          <option value="Garden Tools">Garden Tools</option>
        </select>
      </Field>
      <Field label="Subcategory">
        <input className="form-input" name="subcategory" onChange={handleChange} placeholder="Air Purifying Plants" value={values.subcategory} />
      </Field>
      <Field error={errors.price} label="Price">
        <input className="form-input" min="0" name="price" onChange={handleChange} type="number" value={values.price} />
      </Field>
      <Field label="Offer price">
        <input className="form-input" min="0" name="offerPrice" onChange={handleChange} type="number" value={values.offerPrice} />
      </Field>
      <Field error={errors.stock} label="Stock">
        <input className="form-input" min="0" name="stock" onChange={handleChange} type="number" value={values.stock} />
      </Field>
      <Field label="SKU">
        <input className="form-input" name="sku" onChange={handleChange} placeholder="GN-PLANT-001" value={values.sku} />
      </Field>
      <Field label="Tags">
        <input className="form-input" name="tags" onChange={handleChange} placeholder="indoor, bestseller, air purifier" value={values.tags} />
      </Field>
      <Field className="lg:col-span-2" error={errors.description} label="Description">
        <textarea className="form-input min-h-32" name="description" onChange={handleChange} value={values.description} />
      </Field>
      <Field className="lg:col-span-2" label="Benefits">
        <textarea className="form-input min-h-24" name="benefits" onChange={handleChange} value={values.benefits} />
      </Field>
      <Field label="Height">
        <input className="form-input" name="height" onChange={handleChange} placeholder="18-24 inch" value={values.height} />
      </Field>
      <Field label="Pot size">
        <input className="form-input" name="potSize" onChange={handleChange} placeholder="6 inch pot" value={values.potSize} />
      </Field>
      <Field label="Watering">
        <input className="form-input" name="watering" onChange={handleChange} placeholder="Twice a week" value={values.watering} />
      </Field>
      <Field label="Sunlight">
        <input className="form-input" name="sunlight" onChange={handleChange} placeholder="Bright indirect sunlight" value={values.sunlight} />
      </Field>
      <Field label="Fertilizer">
        <input className="form-input" name="fertilizer" onChange={handleChange} placeholder="Organic fertilizer monthly" value={values.fertilizer} />
      </Field>
      <Field label="Care difficulty">
        <select className="form-input" name="difficulty" onChange={handleChange} value={values.difficulty}>
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Expert">Expert</option>
        </select>
      </Field>
      <Field className="lg:col-span-2" label="Air purification benefits">
        <input className="form-input" name="airPurification" onChange={handleChange} value={values.airPurification} />
      </Field>
      <Field label="SEO title">
        <input className="form-input" name="seoTitle" onChange={handleChange} value={values.seoTitle} />
      </Field>
      <Field label="Meta description">
        <input className="form-input" name="metaDescription" onChange={handleChange} value={values.metaDescription} />
      </Field>
      <Field className="lg:col-span-2" label="Image alt text">
        <input className="form-input" name="altText" onChange={handleChange} value={values.altText} />
      </Field>
      <Field label="Status">
        <select className="form-input" name="status" onChange={handleChange} value={values.status}>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </Field>
      <div className="lg:col-span-2">
        <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-leaf-200 bg-leaf-50 px-4 py-6 text-center text-leaf-800">
          <ImagePlus size={28} />
          <span className="mt-2 text-sm font-bold">Upload product images</span>
          <span className="mt-1 text-xs text-stone-600">Up to 6 images, 5MB each</span>
          <input accept="image/*" className="sr-only" multiple onChange={handleImages} type="file" />
        </label>
        {!!previews.length && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {previews.map((preview) => (
              <div key={preview.name} className="relative overflow-hidden rounded-lg border border-leaf-100">
                <img className="aspect-square w-full object-cover" src={preview.url} alt={preview.name} />
                <button
                  className="absolute right-2 top-2 rounded-lg bg-white p-1 text-leaf-900 shadow"
                  onClick={() => removeImage(preview.name)}
                  type="button"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        {!!initialProduct?.images?.length && !previews.length && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {initialProduct.images.map((image) => (
              <img key={image.publicId || image.url} className="aspect-square rounded-lg object-cover" src={image.url} alt={values.title} />
            ))}
          </div>
        )}
      </div>
      <Button className="lg:w-fit" disabled={isSubmitting} type="submit">
        {isSubmitting ? <Spinner label="Saving" /> : initialProduct ? 'Update Product' : 'Save Product'}
      </Button>
    </form>
  );
}

function Field({ children, className = '', error, label }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-bold text-leaf-900">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}
