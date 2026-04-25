import { Router } from "express";
import authRoutes from "./auth/auth.routes.js";
import adminRoutes from "./admin/routes.js";
import publicRouteRoutes from "./routes/route.routes.js";
import bookingRoutes from "./bookings/booking.routes.js";
import fleetRoutes from "./fleet/fleet.routes.js";



const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/routes", publicRouteRoutes);
router.use("/bookings", bookingRoutes);
router.use("/fleet", fleetRoutes);

export default router;
