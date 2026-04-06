import { query } from '../../db/pool.js';

export class RouteRepo {
  static async findAll() {
    const { rows } = await query(`
      SELECT r.*, f.name as bus_name, f.plate_number as bus_plate,
      (SELECT array_agg(departure_time ORDER BY departure_time) FROM route_schedules WHERE route_id = r.id) as departures
      FROM routes r
      LEFT JOIN fleet f ON r.bus_id = f.id
      WHERE r.deleted_at IS NULL
      ORDER BY r.created_at DESC
    `);
    return rows;
  }

  static async findById(id: string) {
    const { rows } = await query(`
      SELECT r.*, f.name as bus_name, f.plate_number as bus_plate,
      (SELECT array_agg(departure_time ORDER BY departure_time) FROM route_schedules WHERE route_id = r.id) as departures
      FROM routes r
      LEFT JOIN fleet f ON r.bus_id = f.id
      WHERE r.id = $1 AND r.deleted_at IS NULL
    `, [id]);
    return rows[0] || null;
  }

  static async create(data: any) {
    const { origin, destination, duration, distance, fare, color, bus_id, departures } = data;
    
    // Start transaction
    const client = await query('BEGIN');
    try {
      const { rows } = await query(
        `INSERT INTO routes (origin, destination, duration, distance, fare, color, bus_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [origin, destination, duration, distance, fare, color, bus_id]
      );
      const route = rows[0];

      if (departures && departures.length > 0) {
        for (const time of departures) {
          await query(
            'INSERT INTO route_schedules (route_id, departure_time) VALUES ($1, $2)',
            [route.id, time]
          );
        }
      }

      await query('COMMIT');
      return { ...route, departures };
    } catch (err) {
      await query('ROLLBACK');
      throw err;
    }
  }

  static async update(id: string, data: any) {
    const { origin, destination, duration, distance, fare, color, bus_id, departures } = data;
    
    const client = await query('BEGIN');
    try {
      const fields = Object.keys(data).filter(k => ['origin', 'destination', 'duration', 'distance', 'fare', 'color', 'bus_id'].includes(k));
      const values = fields.map(f => data[f]);
      const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
      
      const { rows } = await query(
        `UPDATE routes SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
        [...values, id]
      );
      const route = rows[0];

      if (departures) {
        await query('DELETE FROM route_schedules WHERE route_id = $1', [id]);
        for (const time of departures) {
          await query(
            'INSERT INTO route_schedules (route_id, departure_time) VALUES ($1, $2)',
            [id, time]
          );
        }
      }

      await query('COMMIT');
      return { ...route, departures };
    } catch (err) {
      await query('ROLLBACK');
      throw err;
    }
  }

  static async delete(id: string) {
    await query('UPDATE routes SET deleted_at = NOW() WHERE id = $1', [id]);
  }
}
