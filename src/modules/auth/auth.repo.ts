import { query } from '../../db/pool.js';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  role: string;
  matric_number?: string;
  profile_image?: string;
  terms_accepted: boolean;
  verified_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export class AuthRepo {
  static async findByEmail(email: string): Promise<User | null> {
    const { rows } = await query<User>('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  }

  static async findById(id: string): Promise<User | null> {
    const { rows } = await query<User>('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async createUser(data: Partial<User>): Promise<User> {
    const { email, password_hash, name, phone, role, matric_number, terms_accepted } = data;
    const { rows } = await query<User>(
      `INSERT INTO users (email, password_hash, name, phone, role, matric_number, terms_accepted)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [email, password_hash, name, phone, role || 'user', matric_number, terms_accepted]
    );
    return rows[0];
  }

  static async verifyUser(id: string): Promise<void> {
    await query('UPDATE users SET verified_at = NOW() WHERE id = $1', [id]);
  }

  static async updatePassword(id: string, passwordHash: string): Promise<void> {
    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [passwordHash, id]);
  }

  static async updateProfile(id: string, data: Partial<User>): Promise<User> {
    const fields = Object.keys(data).filter(k => ['name', 'phone', 'matric_number', 'profile_image'].includes(k));
    const values = fields.map(f => (data as any)[f]);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    
    const { rows } = await query<User>(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );
    return rows[0];
  }

  // OTP methods
  static async createOTP(userId: string, code: string, expiresAt: Date): Promise<void> {
    await query(
      'INSERT INTO otps (user_id, code, expires_at) VALUES ($1, $2, $3)',
      [userId, code, expiresAt]
    );
  }

  static async findValidOTP(userId: string, code: string): Promise<any> {
    const { rows } = await query(
      'SELECT * FROM otps WHERE user_id = $1 AND code = $2 AND used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [userId, code]
    );
    return rows[0] || null;
  }

  static async markOTPUsed(id: string): Promise<void> {
    await query('UPDATE otps SET used = TRUE WHERE id = $1', [id]);
  }
}
