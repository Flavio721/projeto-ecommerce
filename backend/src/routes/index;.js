import express from "express";
import authRoutes from './auth.routes.js'
import cartRoutes from './cart.routes.js'
import ordersRoutes from './orders.routes.js'
import productRotues from './products.routes.js'

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