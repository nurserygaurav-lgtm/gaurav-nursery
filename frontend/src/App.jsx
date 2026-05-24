import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#f8fff5] text-sm font-black text-[#0b3d1e]">
    Loading page...
  </div>
);

const MainLayout = lazy(() => import('./layouts/MainLayout.jsx'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout.jsx'));
const SellerLayout = lazy(() => import('./layouts/SellerLayout.jsx'));

const HomePremium = lazy(() => import('./pages/public/HomePremium.jsx'));
const About = lazy(() => import('./pages/public/About.jsx'));
const Blog = lazy(() => import('./pages/public/Blog.jsx'));
const BlogPost = lazy(() => import('./pages/public/BlogPost.jsx'));
const Categories = lazy(() => import('./pages/public/Categories.jsx'));
const CategoryLanding = lazy(() => import('./pages/public/CategoryLanding.jsx'));
const Contact = lazy(() => import('./pages/public/Contact.jsx'));
const ProductDetails = lazy(() => import('./pages/public/ProductDetails.jsx'));
const Shop = lazy(() => import('./pages/public/Shop.jsx'));
const SupportHome = lazy(() => import('./pages/SupportHome.jsx'));
const Terms = lazy(() => import('./pages/public/Terms.jsx'));
const Privacy = lazy(() => import('./pages/public/Privacy.jsx'));
const ShippingPolicy = lazy(() => import('./pages/public/ShippingPolicy.jsx'));
const ReplacementPolicy = lazy(() => import('./pages/public/ReplacementPolicy.jsx'));
const Login = lazy(() => import('./pages/auth/Login.jsx'));
const Register = lazy(() => import('./pages/auth/Register.jsx'));
const Cart = lazy(() => import('./pages/customer/Cart.jsx'));
const Checkout = lazy(() => import('./pages/customer/Checkout.jsx'));
const Orders = lazy(() => import('./pages/customer/Orders.jsx'));
const OrderDetails = lazy(() => import('./pages/customer/OrderDetails.jsx'));
const OrderSuccess = lazy(() => import('./pages/customer/OrderSuccess.jsx'));
const Wishlist = lazy(() => import('./pages/customer/Wishlist.jsx'));
const SellerDashboard = lazy(() => import('./pages/seller/SellerDashboard.jsx'));
const ManageProducts = lazy(() => import('./pages/seller/ManageProducts.jsx'));
const AddProduct = lazy(() => import('./pages/seller/AddProduct.jsx'));
const BulkUpload = lazy(() => import('./pages/seller/BulkUpload.jsx'));
const SellerOrders = lazy(() => import('./pages/seller/SellerOrders.jsx'));
const SellerAnalytics = lazy(() => import('./pages/seller/SellerAnalytics.jsx'));
const Inventory = lazy(() => import('./pages/seller/Inventory.jsx'));
const Earnings = lazy(() => import('./pages/seller/Earnings.jsx'));
const SupportTickets = lazy(() => import('./pages/seller/SupportTickets.jsx'));
const Settings = lazy(() => import('./pages/seller/Settings.jsx'));
const EditProduct = lazy(() => import('./pages/seller/EditProduct.jsx'));
const SellerPlaceholder = lazy(() => import('./pages/seller/SellerPlaceholder.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts.jsx'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders.jsx'));
const AdminSupport = lazy(() => import('./pages/admin/AdminSupport.jsx'));
const AdminSellers = lazy(() => import('./pages/admin/AdminSellers.jsx'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'));
const Analytics = lazy(() => import('./pages/admin/Analytics.jsx'));
const AdminPlaceholder = lazy(() => import('./pages/admin/AdminPlaceholder.jsx'));
const AdminTablePage = lazy(() => import('./pages/admin/AdminTablePage.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePremium />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<CategoryLanding />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/support" element={<SupportHome />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/replacement-policy" element={<ReplacementPolicy />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/seller" element={<SellerLayout />}>
            <Route index element={<SellerDashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="products/new" element={<AddProduct />} />
            <Route path="products/bulk-upload" element={<BulkUpload />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="analytics" element={<SellerAnalytics />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="support" element={<SupportTickets />} />
            <Route path="settings" element={<Settings />} />
            <Route path="customers" element={<SellerPlaceholder title="Customers" text="Customer management tools will live here." />} />
            <Route path="reviews" element={<SellerPlaceholder title="Reviews" text="Seller review moderation is coming soon." />} />
            <Route path="messages" element={<SellerPlaceholder title="Messages" text="Seller messages and buyer chats will appear here." />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="sellers" element={<AdminSellers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<AdminTablePage title="Categories" text="Manage category labels, visibility, and merchandising rules." />} />
            <Route path="transactions" element={<AdminTablePage title="Transactions" text="Review payment records, settlements, and refunds." />} />
            <Route path="reports" element={<AdminTablePage title="Reports" text="Track marketplace performance, moderation, and operations." />} />
            <Route path="coupons" element={<AdminPlaceholder title="Coupons" text="Coupon management is ready for future promotion workflows." />} />
            <Route path="reviews" element={<AdminPlaceholder title="Reviews" text="Customer review moderation will be handled here." />} />
            <Route path="settings" element={<AdminPlaceholder title="Settings" text="Admin settings and configuration tools live here." />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
