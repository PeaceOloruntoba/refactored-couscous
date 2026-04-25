import { pool } from "../../../db/pool.js";

export class AdminUserRepo {
  static async findAll() {
    const result = await pool.query(
      `SELECT id, name, email, matric_number, role, phone, profile_image, created_at, updated_at 
       FROM users 
       ORDER BY created_at DESC`
    );
    return result.rows;
  }

  static async findById(id: string) {
    const result = await pool.query(
      `SELECT id, name, email, matric_number, role, phone, profile_image, created_at, updated_at 
       FROM users 
       WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async update(id: string, data: { name?: string, email?: string, matric_number?: string, phone?: string, role?: string }) {
    const { name, email, matric_number, phone, role } = data;
    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           email = COALESCE($2, email), 
           matric_number = COALESCE($3, matric_number),
           phone = COALESCE($4, phone),
           role = COALESCE($5, role),
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, name, email, matric_number, role, phone, updated_at`,
      [name, email, matric_number, phone, role, id]
    );
    return result.rows[0];
  }

  static async getUserStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE role = 'admin') as admin_count,
        COUNT(*) FILTER (WHERE role = 'user') as user_count,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_users_30d
      FROM users
    `);
    return result.rows[0];
  }
}
