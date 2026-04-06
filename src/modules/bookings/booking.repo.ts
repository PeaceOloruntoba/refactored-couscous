import { query } from "../../db/pool.js";

export class BookingRepo {
  static async create(data: any) {
    const { user_id, route_id, departure_time, booking_date, seats, total_fare, reference } = data;
    const { rows } = await query(
      `INSERT INTO bookings (user_id, route_id, departure_time, booking_date, seats, total_fare, payment_reference, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [user_id, route_id, departure_time, booking_date, seats, total_fare, reference]
    );
    return rows[0];
  }

  static async findByReference(reference: string) {
    const { rows } = await query('SELECT * FROM bookings WHERE payment_reference = $1', [reference]);
    return rows[0] || null;
  }

  static async updatePaymentStatus(id: string, status: string) {
    await query('UPDATE bookings SET payment_status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
  }

  static async getUserBookings(userId: string) {
    const { rows } = await query(`
      SELECT b.*, r.origin, r.destination
      FROM bookings b
      JOIN routes r ON b.route_id = r.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `, [userId]);
    return rows;
  }
}

export class PaymentRepo {
  static async create(data: any) {
    const { booking_id, user_id, amount, reference } = data;
    const { rows } = await query(
      `INSERT INTO payments (booking_id, user_id, amount, reference)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [booking_id, user_id, amount, reference]
    );
    return rows[0];
  }

  static async updateStatus(reference: string, status: string, paidAt?: string, channel?: string) {
    await query(
      `UPDATE payments SET status = $1, paid_at = $2, channel = $3, updated_at = NOW()
       WHERE reference = $4`,
      [status, paidAt, channel, reference]
    );
  }
}
