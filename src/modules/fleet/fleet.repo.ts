import { query } from '../../db/pool.js';

export class FleetRepo {
  static async findAll() {
    const { rows } = await query('SELECT * FROM fleet WHERE deleted_at IS NULL ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id: string) {
    const { rows } = await query('SELECT * FROM fleet WHERE id = $1 AND deleted_at IS NULL', [id]);
    return rows[0] || null;
  }
}
