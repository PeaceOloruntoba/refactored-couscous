import { query } from '../../../db/pool.js';

export class BookingRepo {
  static async findAll() {
    const { rows } = await query(`
      SELECT b.*, u.name as user_name, u.email as user_email, 
             r.origin, r.destination, r.fare
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN routes r ON b.route_id = r.id
      WHERE b.deleted_at IS NULL
      ORDER BY b.created_at DESC
    `);
    return rows;
  }

  static async findById(id: string) {
    const { rows } = await query(`
      SELECT b.*, u.name as user_name, u.email as user_email, 
             r.origin, r.destination, r.fare
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN routes r ON b.route_id = r.id
      WHERE b.id = $1 AND b.deleted_at IS NULL
    `, [id]);
    return rows[0] || null;
  }

  static async updateStatus(id: string, status: string) {
    const { rows } = await query(
      'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 AND deleted_at IS NULL RETURNING *',
      [status, id]
    );
    return rows[0];
  }

  static async softDelete(id: string) {
    await query('UPDATE bookings SET deleted_at = NOW() WHERE id = $1', [id]);
  }
}
