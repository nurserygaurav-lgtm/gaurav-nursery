'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Sprout, 
  Sun, 
  Droplet, 
  Layers, 
  Ruler, 
  Maximize2, 
  Check, 
  AlertCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  UploadCloud,
  Clipboard,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Star,
  Plus,
  FileImage,
  Sparkle
} from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Image management state
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80',
  ])
  const [urlInput, setUrlInput] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    categoryId: 'indoor-plants',
    price: '',
    mrp: '',
    stock: '15',
    description: '',
    sunlight: 'Low Light (Indoor)',
    waterRequirement: 'Low (Once a week)',
    plantHeight: '12 - 15 inches',
    potSize: '6 inch nursery pot',
    soilType: 'Cocopeat & vermicompost mix',
    difficulty: 'Beginner Friendly',
    plantType: 'Air Purifying',
    careTips: 'Keep in bright indirect light. Water only when top 2 inches feel dry.',
    submitForReview: true,
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const addImage = (src: string) => {
    const clean = src.trim()
    if (!clean) return
    if (images.includes(clean)) {
      showToast('⚠️ Image already added to gallery')
      return
    }
    if (images.length >= 6) {
      showToast('⚠️ Maximum 6 images allowed')
      return
    }
    setImages((prev) => [...prev, clean])
    showToast('✓ Image successfully added!')
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    showToast('Image removed')
  }

  const setAsCover = (index: number) => {
    if (index === 0) return
    setImages((prev) => {
      const copy = [...prev]
      const [selected] = copy.splice(index, 1)
      copy.unshift(selected)
      return copy
    })
    showToast('★ Set as primary cover photo')
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('⚠️ Please upload an image file (JPG, PNG, WEBP)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('⚠️ Image size exceeds 10MB limit')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      if (dataUrl) {
        addImage(dataUrl)
        showToast('✓ Local image loaded successfully!')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(handleFile)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(handleFile)
    }
  }

  // Direct paste from clipboard via button
  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read()
        let handled = false
        for (const item of items) {
          const imageType = item.types.find((t) => t.startsWith('image/'))
          if (imageType) {
            const blob = await item.getType(imageType)
            const file = new File([blob], 'clipboard-plant-image.png', { type: imageType })
            handleFile(file)
            handled = true
            break
          }
        }
        if (handled) return
      }

      // Fallback: clipboard text
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText()
        if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
          addImage(text.trim())
          return
        }
      }

      showToast('Tip: Copy an image (or URL), then click here or press Ctrl + V!')
    } catch {
      showToast('Tip: Press Ctrl + V directly on this page to paste your image!')
    }
  }

  // Global window paste listener for instant Ctrl+V
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA'

      // If pasting an actual image file from clipboard
      const items = e.clipboardData?.items
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith('image/')) {
            const file = items[i].getAsFile()
            if (file) {
              e.preventDefault()
              handleFile(file)
              return
            }
          }
        }
      }

      // If pasting a URL while not in another input, or in the URL input
      const text = e.clipboardData?.getData('text')
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
        if (!isInput || activeEl?.id === 'image-url-input') {
          e.preventDefault()
          addImage(text.trim())
          setUrlInput('')
        }
      }
    }

    window.addEventListener('paste', handleGlobalPaste)
    return () => window.removeEventListener('paste', handleGlobalPaste)
  }, [images])

  // Autofill sample data based on user's Lucky Bamboo collage
  const loadLuckyBambooSample = () => {
    setFormData({
      title: 'Lucky Bamboo Plant - 2 Layer Bamboo with fortune and positivity',
      categoryId: 'indoor-plants',
      price: '399',
      mrp: '499',
      stock: '50',
      description: 'Specialized 2-tier Lucky Bamboo (Dracaena sanderiana) cultivated in pristine nursery conditions with a decorative glass bowl. Purifies indoor air, attracts prosperity and vitality. Perfect for office desks, living spaces, and auspicious gifting.',
      sunlight: 'Low Light (Indoor)',
      waterRequirement: 'Low (Once a week)',
      plantHeight: '15 - 20 cm',
      potSize: '8 - 10 cm Glass Bowl / Diamond Planter',
      soilType: 'Hydroponic Water with polished river pebbles',
      difficulty: 'Beginner Friendly',
      plantType: 'Air Purifying',
      careTips: 'Keep in bright indirect room light. Change clean filtered water once every 7 to 10 days. Avoid direct scorching sun.',
      submitForReview: true,
    })
    setImages([
      '/images/products/lucky-bamboo-collage.jpg',
      'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80',
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80'
    ])
    showToast('🍀 Loaded Lucky Bamboo details & photos!')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    if (!images.length) {
      setError('Please add at least one plant photo (by URL, upload, or Ctrl+V paste).')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category: formData.categoryId,
          images,
          imageUrl: images[0],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to list plant')
      }

      setSuccessMessage('Plant submitted for Admin review! Status: PENDING_REVIEW')
      setTimeout(() => {
        router.push('/seller/products')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error creating plant listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/seller/products" className="p-2 rounded-xl bg-white border hover:bg-slate-50 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Add New Plant to Catalog
            </h1>
            <p className="text-xs text-slate-500">
              List specialized nursery plants with detailed sunlight, water, and pot dimensions.
            </p>
          </div>
        </div>

        {/* Quick Sample Fill Button */}
        <button
          type="button"
          onClick={loadLuckyBambooSample}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Sparkle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Autofill Lucky Bamboo Sample</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>1. Basic Plant Information</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Plant Title / Variety</label>
              <input
                type="text"
                required
                placeholder="e.g. Lucky Bamboo Plant - 2 Layer Bamboo with fortune and positivity"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="indoor-plants">Indoor Plants</option>
                  <option value="flowering-plants">Flowering Plants</option>
                  <option value="bonsai-succulents">Bonsai & Succulents</option>
                  <option value="outdoor-plants">Outdoor Plants</option>
                  <option value="pots-planters">Pots & Planters</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Stock Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 399"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  You receive 90% (₹{formData.price ? (parseFloat(formData.price) * 0.9).toFixed(0) : '0'}), platform fee is 10%.
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">MRP / Original Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 499"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Plant Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe plant health, growth habits, and aesthetic qualities..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ADVANCED PLANT PHOTOS SECTION (URL, LOCAL UPLOAD & COPY-PASTE) */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-700" />
              <span>2. Plant Photos & Multi-Angle Gallery</span>
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {images.length} / 6 Photos Added
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Upload clear photos from multiple angles (stems, foliage, pot base, packaging). You can <strong>copy-paste (Ctrl + V)</strong>, <strong>paste an image URL</strong>, or <strong>browse local images</strong>.
          </p>

          {/* Interactive Drag, Drop & Paste Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 transition-all text-center flex flex-col items-center justify-center gap-3 ${
              isDragging 
                ? 'border-emerald-500 bg-emerald-50/70 scale-[0.99]' 
                : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFilesSelected}
            />

            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">
                Drag & drop plant photos here, or press <kbd className="bg-white border px-1.5 py-0.5 rounded shadow-sm text-emerald-700 font-mono">Ctrl + V</kbd> to paste
              </p>
              <p className="text-[11px] text-slate-500">
                Supports JPG, PNG, WEBP, AVIF. Max 10MB per file.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <FileImage className="w-3.5 h-3.5" />
                <span>Browse Computer Files</span>
              </button>

              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <Clipboard className="w-3.5 h-3.5 text-slate-600" />
                <span>Paste from Clipboard (Ctrl+V)</span>
              </button>
            </div>
          </div>

          {/* Direct URL Input Row */}
          <div className="pt-1">
            <label className="block text-slate-700 font-semibold text-xs mb-1.5">
              Or Paste Direct Image Web Link
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  id="image-url-input"
                  type="url"
                  placeholder="https://images.unsplash.com/... or any hosted image link"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (urlInput) {
                        addImage(urlInput)
                        setUrlInput('')
                      }
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (urlInput) {
                    addImage(urlInput)
                    setUrlInput('')
                  }
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add URL</span>
              </button>
            </div>
          </div>

          {/* Image Gallery Preview Grid */}
          {images.length > 0 ? (
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Gallery Preview (First photo is the marketplace cover)</span>
                <span>Click "Set as Cover" to change order</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`relative group rounded-xl overflow-hidden border-2 bg-slate-100 aspect-square transition shadow-sm ${
                      idx === 0 ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Plant photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback on broken image link
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80'
                      }}
                    />

                    {/* Badge */}
                    <div className="absolute top-1.5 left-1.5">
                      {idx === 0 ? (
                        <span className="bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" /> Cover
                        </span>
                      ) : (
                        <span className="bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          #{idx + 1}
                        </span>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition shadow opacity-90 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                    {/* Set Cover Action */}
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => setAsCover(idx)}
                        className="absolute bottom-1.5 inset-x-1.5 py-1 text-[10px] font-bold bg-white/95 hover:bg-emerald-600 hover:text-white text-slate-800 rounded shadow text-center opacity-0 group-hover:opacity-100 transition"
                      >
                        Make Cover
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>No photos added yet. Paste (Ctrl + V) or browse at least 1 photo for your listing.</span>
            </div>
          )}
        </div>

        {/* Specialized Plant Care Attributes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>3. Specialized Nursery Attributes & Care Guide</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">☀️ Sunlight Requirement</label>
              <select
                value={formData.sunlight}
                onChange={(e) => setFormData({ ...formData, sunlight: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Low Light (Indoor)">Low Light (Indoor / Office)</option>
                <option value="Moderate">Moderate Indirect (Living Rooms)</option>
                <option value="Full Sun (Outdoor)">Full Sun (Outdoor Balcony / Garden)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">💧 Watering Frequency</label>
              <select
                value={formData.waterRequirement}
                onChange={(e) => setFormData({ ...formData, waterRequirement: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Low (Once a week)">Low (Once a week)</option>
                <option value="Moderate (2-3 days)">Moderate (Every 2-3 days)</option>
                <option value="High (Daily)">High (Daily Watering)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">📏 Plant Height</label>
              <input
                type="text"
                value={formData.plantHeight}
                onChange={(e) => setFormData({ ...formData, plantHeight: e.target.value })}
                placeholder="e.g. 15 - 20 cm"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">🪴 Pot Size / Material</label>
              <input
                type="text"
                value={formData.potSize}
                onChange={(e) => setFormData({ ...formData, potSize: e.target.value })}
                placeholder="e.g. 8 - 10 cm Glass Bowl"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">🌱 Soil Type / Medium</label>
              <input
                type="text"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                placeholder="e.g. Hydroponic water with river pebbles"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">🧗 Difficulty Level</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Beginner Friendly">Beginner Friendly</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert / Delicate</option>
              </select>
            </div>
          </div>

          <div className="text-xs pt-2">
            <label className="block text-slate-700 font-semibold mb-1">💡 Nursery Care Instructions</label>
            <textarea
              rows={2}
              value={formData.careTips}
              onChange={(e) => setFormData({ ...formData, careTips: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Approval Workflow Note & Submit */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Admin Moderation Workflow</h4>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Upon clicking "Submit for Admin Review", this listing will be placed in the <strong>PENDING_REVIEW</strong> queue. 
              Once the Super Admin verifies specs, it will automatically go <strong>LIVE</strong> on the customer marketplace.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Submitting to Admin Queue...</span>
          ) : (
            <>
              <Sprout className="w-4 h-4" />
              <span>Submit Plant for Admin Review</span>
            </>
          )}
        </button>

      </form>

    </div>
  )
}
