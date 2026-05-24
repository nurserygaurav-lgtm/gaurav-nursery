import { Plus, UploadCloud, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SellerProductTable from '../../components/product/SellerProductTable.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useSellerProducts } from '../../hooks/useSellerProducts.js';
import { useToast } from '../../hooks/useToast.js';
import { bulkDeleteProducts, deleteProduct, generateProductImagesForProducts } from '../../services/productService.js';
import { getApiError } from '../../utils/auth.js';

export default function ManageProducts() {
  const { products, setProducts, isLoading, error, reload } = useSellerProducts();
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isDeletingId, setIsDeletingId] = useState('');
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const { showToast } = useToast();

  const allVisibleSelected = products.length > 0 && selectedProductIds.length === products.length;

  async function handleDelete(productId) {
    const confirmed = window.confirm('Delete this product listing?');
    if (!confirmed) return;

    try {
      setIsDeletingId(productId);
      await deleteProduct(productId);
      setProducts((current) => current.filter((product) => product._id !== productId));
      setSelectedProductIds((current) => current.filter((id) => id !== productId));
      showToast('Product deleted');
    } catch (err) {
      showToast(getApiError(err, 'Unable to delete product'), 'error');
    } finally {
      setIsDeletingId('');
    }
  }

  function handleToggleSelect(productId) {
    setSelectedProductIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
  }

  function handleSelectAll() {
    if (allVisibleSelected) {
      setSelectedProductIds([]);
      return;
    }
    setSelectedProductIds(products.map((product) => product._id));
  }

  function cancelSelection() {
    setSelectedProductIds([]);
    setShowBulkDeleteModal(false);
  }

  async function handleBulkDelete() {
    if (!selectedProductIds.length) return;

    try {
      setIsBulkDeleting(true);
      await bulkDeleteProducts(selectedProductIds);
      setProducts((current) => current.filter((product) => !selectedProductIds.includes(product._id)));
      setSelectedProductIds([]);
      setShowBulkDeleteModal(false);
      showToast('Products deleted successfully');
    } catch (err) {
      showToast(getApiError(err, 'Failed to delete products'), 'error');
    } finally {
      setIsBulkDeleting(false);
    }
  }

  async function handleBulkGenerate() {
    if (!selectedProductIds.length) return;

    try {
      setIsBulkGenerating(true);
      const result = await generateProductImagesForProducts(selectedProductIds);
      showToast(
        `Image generation queued for ${result.queued} product${result.queued === 1 ? '' : 's'}. Refresh the page if images do not appear immediately.`,
        'success'
      );
      setSelectedProductIds([]);
      reload();
    } catch (err) {
      showToast(getApiError(err, 'Failed to queue image generation'), 'error');
    } finally {
      setIsBulkGenerating(false);
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf-600">Product management</p>
          <h1 className="mt-2 text-3xl font-black text-leaf-950">Manage Products</h1>
          <p className="mt-2 text-sm text-stone-600">Edit pricing, stock, images, and availability for your listings.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/seller/products/bulk-upload">
            <Button variant="outline">
              <UploadCloud className="mr-2" size={18} />
              Bulk Upload
            </Button>
          </Link>
          <Link to="/seller/products/new">
            <Button>
              <Plus className="mr-2" size={18} />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {selectedProductIds.length > 0 && (
        <div className="sticky top-0 z-20 mt-6 mb-4 overflow-hidden rounded-3xl border border-leaf-100 bg-leaf-50/95 px-4 py-4 shadow-soft backdrop-blur-xl transition-all duration-300">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-sm font-black text-leaf-950">
              <span>{selectedProductIds.length} selected</span>
              <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-leaf-700">Bulk actions</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={cancelSelection} className="min-w-[160px]">
                <X className="mr-2" size={16} />
                Cancel selection
              </Button>
              <Button
                onClick={handleBulkGenerate}
                disabled={isBulkGenerating}
                className="min-w-[220px] bg-leaf-600 text-white hover:bg-leaf-700"
              >
                {isBulkGenerating ? <Spinner label="Generating" /> : 'Generate product images'}
              </Button>
              <Button
                onClick={() => setShowBulkDeleteModal(true)}
                disabled={isBulkDeleting}
                className="min-w-[180px] bg-red-600 text-white hover:bg-red-700"
              >
                {isBulkDeleting ? <Spinner label="Deleting" /> : <><Trash2 className="mr-2" size={18} />Delete Permanently</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        {isLoading && (
          <div className="rounded-3xl bg-white p-6 text-leaf-700 shadow-soft">
            <Spinner label="Loading products" />
          </div>
        )}
        {error && <p className="rounded-3xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
        {!isLoading && !error && (
          <SellerProductTable
            products={products}
            isDeletingId={isDeletingId}
            onDelete={handleDelete}
            showToolbar
            selectedIds={selectedProductIds}
            onSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            allSelected={allVisibleSelected}
          />
        )}
      </div>

      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl border border-leaf-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf-600">Confirm delete</p>
                <h2 className="mt-3 text-2xl font-black text-leaf-950">Delete selected products</h2>
              </div>
              <button type="button" onClick={() => setShowBulkDeleteModal(false)} className="rounded-full p-2 text-stone-500 transition hover:bg-stone-100">
                <X size={20} />
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-stone-600">Are you sure you want to delete selected products?</p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button variant="outline" onClick={() => setShowBulkDeleteModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkDelete} disabled={isBulkDeleting} className="bg-red-600 text-white hover:bg-red-700">
                {isBulkDeleting ? <Spinner label="Deleting" /> : 'Delete Permanently'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
