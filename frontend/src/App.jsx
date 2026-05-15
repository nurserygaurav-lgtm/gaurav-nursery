import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import PublicOnlyRoute from './components/auth/PublicOnlyRoute.jsx';
import PageLoader from './components/ui/PageLoader.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import SellerLayout from './layouts/SellerLayout.jsx';

const Home = lazy(() => import('./pages/public/Home.jsx'));
const Shop = lazy(() => import('./pages/public/Shop.jsx'));
const Categories = lazy(() => import('./pages/public/Categories.jsx'));
const ProductDetails = lazy(() => import('./pages/public/ProductDetails.jsx'));
const About = lazy(() => import('./pages/public/About.jsx'));
const Contact = lazy(() => import('./pages/public/Contact.jsx'));
const Login = lazy(() => import('./pages/auth/Login.jsx'));
const Register = lazy(() => import('./pages/auth/Register.jsx'));
const Cart = lazy(() => import('./pages/customer/Cart.jsx'));
const Checkout = lazy(() => import('./pages/customer/Checkout.jsx'));
const OrderDetails = lazy(() => import('./pages/customer/OrderDetails.jsx'));
const OrderSuccess = lazy(() => import('./pages/customer/OrderSuccess.jsx'));
const Orders = lazy(() => import('./pages/customer/Orders.jsx'));
const Wishlist = lazy(() => import('./pages/customer/Wishlist.jsx'));
const SellerDashboard = lazy(() => import('./pages/seller/SellerDashboard.jsx'));
const AddProduct = lazy(() => import('./pages/seller/AddProduct.jsx'));
const ManageProducts = lazy(() => import('./pages/seller/ManageProducts.jsx'));
const EditProduct = lazy(() => import('./pages/seller/EditProduct.jsx'));
const SellerOrders = lazy(() => import('./pages/seller/SellerOrders.jsx'));
const Earnings = lazy(() => import('./pages/seller/Earnings.jsx'));
const SellerAnalytics = lazy(() => import('./pages/seller/SellerAnalytics.jsx'));
const Inventory = lazy(() => import('./pages/seller/Inventory.jsx'));
const SellerSettings = lazy(() => import('./pages/seller/Settings.jsx'));
const SellerPlaceholder = lazy(() => import('./pages/seller/SellerPlaceholder.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'));
const AdminSellers = lazy(() => import('./pages/admin/AdminSellers.jsx'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts.jsx'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders.jsx'));
const Analytics = lazy(() => import('./pages/admin/Analytics.jsx'));
const AdminPlaceholder = lazy(() => import('./pages/admin/AdminPlaceholder.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route element={<PublicOnlyRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success/:id" element={<OrderSuccess />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['customer', 'seller', 'admin']} />}>
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['seller', 'admin']} />}>
          <Route path="seller" element={<SellerLayout />}>
            <Route index element={<SellerDashboard />} />
            <Route path="products/new" element={<AddProduct />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="customers" element={<SellerPlaceholder title="Customers" text="Customer insights, repeat buyers, and customer service signals for sellers." />} />
            <Route path="analytics" element={<SellerAnalytics />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="reviews" element={<SellerPlaceholder title="Reviews" text="Ratings, customer feedback, and product review moderation for your store." />} />
            <Route path="settings" element={<SellerSettings />} />
            <Route path="messages" element={<SellerPlaceholder title="Messages" text="Buyer conversations, order questions, and seller support messages." />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="sellers" element={<AdminSellers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminPlaceholder title="Categories" text="Manage plant categories, filters, merchandising, and collection visibility." />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="transactions" element={<AdminPlaceholder title="Transactions" text="Monitor Razorpay payments, COD collections, refunds, and settlement health." />} />
            <Route path="reports" element={<AdminPlaceholder title="Reports" text="Download marketplace reports, fulfillment exports, and seller performance summaries." />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="coupons" element={<AdminPlaceholder title="Coupons" text="Create and monitor campaigns, coupon usage, and promotion performance." />} />
            <Route path="reviews" element={<AdminPlaceholder title="Reviews" text="Moderate product reviews, seller ratings, and customer feedback quality." />} />
            <Route path="settings" element={<AdminPlaceholder title="Settings" text="Configure platform policies, dashboard preferences, and operational controls." />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
