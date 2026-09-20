'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Sparkles, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  Layers, 
  Sun, 
  Droplet, 
  Sprout, 
  ExternalLink,
  Check
} from 'lucide-react'
import { UGAOO_BESTSELLERS, UgaooPlantItem } from '@/lib/ugaooCatalog'

export default function BulkImportPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'ugaoo' | 'csv'>('ugaoo')
  const [selectedPlants, setSelectedPlants] = useState<string[]>(
    UGAOO_BESTSELLERS.map((p) => p.id)
  )
  const [targetStatus, setTargetStatus] = useState<'LIVE' | 'PENDING_REVIEW'>('LIVE')
  const [loading, setLoading] = useState(false)
  const [resultMessage, setResultMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // CSV State
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<any[]>([])

  const togglePlant = (id: string) => {
    setSelectedPlants((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedPlants.length === UGAOO_BESTSELLERS.length) {
      setSelectedPlants([])
    } else {
      setSelectedPlants(UGAOO_BESTSELLERS.map((p) => p.id))
    }
  }

  // 1-Click Import of Ugaoo plants
  const handleImportUgaoo = async () => {
    setLoading(true)
    setError(null)
    setResultMessage(null)

    const plantsToImport = UGAOO_BESTSELLERS.filter((p) => selectedPlants.includes(p.id))

    if (!plantsToImport.length) {
      setError('Please select at least 1 plant to import.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/seller/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: plantsToImport,
          targetStatus
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to import products')
      }

      setResultMessage(`🎉 Successfully added ${data.importedCount} plants to your catalog! Redirecting...`)
      setTimeout(() => {
        router.push('/seller/products')
      }, 1800)
    } catch (err: any) {
      setError(err.message || 'Error importing catalog')
    } finally {
      setLoading(false)
    }
  }

  // Handle CSV file selection and client-side parsing
  const handleCsvSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (!text) return

      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
      if (lines.length < 2) return

      const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
      const parsed = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
        const obj: any = {}
        headers.forEach((h, i) => {
          obj[h] = values[i] || ''
        })
        return obj
      })

      setCsvPreview(parsed.slice(0, 10))
    }
    reader.readAsText(file)
  }

  // Upload CSV parsed plants
  const handleImportCsv = async () => {
    if (!csvPreview.length) {
      setError('Please select a valid CSV file first.')
      return
    }

    setLoading(true)
    setError(null)
    setResultMessage(null)

    const mapped = csvPreview.map((row) => ({
      title: row['Product Name'] || row['Title'] || 'Nursery Plant',
      price: parseFloat(row['Price']) || 299,
      mrp: parseFloat(row['Offer Price'] || row['MRP']) || 399,
      stock: parseInt(row['Stock'], 10) || 20,
      category: row['Category'] || 'Indoor Plants',
      description: row['Description'] || 'Healthy fresh nursery specimen.',
      images: (row['Image URL'] || '').split(/[|;]/).map((s: string) => s.trim()).filter(Boolean),
      sunlight: row['Sunlight'] || 'Low Light (Indoor)',
      waterRequirement: row['Watering'] || 'Moderate (2-3 days)',
      plantHeight: row['Height'] || '12 - 15 inches',
      potSize: row['Pot Size'] || '6 inch nursery pot',
    }))

    try {
      const res = await fetch('/api/seller/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: mapped,
          targetStatus
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to upload CSV')

      setResultMessage(`🎉 Successfully imported ${data.importedCount} products from CSV! Redirecting...`)
      setTimeout(() => {
        router.push('/seller/products')
      }, 1800)
    } catch (err: any) {
      setError(err.message || 'Error processing CSV')
    } finally {
      setLoading(false)
    }
  }

  // Download Sample CSV
  const downloadSampleCsv = () => {
    const headers = 'Product Name,Price,Offer Price,Category,Image URL,Description,Height,Pot Size,Watering,Sunlight,Stock\n'
    const rows = UGAOO_BESTSELLERS.map((p) => 
      `"${p.title}",${p.price},${p.mrp},"${p.category}","${p.images[0]}","${p.description.replace(/"/g, '""')}","${p.plantHeight}","${p.potSize}","${p.waterRequirement}","${p.sunlight}",${p.stock}`
    ).join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'gaurav-nursery-ugaoo-plants-sample.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/seller/products" className="p-2 rounded-xl bg-white border hover:bg-slate-50 text-slate-600 transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Bulk Plant Catalog Import</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Ugaoo Curated
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Instantly populate your nursery with bestselling plants, real market pricing, and multi-angle photos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={downloadSampleCsv}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download CSV Template</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {resultMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{resultMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('ugaoo')}
          className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'ugaoo'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>1-Click Ugaoo Bestsellers Catalog ({UGAOO_BESTSELLERS.length} Plants)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('csv')}
          className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'csv'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-slate-500" />
          <span>Upload Custom CSV Spreadsheet</span>
        </button>
      </div>

      {/* TAB 1: UGAOO BESTSELLERS AUTO-IMPORT */}
      {activeTab === 'ugaoo' && (
        <div className="space-y-6">
          
          {/* Action Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPlants.length === UGAOO_BESTSELLERS.length}
                  onChange={toggleSelectAll}
                  className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Select All ({selectedPlants.length} / {UGAOO_BESTSELLERS.length})</span>
              </label>

              <div className="flex items-center gap-2 text-xs text-slate-600 pl-4 border-l border-slate-200">
                <span>Initial Status:</span>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-emerald-800 outline-none"
                >
                  <option value="LIVE">LIVE (Direct Marketplace Publish)</option>
                  <option value="PENDING_REVIEW">PENDING_REVIEW (Admin Moderation Queue)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={loading || selectedPlants.length === 0}
              onClick={handleImportUgaoo}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
            >
              {loading ? (
                <span>Importing Plants...</span>
              ) : (
                <>
                  <Sprout className="w-4 h-4" />
                  <span>Import {selectedPlants.length} Selected Plants Now</span>
                </>
              )}
            </button>
          </div>

          {/* Plant Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {UGAOO_BESTSELLERS.map((plant) => {
              const isChecked = selectedPlants.includes(plant.id)
              return (
                <div
                  key={plant.id}
                  onClick={() => togglePlant(plant.id)}
                  className={`bg-white rounded-2xl border p-4 shadow-sm transition cursor-pointer flex flex-col justify-between ${
                    isChecked 
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/10' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                      <img
                        src={plant.images[0]}
                        alt={plant.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80'
                        }}
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-emerald-600 w-3.5 h-3.5 cursor-pointer"
                        />
                        <span>{plant.category}</span>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-emerald-800/90 text-white px-2 py-0.5 rounded text-[11px] font-bold shadow">
                        ₹{plant.price} <span className="line-through text-emerald-200 text-[9px] font-normal">₹{plant.mrp}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{plant.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {plant.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 text-[10px] text-slate-600">
                      <span className="flex items-center gap-1 truncate"><Sun className="w-3 h-3 text-amber-500 flex-shrink-0" /> {plant.sunlight}</span>
                      <span className="flex items-center gap-1 truncate"><Droplet className="w-3 h-3 text-blue-500 flex-shrink-0" /> {plant.waterRequirement}</span>
                      <span className="flex items-center gap-1 truncate font-mono">Stock: {plant.stock} units</span>
                      <span className="flex items-center gap-1 truncate text-emerald-700 font-bold">Net: ₹{(plant.price * 0.9).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      )}

      {/* TAB 2: CUSTOM CSV UPLOAD */}
      {activeTab === 'csv' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900">Upload Plants Spreadsheet (CSV)</h3>
            <p className="text-xs text-slate-500">
              Upload an existing catalog file with column headers: <code>Product Name, Price, Offer Price, Category, Image URL, Description, Stock</code>.
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 bg-slate-50">
            <UploadCloud className="w-10 h-10 text-slate-400" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700">Choose your CSV file or drag and drop here</p>
              <p className="text-[11px] text-slate-400">Comma-separated values (.csv) format</p>
            </div>
            <label className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm cursor-pointer transition">
              <span>Select CSV File</span>
              <input type="file" accept=".csv" onChange={handleCsvSelect} className="hidden" />
            </label>
            {csvFile && (
              <span className="text-xs text-emerald-700 font-bold mt-1">
                ✓ Selected: {csvFile.name} ({Math.round(csvFile.size / 1024)} KB)
              </span>
            )}
          </div>

          {/* CSV Preview */}
          {csvPreview.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs text-slate-900">Preview ({csvPreview.length} items parsed)</h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-50 border-b text-slate-700 font-bold">
                    <tr>
                      <th className="p-2">Product Name</th>
                      <th className="p-2">Category</th>
                      <th className="p-2">Price</th>
                      <th className="p-2">Stock</th>
                      <th className="p-2">Image</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {csvPreview.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 font-semibold text-slate-900">{row['Product Name'] || row['Title']}</td>
                        <td className="p-2 text-slate-500">{row['Category']}</td>
                        <td className="p-2 font-bold text-emerald-800">₹{row['Price']}</td>
                        <td className="p-2 font-mono">{row['Stock']}</td>
                        <td className="p-2 text-slate-400 truncate max-w-xs">{row['Image URL']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleImportCsv}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow transition flex items-center gap-2"
              >
                {loading ? 'Importing CSV...' : `Import ${csvPreview.length} Plants from CSV`}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
