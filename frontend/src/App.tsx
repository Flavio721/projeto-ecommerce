// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Layout } from "./components/layout/Layout";
// import { Home } from "./pages/Home";
// import { ProductList } from "./pages/ProductList";
// import { ProductDetail } from "./pages/ProductDetail";
// import { Cart } from "./pages/Cart";
// import { Checkout } from "./pages/Checkout";
// import { OrderConfirmation } from "./pages/OrderConfirmation";
// import { Account } from "./pages/Account";
// import { Login } from "./pages/Login";
// import { Register } from "./pages/Register";
// import { AdminLayout } from "./components/layout/AdminLayout";
// import { AdminDashboard } from "./pages/admin/AdminDashboard";
// import { AdminProducts } from "./pages/admin/AdminProducts";
// import { AdminOrders } from "./pages/admin/AdminOrders";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categoria/:slug" element={<ProductList />} />
          <Route path="/produto/:slug" element={<ProductDetail />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pedido/:id" element={<OrderConfirmation />} />
          <Route path="/conta" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="produtos" element={<AdminProducts />} />
          <Route path="pedidos" element={<AdminOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}