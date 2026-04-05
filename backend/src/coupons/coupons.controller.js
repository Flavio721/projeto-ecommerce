import { PrismaClient } from "@prisma/client";
import { AppError } from "../lib/AppError.js";
import { validateCoupon } from "../../lib/validateCoupon.js";

const prisma = new PrismaClient();


export async function checkCoupon(req, res, next) {
  try {
    const { code, subtotal } = req.body;
    const { coupon, discount } = await validateCoupon(code, subtotal);

    return res.status(200).json({
      valid: true,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    });
  } catch (err) {
    next(err);
  }
}