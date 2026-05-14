export function validateProductForm(values) {
  const errors = {};

  if (!values.title.trim()) errors.title = 'Product title is required';
  if (!values.description.trim()) errors.description = 'Description is required';
  if (!values.category.trim()) errors.category = 'Category is required';
  if (values.price === '' || Number(values.price) < 0) errors.price = 'Enter a valid price';
  if (values.stock === '' || !Number.isInteger(Number(values.stock)) || Number(values.stock) < 0) {
    errors.stock = 'Enter a valid stock quantity';
  }

  return errors;
}

export function buildProductFormData(values, images) {
  const formData = new FormData();

  formData.append('title', values.title.trim());
  formData.append('description', values.description.trim());
  formData.append('category', values.category.trim());
  formData.append('price', values.price);
  formData.append('stock', values.stock);
  formData.append('status', values.status);

  images.forEach((image) => {
    formData.append('images', image);
  });

  return formData;
}
