import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useToast } from '../../hooks/useToast.js';
import { bulkImportProducts, downloadProductImportSample } from '../../services/productService.js';
import { getApiError } from '../../utils/auth.js';

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);
  const { showToast } = useToast();

  function handleFileChange(event) {
    const selected = event.target.files?.[0];
    setFile(selected || null);
    setResult(null);
    setProgress(0);
  }

  async function handleSampleDownload() {
    try {
      const blob = await downloadProductImportSample();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'gaurav-nursery-product-import-sample.csv';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast(getApiError(err, 'Unable to download sample CSV'), 'error');
    }
  }

  async function handleImport(event) {
    event.preventDefault();
    if (!file) {
      showToast('Choose a CSV file first', 'error');
      return;
    }

    try {
      setIsImporting(true);
      setResult(null);
      const data = await bulkImportProducts(file, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded || 1));
        setProgress(percent);
      });
      setResult(data);
      showToast(`${data.summary.created} products imported`);
    } catch (err) {
      showToast(getApiError(err, 'Bulk import failed'), 'error');
    } finally {
      setIsImporting(false);
    }
  }

  const summary = result?.summary;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf-600">Catalog automation</p>
          <h1 className="mt-2 text-3xl font-black text-leaf-950">Bulk Product Upload</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
            Upload an Excel-exported CSV to create product pages with slugs, SEO, categories, care data, image URLs, and duplicate checks.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={handleSampleDownload}>
          <Download className="mr-2" size={18} />
          Download Sample CSV
        </Button>
      </div>

      <form className="mt-6 grid gap-6 rounded-2xl bg-white p-6 shadow-soft" onSubmit={handleImport}>
        <button
          className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-leaf-200 bg-leaf-50 px-5 py-8 text-center transition hover:border-leaf-500 hover:bg-[#f8fff5]"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-leaf-800 shadow-soft">
            <UploadCloud size={30} />
          </span>
          <span className="mt-4 text-lg font-black text-leaf-950">{file?.name || 'Choose CSV file'}</span>
          <span className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Columns supported: Product Name, Price, Offer Price, Category, Subcategory, Image URL, Description, Benefits,
            Height, Pot Size, Watering, Sunlight, Fertilizer, Stock, SKU, Tags, SEO Title, Meta Description.
            If no Image URL is provided, AI image generation will run automatically for that row. This can take several minutes, so please wait for completion.
          </span>
          <input ref={inputRef} accept=".csv,text/csv" className="sr-only" onChange={handleFileChange} type="file" />
        </button>

        {isImporting && (
          <div>
            <div className="mb-2 flex items-center justify-between text-sm font-black text-leaf-900">
              <span>Uploading and processing catalog</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-leaf-100">
              <div className="h-full rounded-full bg-leaf-700 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button disabled={isImporting || !file} type="submit">
            {isImporting ? <Spinner label="Importing" /> : (
              <>
                <FileSpreadsheet className="mr-2" size={18} />
                Import Products
              </>
            )}
          </Button>
          <p className="text-sm font-semibold text-stone-500">Duplicate SKUs or duplicate seller product names are skipped.</p>
        </div>
      </form>

      {summary && (
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            ['Rows', summary.total],
            ['Created', summary.created],
            ['Duplicates', summary.duplicates],
            ['Failed', summary.failed]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-5 shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-500">{label}</p>
              <p className="mt-2 text-3xl font-black text-leaf-950">{value}</p>
            </div>
          ))}
        </div>
      )}

      {!!result?.imported?.length && (
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-soft">
          <h2 className="flex items-center gap-2 text-lg font-black text-leaf-950">
            <CheckCircle2 className="text-emerald-600" size={20} />
            Imported Products
          </h2>
          <div className="mt-4 grid gap-2">
            {result.imported.slice(0, 8).map((product) => (
              <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-leaf-50 px-4 py-3 text-sm font-bold text-stone-700">
                <span>{product.name}</span>
                <span className="text-leaf-800">{product.sku || product.slug}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!!result?.errors?.length && (
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-soft">
          <h2 className="flex items-center gap-2 text-lg font-black text-leaf-950">
            <AlertTriangle className="text-amber-500" size={20} />
            Import Notes
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-3">Row</th>
                  <th className="px-4 py-3">Message</th>
                </tr>
              </thead>
              <tbody>
                {result.errors.map((error) => (
                  <tr key={`${error.row}-${error.message}`} className="border-t border-leaf-100">
                    <td className="px-4 py-3 font-black text-leaf-950">{error.row}</td>
                    <td className="px-4 py-3 font-semibold text-stone-600">{error.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
