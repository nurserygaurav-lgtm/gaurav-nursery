import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import SellerLayout from './layouts/SellerLayout.jsx';
import Home from './pages/public/Home.jsx';
import About from './pages/public/About.jsx';
import Blog from './pages/public/Blog.jsx';
import BlogPost from './pages/public/BlogPost.jsx';
import Categories from './pages/public/Categories.jsx';
import CategoryLanding from './pages/public/CategoryLanding.jsx';
import Contact from './pages/public/Contact.jsx';
import ProductDetails from './pages/public/ProductDetails.jsx';
import Shop from './pages/public/Shop.jsx';
import SupportHome from './pages/SupportHome.jsx';
import Terms from './pages/public/Terms.jsx';
import Privacy from './pages/public/Privacy.jsx';
import ShippingPolicy from './pages/public/ShippingPolicy.jsx';
import ReplacementPolicy from './pages/public/ReplacementPolicy.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Cart from './pages/customer/Cart.jsx';
import Checkout from './pages/customer/Checkout.jsx';
import Orders from './pages/customer/Orders.jsx';
import OrderDetails from './pages/customer/OrderDetails.jsx';
import OrderSuccess from './pages/customer/OrderSuccess.jsx';
import Wishlist from './pages/customer/Wishlist.jsx';
import SellerDashboard from './pages/seller/SellerDashboard.jsx';
import ManageProducts from './pages/seller/ManageProducts.jsx';
import AddProduct from './pages/seller/AddProduct.jsx';
import BulkUpload from './pages/seller/BulkUpload.jsx';
import SellerOrders from './pages/seller/SellerOrders.jsx';
import SellerAnalytics from './pages/seller/SellerAnalytics.jsx';
import Inventory from './pages/seller/Inventory.jsx';
import Earnings from './pages/seller/Earnings.jsx';
import SupportTickets from './pages/seller/SupportTickets.jsx';
import Settings from './pages/seller/Settings.jsx';
import EditProduct from './pages/seller/EditProduct.jsx';
import SellerPlaceholder from './pages/seller/SellerPlaceholder.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminSupport from './pages/admin/AdminSupport.jsx';
import AdminSellers from './pages/admin/AdminSellers.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import Analytics from './pages/admin/Analytics.jsx';
import AdminPlaceholder from './pages/admin/AdminPlaceholder.jsx';
import AdminTablePage from './pages/admin/AdminTablePage.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<MainLayout />}>
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
    </BrowserRouter>
  );
}
