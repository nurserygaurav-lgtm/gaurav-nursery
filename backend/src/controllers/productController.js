import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/Product.js';
import { validateProductInput } from '../utils/productValidators.js';
import { uploadProductImages, uploadProductImageUrls } from '../utils/uploadImages.js';

const sampleHeaders = [
  'Product Name',
  'Price',
  'Offer Price',
  'Category',
  'Subcategory',
  'Image URL',
  'Description',
  'Benefits',
  'Height',
  'Pot Size',
  'Watering',
  'Sunlight',
  'Fertilizer',
  'Stock',
  'SKU',
  'Tags',
  'SEO Title',
  'Meta Description'
];

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(cell.trim());
      cell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function normalizeHeader(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function toNumber(value, fallback = 0) {
  const parsed = Number(String(value || '').replace(/[₹,\s]/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function splitTags(value) {
  return String(value || '')
    .split(/[|;]/)
    .flatMap((part) => part.split(','))
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function inferCategory(name, category) {
  if (category?.trim()) return category.trim();
  const title = name.toLowerCase();
  if (title.includes('fruit')) return 'Fruit Plants';
  if (title.includes('flower') || title.includes('rose') || title.includes('jasmine')) return 'Flowering Plants';
  if (title.includes('seed')) return 'Seeds';
  if (title.includes('pot') || title.includes('planter')) return 'Pots & Planters';
  if (title.includes('fertilizer') || title.includes('manure')) return 'Fertilizers';
  if (title.includes('tool') || title.includes('cutter')) return 'Gardening Tools';
  if (title.includes('outdoor')) return 'Outdoor Plants';
  return 'Indoor Plants';
}

async function createUniqueSlug(name) {
  const baseSlug = slugify(name) || `product-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 1;

  while (await Product.exists({ slug })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  return slug;
}

function mapImportRow(row, headerIndex) {
  const get = (name) => row[headerIndex[normalizeHeader(name)]] || '';
  const name = get('Product Name');
  const category = inferCategory(name, get('Category'));
  const description = get('Description') || `${name} from Gaurav Nursery. Healthy, carefully packed, and ready for your home garden.`;
  const seoTitle = get('SEO Title') || `${name} - Buy Online at Gaurav Nursery`;
  const metaDescription = get('Meta Description') || description.slice(0, 155);
  const imageUrls = get('Image URL')
    .split(/[|;]/)
    .map((url) => url.trim())
    .filter(Boolean);

  return {
    name,
    title: name,
    description,
    benefits: get('Benefits'),
    category,
    subcategory: get('Subcategory'),
    price: toNumber(get('Price')),
    offerPrice: toNumber(get('Offer Price')) || undefined,
    stock: toNumber(get('Stock')),
    sku: get('SKU').toUpperCase(),
    tags: splitTags(get('Tags')),
    imageUrls,
    care: {
      height: get('Height'),
      potSize: get('Pot Size'),
      watering: get('Watering'),
      sunlight: get('Sunlight'),
      fertilizer: get('Fertilizer'),
      difficulty: 'Easy',
      airPurification: get('Benefits')?.toLowerCase().includes('air') ? 'Air purifying plant' : 'Helps improve indoor freshness'
    },
    seo: {
      title: seoTitle,
      metaDescription,
      altText: `${name} plant at Gaurav Nursery`
    }
  };
}

export const getProducts = asyncHandler(async (req, res) => {
  const { category, seller, search, q, status = 'active', page = 1, limit = 12 } = req.query;
  const filter = { status };
  const searchTerm = search || q;

  if (category) filter.category = category;
  if (seller) filter.seller = seller;
  if (searchTerm) {
    filter.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } }
    ];
  }

  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 48);
  const skip = (currentPage - 1) * pageSize;

  const [products, total] = await Promise.all([
    Product.find(filter).populate('seller', 'name sellerProfile.shopName').sort({ createdAt: -1 }).skip(skip).limit(pageSize),
    Product.countDocuments(filter)
  ]);

  res.json({
    products,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize) || 1
    }
  });
});

export const searchProducts = getProducts;

export const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    seller: req.user._id,
    status: { $ne: 'archived' }
  }).sort({ createdAt: -1 });

  res.json({ products });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('seller', 'name sellerProfile.shopName');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ product });
});

export const downloadProductImportSample = asyncHandler(async (_req, res) => {
  const sampleRow = [
    'Areca Palm Plant',
    '599',
    '449',
    'Indoor Plants',
    'Air Purifying Plants',
    'https://example.com/areca-palm.jpg',
    'Lush indoor palm for homes and offices.',
    'Air purifying, pet friendly, improves decor',
    '18-24 inch',
    '6 inch nursery pot',
    'Water twice a week',
    'Bright indirect sunlight',
    'Organic fertilizer monthly',
    '25',
    'GN-ARECA-001',
    'indoor,air purifier,bestseller',
    'Buy Areca Palm Plant Online',
    'Shop healthy Areca Palm plants from Gaurav Nursery with safe delivery.'
  ];
  const csv = [sampleHeaders, sampleRow].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="gaurav-nursery-product-import-sample.csv"');
  res.send(csv);
});

export const bulkImportProducts = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('CSV file is required');
  }

  const rows = parseCsv(req.file.buffer.toString('utf8').replace(/^\uFEFF/, ''));
  if (rows.length < 2) {
    res.status(400);
    throw new Error('CSV must include headers and at least one product row');
  }

  const headerIndex = rows[0].reduce((indexMap, header, index) => {
    indexMap[normalizeHeader(header)] = index;
    return indexMap;
  }, {});

  if (headerIndex[normalizeHeader('Product Name')] === undefined) {
    res.status(400);
    throw new Error('Product Name column is required');
  }

  const summary = { total: rows.length - 1, created: 0, duplicates: 0, failed: 0 };
  const errors = [];
  const imported = [];

  for (const [index, row] of rows.slice(1).entries()) {
    const rowNumber = index + 2;
    try {
      const productInput = mapImportRow(row, headerIndex);
      if (!productInput.name?.trim()) throw new Error('Product Name is required');
      if (!productInput.price) throw new Error('Price is required');

      const duplicateFilter = productInput.sku ? { sku: productInput.sku } : { name: productInput.name.trim(), seller: req.user._id };
      const duplicate = await Product.exists({ ...duplicateFilter, status: { $ne: 'archived' } });
      if (duplicate) {
        summary.duplicates += 1;
        errors.push({ row: rowNumber, message: 'Duplicate product skipped' });
        continue;
      }

      const product = await Product.create({
        ...productInput,
        images: await uploadProductImageUrls(productInput.imageUrls),
        imageUrls: undefined,
        slug: await createUniqueSlug(productInput.name),
        seller: req.user._id,
        status: 'active'
      });

      summary.created += 1;
      imported.push({ id: product._id, name: product.name, sku: product.sku, slug: product.slug });
    } catch (error) {
      summary.failed += 1;
      errors.push({ row: rowNumber, message: error.message });
    }
  }

  res.status(201).json({ summary, imported, errors });
});

export const createProduct = asyncHandler(async (req, res) => {
  const errors = validateProductInput(req.body);
  if (errors.length) {
    res.status(400);
    throw new Error(errors[0]);
  }

  const uploadedImages = await uploadProductImages(req.files);
  const title = req.body.title || req.body.name;

  const product = await Product.create({
    title: title.trim(),
    name: title.trim(),
    description: req.body.description.trim(),
    benefits: req.body.benefits?.trim(),
    category: req.body.category.trim(),
    subcategory: req.body.subcategory?.trim(),
    price: Number(req.body.price),
    offerPrice: req.body.offerPrice === undefined || req.body.offerPrice === '' ? undefined : Number(req.body.offerPrice),
    stock: Number(req.body.stock),
    sku: req.body.sku?.trim().toUpperCase(),
    tags: splitTags(req.body.tags),
    care: {
      height: req.body.height,
      potSize: req.body.potSize,
      watering: req.body.watering,
      sunlight: req.body.sunlight,
      fertilizer: req.body.fertilizer,
      difficulty: req.body.difficulty || 'Easy',
      airPurification: req.body.airPurification || 'Helps improve indoor freshness'
    },
    seo: {
      title: req.body.seoTitle || `${title.trim()} - Gaurav Nursery`,
      metaDescription: req.body.metaDescription || req.body.description.trim().slice(0, 155),
      altText: req.body.altText || `${title.trim()} at Gaurav Nursery`
    },
    images: uploadedImages,
    slug: `${slugify(title)}-${Date.now()}`,
    seller: req.user._id,
    status: req.body.status || 'active'
  });

  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const errors = validateProductInput(req.body, { isUpdate: true });
  if (errors.length) {
    res.status(400);
    throw new Error(errors[0]);
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (req.user.role === 'seller' && product.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Forbidden');
  }

  const uploadedImages = await uploadProductImages(req.files);
  const title = req.body.title || req.body.name;

  if (title !== undefined) {
    product.title = title.trim();
    product.name = title.trim();
  }
  if (req.body.description !== undefined) product.description = req.body.description.trim();
  if (req.body.benefits !== undefined) product.benefits = req.body.benefits.trim();
  if (req.body.category !== undefined) product.category = req.body.category.trim();
  if (req.body.subcategory !== undefined) product.subcategory = req.body.subcategory.trim();
  if (req.body.price !== undefined) product.price = Number(req.body.price);
  if (req.body.offerPrice !== undefined) product.offerPrice = req.body.offerPrice === '' ? undefined : Number(req.body.offerPrice);
  if (req.body.stock !== undefined) product.stock = Number(req.body.stock);
  if (req.body.sku !== undefined) product.sku = req.body.sku.trim().toUpperCase();
  if (req.body.tags !== undefined) product.tags = splitTags(req.body.tags);
  product.care = {
    ...product.care,
    height: req.body.height ?? product.care?.height,
    potSize: req.body.potSize ?? product.care?.potSize,
    watering: req.body.watering ?? product.care?.watering,
    sunlight: req.body.sunlight ?? product.care?.sunlight,
    fertilizer: req.body.fertilizer ?? product.care?.fertilizer,
    difficulty: req.body.difficulty ?? product.care?.difficulty,
    airPurification: req.body.airPurification ?? product.care?.airPurification
  };
  product.seo = {
    ...product.seo,
    title: req.body.seoTitle ?? product.seo?.title,
    metaDescription: req.body.metaDescription ?? product.seo?.metaDescription,
    altText: req.body.altText ?? product.seo?.altText
  };
  if (req.body.status !== undefined) product.status = req.body.status;
  if (uploadedImages.length) product.images = [...product.images, ...uploadedImages];

  await product.save();

  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (req.user.role === 'seller' && product.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Forbidden');
  }

  product.status = 'archived';
  await product.save();

  res.json({ message: 'Product archived' });
});
