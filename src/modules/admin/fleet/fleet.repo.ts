import { query } from '../../../db/pool.js';

export class FleetRepo {
  static async findAll() {
    const { rows } = await query('SELECT * FROM fleet WHERE deleted_at IS NULL ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id: string) {
    const { rows } = await query('SELECT * FROM fleet WHERE id = $1 AND deleted_at IS NULL', [id]);
    return rows[0] || null;
  }

  static async create(data: any) {
    const { name, plate_number, capacity, model, year, status } = data;
    const { rows } = await query(
      `INSERT INTO fleet (name, plate_number, capacity, model, year, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, plate_number, capacity, model, year, status || 'active']
    );
    return rows[0];
  }

  static async update(id: string, data: any) {
    const fields = Object.keys(data).filter(k => ['name', 'plate_number', 'capacity', 'model', 'year', 'status'].includes(k));
    const values = fields.map(f => data[f]);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    
    const { rows } = await query(
      `UPDATE fleet SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} AND deleted_at IS NULL RETURNING *`,
      [...values, id]
    );
    return rows[0];
  }

  static async delete(id: string) {
    await query('UPDATE fleet SET deleted_at = NOW() WHERE id = $1', [id]);
  }
}
