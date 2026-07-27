'use client';

import { useEffect, useState } from 'react';
type Product = { _id: string; title?: string; name?: string; category?: string; price?: number; images?: Array<{ url?: string }> };
const apiUrl = `${(process.env.NEXT_PUBLIC_LEGACY_API_URL || 'https://gaurav-nursery.onrender.com').replace(/\/$/, '')}/api`;
const token = () => window.localStorage.getItem('gaurav_nursery_token') || window.sessionStorage.getItem('gaurav_nursery_token');
export default function WishlistPage() {
 const [products, setProducts] = useState<Product[]>([]); const [loading, setLoading] = useState(true); const [message, setMessage] = useState('');
 async function load(){const auth=token(); if(!auth){window.location.assign('/login');return;} try{const r=await fetch(`${apiUrl}/wishlist`,{headers:{Authorization:`Bearer ${auth}`}});const d=await r.json();if(!r.ok)throw new Error();setProducts(d.wishlist?.products||[])}catch{setMessage('Unable to load your wishlist.')}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 async function remove(id:string){const r=await fetch(`${apiUrl}/wishlist/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${token()}`}});if(r.ok)load();else setMessage('Could not remove this plant.');}
 async function add(id:string){const r=await fetch(`${apiUrl}/cart`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token()}`},body:JSON.stringify({productId:id,quantity:1})});setMessage(r.ok?'Added to cart.':'Could not add to cart.');}
 return <main><div className="offerbar">Your saved plants <span>•</span> Secure checkout</div><nav><a className="logo" href="/"><b>✦</b><span>Gaurav Nursery<small>Trusted Plant Studio</small></span></a><div className="quick"><a href="/shop">Shop</a><a href="/cart">Cart</a></div></nav><section className="section-title"><div><p className="eyebrow">SAVED FOR LATER</p><h2>My Wishlist</h2></div><a href="/shop">Continue shopping →</a></section>{message&&<p className="store-message">{message}</p>}{loading?<p className="loading-page">Loading wishlist…</p>:products.length?<section className="product-grid wish-grid">{products.map(p=><article className="product-tile" key={p._id}><a href={`/products/${p._id}`}>{p.images?.[0]?.url?<img src={p.images[0].url} alt={p.title||p.name}/>:<span>🌿</span>}<p>{p.category||'Nursery plant'}</p><h3>{p.title||p.name}</h3></a><b>₹{Number(p.price||0).toLocaleString('en-IN')}</b><button className="button" onClick={()=>add(p._id)}>Add to cart</button><button className="text-button" onClick={()=>remove(p._id)}>Remove</button></article>)}</section>:<section className="empty-card"><h3>Your wishlist is empty</h3><p>Save plants you would like to buy later.</p><a className="button" href="/shop">Explore plants</a></section>}</main>;
}
