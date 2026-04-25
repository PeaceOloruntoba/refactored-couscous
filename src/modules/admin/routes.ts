import { Router } from "express"
import fleetRoutes from "./fleet/fleet.routes.js"
import dashboardRoutes from "./dashboard/dashboard.routes.js"
import bookingRoutes from "./bookings/booking.routes.js"
import scannerRoutes from "./scanner/scanner.routes.js"
import userRoutes from "./users/users.routes.js"

const router = Router()

router.use("/dashboard", dashboardRoutes)
router.use("/fleet", fleetRoutes)
router.use("/bookings", bookingRoutes)
router.use("/scanner", scannerRoutes)
router.use("/users", userRoutes)

export default router