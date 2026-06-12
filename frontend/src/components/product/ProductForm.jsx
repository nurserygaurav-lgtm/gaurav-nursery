import { UploadCloud, Scissors } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '../../hooks/useToast.js';
import { generateProductImages as generateAiProductImages } from '../../services/productService.js';
import Button from '../ui/Button.jsx';
import Spinner from '../ui/Spinner.jsx';
import { getApiError } from '../../utils/auth.js';
import { buildProductFormData, validateProductForm } from '../../utils/productValidation.js';

const MAX_IMAGES = 6;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
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
  const fileInputRef = useRef(null);
  const { showToast } = useToast();
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
  const [generatedImages, setGeneratedImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const filePreviews = useMemo(
    () =>
      images.map((file) => ({
        kind: 'file',
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        url: URL.createObjectURL(file)
      })),
    [images]
  );

  const generatedPreviews = useMemo(
    () =>
      generatedImages.map((image) => ({
        kind: 'generated',
        id: image.publicId || image.url,
        name: image.variant || 'AI generated',
        url: image.url,
        revisedPrompt: image.revisedPrompt
      })),
    [generatedImages]
  );

  const previews = useMemo(() => [...filePreviews, ...generatedPreviews], [filePreviews, generatedPreviews]);

  useEffect(() => {
    return () => {
      filePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [filePreviews]);

  function validateImageFile(file) {
    if (!file.type.startsWith('image/')) {
      return `File ${file.name} is not an image.`;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File ${file.name} exceeds the 5MB limit.`;
    }

    return '';
  }

  const processFiles = useCallback((fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setIsProcessingImages(true);
    const nextImages = [...images];
    const availableSlots = Math.max(0, MAX_IMAGES - nextImages.length - generatedImages.length);
    const filesToAdd = files.slice(0, availableSlots);
    const rejectedMessages = [];

    filesToAdd.forEach((file) => {
      const validationMessage = validateImageFile(file);
      if (validationMessage) {
        rejectedMessages.push(validationMessage);
        return;
      }

      const duplicate = nextImages.some(
        (existing) => existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified
      );
      if (!duplicate) nextImages.push(file);
    });

    if (rejectedMessages.length) {
      showToast(rejectedMessages[0], 'error');
    }

    if (files.length > availableSlots) {
      showToast(`Only ${MAX_IMAGES} images allowed. Extra files were skipped.`, 'error');
    }

    setImages(nextImages.slice(0, MAX_IMAGES));
    setIsProcessingImages(false);
  }, [generatedImages, images, showToast]);

  useEffect(() => {
    const handleWindowPaste = (event) => {
      const clipboard = event.clipboardData || window.clipboardData;
      if (!clipboard) return;

      const imageFiles = [];
      Array.from(clipboard.items || []).forEach((item) => {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) imageFiles.push(file);
        }
      });

      if (!imageFiles.length) return;

      event.preventDefault();
      processFiles(imageFiles);
    };

    window.addEventListener('paste', handleWindowPaste);
    return () => window.removeEventListener('paste', handleWindowPaste);
  }, [processFiles]);

  async function handleGenerateImages() {
    const title = values.title.trim();
    const category = values.category.trim();

    if (!title || !category) {
      showToast('Add product title and category before generating AI images.', 'error');
      return;
    }

    const availableSlots = Math.max(0, MAX_IMAGES - images.length - generatedImages.length);
    if (!availableSlots) {
      showToast(`Only ${MAX_IMAGES} images allowed. Remove one image to generate more.`, 'error');
      return;
    }

    try {
      setIsGeneratingImages(true);
      const response = await generateAiProductImages({
        ...values,
        count: Math.min(3, availableSlots)
      });

      const nextGenerated = (response.images || []).slice(0, availableSlots);
      setGeneratedImages((current) => [...current, ...nextGenerated]);

      if (nextGenerated.length) {
        showToast(`Generated ${nextGenerated.length} AI image${nextGenerated.length > 1 ? 's' : ''}.`);
      }
    } catch (error) {
      showToast(getApiError(error, 'Unable to generate AI images'), 'error');
    } finally {
      setIsGeneratingImages(false);
    }
  }

  function handleImageChange(event) {
    processFiles(event.target.files);
    event.target.value = '';
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    processFiles(event.dataTransfer.files);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave() {
    setDragActive(false);
  }

  function removePreview(preview) {
    if (preview.kind === 'generated') {
      setGeneratedImages((current) => current.filter((image) => (image.publicId || image.url) !== preview.id));
      return;
    }

    setImages((current) => current.filter((file) => `${file.name}-${file.size}-${file.lastModified}` !== preview.id));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateProductForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    onSubmit(buildProductFormData(values, images, generatedImages));
  }

  return (
    <form className="mt-6 grid gap-5 rounded-3xl bg-white p-5 shadow-soft lg:grid-cols-2" onSubmit={handleSubmit}>
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
        <div
          className={`relative cursor-pointer rounded-3xl border-2 border-dashed bg-leaf-50 p-6 text-center transition duration-200 ${
            dragActive
              ? 'border-leaf-600 bg-leaf-100 shadow-inner'
              : 'border-leaf-200 hover:border-leaf-500 hover:bg-leaf-100'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud size={34} className="mx-auto text-leaf-700" />
          <p className="mt-3 text-sm font-semibold text-leaf-900">Drag & Drop / Click / CTRL + V Paste Images</p>
          <p className="mt-1 text-xs text-stone-600">Up to 6 images, 5MB each. PNG, JPG, WEBP supported.</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-leaf-900 px-4 text-sm font-black text-white transition hover:bg-leaf-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isGeneratingImages}
              onClick={(event) => {
                event.stopPropagation();
                handleGenerateImages();
              }}
              type="button"
            >
              {isGeneratingImages ? 'Generating AI images...' : 'Generate AI images'}
            </button>
            <span className="text-xs font-semibold text-stone-500">
              Premium white background, lifestyle, and detail shots from your product details.
            </span>
          </div>
          <input
            ref={fileInputRef}
            accept="image/*"
            className="sr-only"
            multiple
            onChange={handleImageChange}
            type="file"
          />
          {isProcessingImages && (
            <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/80">
              <div className="inline-flex items-center gap-2 rounded-full bg-leaf-100 px-4 py-2 text-sm font-semibold text-leaf-900 shadow-sm">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-leaf-900 border-t-transparent" />
                Processing images...
              </div>
            </div>
          )}
        </div>
        {!!previews.length && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {previews.map((preview) => (
              <div key={preview.id} className="group relative overflow-hidden rounded-3xl border border-leaf-100 bg-leaf-50 shadow-sm">
                <img className="aspect-square w-full object-cover transition duration-200 group-hover:scale-105" src={preview.url} alt={preview.name} />
                <button
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-leaf-900 shadow hover:bg-white"
                  onClick={() => removePreview(preview)}
                  type="button"
                  aria-label="Remove image"
                  title="Cut / remove this image"
                >
                  <Scissors size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        {!!initialProduct?.images?.length && !previews.length && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {initialProduct.images.map((image) => (
              <img key={image.publicId || image.url} className="aspect-square w-full rounded-3xl object-cover" src={image.url} alt={values.title} />
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
