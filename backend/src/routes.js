import express from "express";
import authRoutes from './auth/auth.routes.js'
import cartRoutes from './cart/cart.routes.js'
import ordersRoutes from './orders/orders.routes.js'
import productRotues from './products/products.routes.js'
import categoriesRoutes from './admin/admin.routes.js'
import couponRoutes from './coupons/coupons.routes.js'
import accountRoutes from './account/account.routes.js';
import adminRoutes from './admin/admin.routes.js';

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

router.use("/auth", authRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", ordersRoutes);
router.use("/products", productRotues);


export default router;