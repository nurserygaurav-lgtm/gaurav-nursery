import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/Product.js';
import { validateProductInput } from '../utils/productValidators.js';
import { uploadProductImages } from '../utils/uploadImages.js';

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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
    category: req.body.category.trim(),
    price: Number(req.body.price),
    stock: Number(req.body.stock),
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
  if (req.body.category !== undefined) product.category = req.body.category.trim();
  if (req.body.price !== undefined) product.price = Number(req.body.price);
  if (req.body.stock !== undefined) product.stock = Number(req.body.stock);
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
