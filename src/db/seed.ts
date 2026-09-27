import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "./pool.js";

type FleetSeed = { name: string; plate: string; model: string; year: number; capacity: number };
type RouteSeed = { origin: string; destination: string; duration: string; distance: string; fare: number; color: string; bus: string; departures: string[] };

const fleets: FleetSeed[] = [
  { name: "Campus Shuttle 01", plate: "ABUJA-TR-101", model: "Toyota Coaster", year: 2022, capacity: 30 },
  { name: "Campus Shuttle 02", plate: "ABUJA-TR-102", model: "Toyota Hiace", year: 2021, capacity: 18 },
  { name: "Campus Shuttle 03", plate: "ABUJA-TR-103", model: "Toyota Coaster", year: 2023, capacity: 30 },
  { name: "Campus Shuttle 04", plate: "ABUJA-TR-104", model: "Hyundai County", year: 2020, capacity: 25 },
];

const routes: RouteSeed[] = [
  { origin: "Main Gate", destination: "Senate Building", duration: "15 mins", distance: "4 km", fare: 300, color: "#2563EB", bus: "ABUJA-TR-101", departures: ["07:00", "08:00", "09:00", "12:00", "15:00", "17:00"] },
  { origin: "Main Gate", destination: "Student Centre", duration: "20 mins", distance: "6 km", fare: 400, color: "#16A34A", bus: "ABUJA-TR-102", departures: ["07:30", "09:30", "11:30", "14:30", "16:30"] },
  { origin: "Hostel A", destination: "Library", duration: "10 mins", distance: "2 km", fare: 200, color: "#9333EA", bus: "ABUJA-TR-103", departures: ["08:00", "10:00", "12:00", "14:00", "16:00"] },
  { origin: "Main Gate", destination: "Teaching Hospital", duration: "25 mins", distance: "8 km", fare: 500, color: "#EA580C", bus: "ABUJA-TR-104", departures: ["07:00", "09:00", "11:00", "13:00", "15:00"] },
  { origin: "Student Centre", destination: "Sports Complex", duration: "12 mins", distance: "3 km", fare: 250, color: "#DC2626", bus: "ABUJA-TR-101", departures: ["08:30", "10:30", "12:30", "14:30", "16:30"] },
];

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required. Set it in .env before running npm run seed.`);
  return value;
}

async function main() {
  if (!pool) throw new Error("DATABASE_URL is required to seed the database.");
  const adminEmail = required("SEED_ADMIN_EMAIL").toLowerCase();
  const adminPassword = required("SEED_ADMIN_PASSWORD");
  const adminName = process.env.SEED_ADMIN_NAME?.trim() || "Campus Transit Administrator";
  if (adminPassword.length < 12) throw new Error("SEED_ADMIN_PASSWORD must be at least 12 characters.");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await client.query(
      `INSERT INTO users (email, password_hash, name, role, verified_at, terms_accepted)
       VALUES ($1, $2, $3, 'admin', NOW(), TRUE)
       ON CONFLICT (email) DO UPDATE SET role = 'admin', name = EXCLUDED.name,
         password_hash = EXCLUDED.password_hash, verified_at = COALESCE(users.verified_at, NOW()),
         deleted_at = NULL, updated_at = NOW()`,
      [adminEmail, passwordHash, adminName],
    );

    for (const fleet of fleets) {
      await client.query(
        `INSERT INTO fleet (name, plate_number, capacity, model, year, status, deleted_at)
         VALUES ($1, $2, $3, $4, $5, 'active', NULL)
         ON CONFLICT (plate_number) DO UPDATE SET name = EXCLUDED.name, capacity = EXCLUDED.capacity,
           model = EXCLUDED.model, year = EXCLUDED.year, status = 'active', deleted_at = NULL, updated_at = NOW()`,
        [fleet.name, fleet.plate, fleet.capacity, fleet.model, fleet.year],
      );
    }

    const seededRoutes: { id: string; fare: number; departures: string[] }[] = [];
    for (const route of routes) {
      const busResult = await client.query<{ id: string }>("SELECT id FROM fleet WHERE plate_number = $1", [route.bus]);
      const busId = busResult.rows[0]?.id;
      if (!busId) throw new Error(`Seed vehicle ${route.bus} was not created.`);
      const routeResult = await client.query<{ id: string }>(
        `SELECT id FROM routes WHERE origin = $1 AND destination = $2 AND deleted_at IS NULL ORDER BY created_at LIMIT 1`,
        [route.origin, route.destination],
      );
      let routeId = routeResult.rows[0]?.id;
      if (routeId) {
        await client.query(
          `UPDATE routes SET duration = $1, distance = $2, fare = $3, color = $4, bus_id = $5, updated_at = NOW() WHERE id = $6`,
          [route.duration, route.distance, route.fare, route.color, busId, routeId],
        );
      } else {
        const inserted = await client.query<{ id: string }>(
          `INSERT INTO routes (origin, destination, duration, distance, fare, color, bus_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [route.origin, route.destination, route.duration, route.distance, route.fare, route.color, busId],
        );
        routeId = inserted.rows[0].id;
      }
      await client.query("DELETE FROM route_schedules WHERE route_id = $1", [routeId]);
      for (const departure of route.departures) {
        await client.query("INSERT INTO route_schedules (route_id, departure_time) VALUES ($1, $2)", [routeId, departure]);
      }
      seededRoutes.push({ id: routeId, fare: route.fare, departures: route.departures });
    }

    const demoUsers = [
      { email: "ada.okafor@example.edu", name: "Ada Okafor", phone: "+2348012345601", matric: "STU/2022/001" },
      { email: "tunde.bello@example.edu", name: "Tunde Bello", phone: "+2348012345602", matric: "STU/2022/002" },
      { email: "zainab.yusuf@example.edu", name: "Zainab Yusuf", phone: "+2348012345603", matric: "STU/2023/014" },
      { email: "chidi.nwosu@example.edu", name: "Chidi Nwosu", phone: "+2348012345604", matric: "STU/2023/027" },
      { email: "ife.adebayo@example.edu", name: "Ife Adebayo", phone: "+2348012345605", matric: "STU/2024/008" },
    ];
    const demoHash = await bcrypt.hash("CampusDemo2026!", 12);
    const users: string[] = [];
    for (const user of demoUsers) {
      const result = await client.query<{ id: string }>(
        `INSERT INTO users (email, password_hash, name, phone, role, matric_number, verified_at, terms_accepted)
         VALUES ($1, $2, $3, $4, 'user', $5, NOW(), TRUE)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone,
           matric_number = EXCLUDED.matric_number, deleted_at = NULL, updated_at = NOW()
         RETURNING id`,
        [user.email, demoHash, user.name, user.phone, user.matric],
      );
      users.push(result.rows[0].id);
    }

    const dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let demoIndex = 0;
    for (const [index, dayOffset] of dates.entries()) {
      const route = seededRoutes[index % seededRoutes.length];
      const userId = users[index % users.length];
      const departure = route.departures[index % route.departures.length];
      const bookingDate = new Date();
      bookingDate.setUTCDate(bookingDate.getUTCDate() + dayOffset);
      const dateValue = bookingDate.toISOString().slice(0, 10);
      const seats = [((index * 3) % 20) + 1];
      const fare = route.fare;
      const reference = `seed-demo-${dateValue}-${String(++demoIndex).padStart(2, "0")}`;
      const booking = await client.query<{ id: string }>(
        `INSERT INTO bookings (user_id, route_id, departure_time, booking_date, seats, total_fare, status, payment_status, payment_reference, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'confirmed', 'paid', $7, NULL)
         ON CONFLICT (payment_reference) DO UPDATE SET user_id = EXCLUDED.user_id, route_id = EXCLUDED.route_id,
           departure_time = EXCLUDED.departure_time, booking_date = EXCLUDED.booking_date, seats = EXCLUDED.seats,
           total_fare = EXCLUDED.total_fare, status = EXCLUDED.status, payment_status = EXCLUDED.payment_status,
           deleted_at = NULL, updated_at = NOW()
         RETURNING id`,
        [userId, route.id, departure, dateValue, seats, fare, reference],
      );
      await client.query(
        `INSERT INTO payments (booking_id, user_id, amount, reference, status, channel, currency, paid_at)
         VALUES ($1, $2, $3, $4, 'success', 'seed', 'NGN', NOW())
         ON CONFLICT (reference) DO UPDATE SET booking_id = EXCLUDED.booking_id, user_id = EXCLUDED.user_id,
           amount = EXCLUDED.amount, status = 'success', channel = 'seed', paid_at = COALESCE(payments.paid_at, NOW()), updated_at = NOW()`,
        [booking.rows[0].id, userId, fare, reference],
      );
    }

    await client.query("COMMIT");
    console.log(`Seed complete: admin ${adminEmail}, ${fleets.length} vehicles, ${routes.length} routes, ${demoUsers.length} demo users and ${dates.length} future bookings.`);
    console.log("Demo user password: CampusDemo2026!");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error("Database seed failed:", error);
  process.exitCode = 1;
});
