import { query } from '../../../db/pool.js';

export class ScannerRepo {
  static async verifyTicket(ticketId: string) {
    const { rows } = await query(`
      SELECT b.*, u.name as user_name, r.origin, r.destination, r.fare
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN routes r ON b.route_id = r.id
      WHERE b.id = $1 AND b.deleted_at IS NULL
    `, [ticketId]);
    return rows[0] || null;
  }

  static async validateBoarding(ticketId: string) {
    const { rows } = await query(`
      UPDATE bookings 
      SET status = 'used', updated_at = NOW() 
      WHERE id = $1 AND status = 'confirmed' AND deleted_at IS NULL 
      RETURNING *
    `, [ticketId]);
    return rows[0] || null;
  }
}
