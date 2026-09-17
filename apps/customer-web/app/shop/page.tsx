'use client';

import React, { useState } from 'react';
import { Filter, Star, ShoppingBag, SlidersHorizontal, Check } from 'lucide-react';

// Demo Products Data
const PRODUCTS = [
  {
    id: '1',
    name: 'Areca Palm',
    category: 'Indoor Plants',
    price: 299,
    originalPrice: 499,
    rating: 4.8,
    reviews: 124,
    light: 'Low Light',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600&auto=format&fit=crop',
    tag: 'Best Seller',
  },
  {
    id: '2',
    name: 'Monstera Deliciosa',
    category: 'Indoor Plants',
    price: 599,
    originalPrice: 899,
    rating: 4.9,
    reviews: 88,
    light: 'Indirect Sun',
    image: 'https://images.unsplash.com/photo-1617173944883-6ffbd35d584d?q=80&w=600&auto=format&fit=crop',
    tag: 'Trending',
  },
  {
    id: '3',
    name: 'Snake Plant (Sansevieria)',
    category: 'Air Purifying',
    price: 199,
    originalPrice: 349,
    rating: 4.7,
    reviews: 210,
    light: 'Low Light',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?q=80&w=600&auto=format&fit=crop',
    tag: 'Air Purifier',
  },
  {
    id: '4',
    name: 'Ceramic Pot 6-inch',
    category: 'Planters',
    price: 349,
    originalPrice: 499,
    rating: 4.6,
    reviews: 45,
    light: 'N/A',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=600&auto=format&fit=crop',
    tag: 'Premium',
  },
];

const CATEGORIES = ['All Categories', 'Indoor Plants', 'Outdoor Plants', 'Air Purifying', 'Planters', 'Seeds & Fertilizers'];
const LIGHT_OPTIONS = ['All Light Types', 'Low Light', 'Indirect Sun', 'Direct Sun'];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLight, setSelectedLight] = useState('All Light Types');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter Logic
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    const matchesLight = selectedLight === 'All Light Types' || product.light === selectedLight;
    const matchesPrice = product.price <= maxPrice;
    return matchesCategory && matchesLight && matchesPrice;
  });

  return (
    <div className="bg-stone-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Explore All Plants & Essentials</h1>
            <p className="text-sm text-stone-600 mt-1">Handpicked greens delivered safely to your home</p>
          </div>

          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden mt-4 inline-flex items-center gap-2 bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-medium text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters & Sorting
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className={`md:block ${isMobileFilterOpen ? 'block' : 'hidden'} bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm h-fit space-y-6`}>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-700" /> Filters
              </h2>
              <button
                onClick={() => {
                  setSelectedCategory('All Categories');
                  setSelectedLight('All Light Types');
                  setMaxPrice(1000);
                }}
                className="text-xs text-emerald-800 hover:underline font-medium"
              >
                Reset All
              </button>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-800 mb-3">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === cat ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="w-4 h-4 text-emerald-700" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-stone-800">Max Price</h3>
                <span className="text-sm font-bold text-emerald-800">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-800 mb-3">Sunlight Requirement</h3>
              <div className="space-y-2">
                {LIGHT_OPTIONS.map((light) => (
                  <button
                    key={light}
                    onClick={() => setSelectedLight(light)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      selectedLight === light ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {light}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="md:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
                <p className="text-stone-500 font-medium">No plants match your selected filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                    <div>
                      <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-900">
                          {product.tag}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                          <span>{product.rating}</span>
                          <span className="text-stone-400 font-normal">({product.reviews})</span>
                        </div>

                        <h3 className="font-semibold text-stone-900 text-base leading-snug group-hover:text-emerald-800 transition-colors">
                          {product.name}
                        </h3>

                        <p className="text-xs text-stone-500">{product.category}</p>

                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-lg font-bold text-stone-900">₹{product.price}</span>
                          <span className="text-xs text-stone-400 line-through">₹{product.originalPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

