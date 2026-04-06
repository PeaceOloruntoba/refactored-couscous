import { query } from '../../../db/pool.js';

export class DashboardRepo {
  static async getStats() {
    const totalRevenue = await query(`
      SELECT SUM(total_fare) as value 
      FROM bookings 
      WHERE payment_status = 'paid' AND deleted_at IS NULL
    `);

    const activeBookings = await query(`
      SELECT COUNT(*) as value 
      FROM bookings 
      WHERE status = 'confirmed' AND deleted_at IS NULL
    `);

    const tripsCompleted = await query(`
      SELECT COUNT(*) as value 
      FROM bookings 
      WHERE status = 'used' AND deleted_at IS NULL
    `);

    const routesOperating = await query(`
      SELECT COUNT(*) as value 
      FROM routes 
      WHERE deleted_at IS NULL
    `);

    return {
      totalRevenue: parseFloat(totalRevenue.rows[0].value || '0'),
      activeBookings: parseInt(activeBookings.rows[0].value || '0'),
      tripsCompleted: parseInt(tripsCompleted.rows[0].value || '0'),
      routesOperating: parseInt(routesOperating.rows[0].value || '0'),
    };
  }

  static async getWeeklyStats() {
    const { rows } = await query(`
      SELECT 
        to_char(created_at, 'Dy') as day,
        COUNT(*) as bookings,
        SUM(total_fare) as revenue
      FROM bookings
      WHERE created_at > NOW() - INTERVAL '7 days' AND deleted_at IS NULL
      GROUP BY day, date_trunc('day', created_at)
      ORDER BY date_trunc('day', created_at)
    `);
    return rows;
  }

  static async getRouteDistribution() {
    const { rows } = await query(`
      SELECT 
        r.origin || ' -> ' || r.destination as name,
        COUNT(b.id) as value
      FROM routes r
      LEFT JOIN bookings b ON r.id = b.route_id
      WHERE r.deleted_at IS NULL AND b.deleted_at IS NULL
      GROUP BY r.id
    `);
    return rows;
  }
}
