export function validateProductInput(values, { isUpdate = false } = {}) {
  const errors = [];
  const title = values.title || values.name;

  if (!isUpdate || title !== undefined) {
    if (!title?.trim()) errors.push('Product title is required');
  }

  if (!isUpdate || values.description !== undefined) {
    if (!values.description?.trim()) errors.push('Product description is required');
  }

  if (!isUpdate || values.category !== undefined) {
    if (!values.category?.trim()) errors.push('Product category is required');
  }

  if (!isUpdate || values.price !== undefined) {
    if (Number.isNaN(Number(values.price)) || Number(values.price) < 0) errors.push('Price must be a valid number');
  }

  if (!isUpdate || values.stock !== undefined) {
    if (!Number.isInteger(Number(values.stock)) || Number(values.stock) < 0) errors.push('Stock must be a valid whole number');
  }

  return errors;
}
