import bcrypt from 'bcryptjs';
import { AuthRepo } from './auth.repo.js';
import { signToken } from '../../utils/jwt.js';
import { generateOtp } from '../../utils/otp.js';
import { sendOtpEmail } from '../../utils/mailer.js';

export class AuthService {
  static async signup(data: any) {
    const { email, password, name, phone, matric_number, terms_accepted } = data;
    
    const existing = await AuthRepo.findByEmail(email);
    if (existing) throw new Error('Email already in use');

    const password_hash = await bcrypt.hash(password, 10);
    const user = await AuthRepo.createUser({
      email,
      password_hash,
      name,
      phone,
      matric_number,
      terms_accepted,
      role: 'user'
    });

    // Send OTP
    const otp = generateOtp(4);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await AuthRepo.createOTP(user.id, otp, expiresAt);
    await sendOtpEmail(email, otp);

    return { user_id: user.id, email: user.email };
  }

  static async login(data: any) {
    const { email, password } = data;
    const user = await AuthRepo.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw new Error('Invalid credentials');

    if (!user.verified_at) {
      // User needs to verify
      const otp = generateOtp(4);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await AuthRepo.createOTP(user.id, otp, expiresAt);
      await sendOtpEmail(user.email, otp);
      return { verified: false, user_id: user.id };
    }

    const token = signToken({ sub: user.id, email: user.email });
    const { password_hash, ...userWithoutPassword } = user;
    return { verified: true, token, user: userWithoutPassword };
  }

  static async verifyOTP(data: any) {
    const { user_id, code } = data;
    const validOTP = await AuthRepo.findValidOTP(user_id, code);
    if (!validOTP) throw new Error('Invalid or expired code');

    await AuthRepo.markOTPUsed(validOTP.id);
    await AuthRepo.verifyUser(user_id);

    const user = await AuthRepo.findById(user_id);
    if (!user) throw new Error('User not found');

    const token = signToken({ sub: user.id, email: user.email });
    const { password_hash, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  static async forgotPassword(email: string) {
    const user = await AuthRepo.findByEmail(email);
    if (!user) return; // Silent fail for security

    const otp = generateOtp(4);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await AuthRepo.createOTP(user.id, otp, expiresAt);
    await sendOtpEmail(user.email, otp);
    return { user_id: user.id };
  }

  static async resetPassword(data: any) {
    const { user_id, code, password } = data;
    const validOTP = await AuthRepo.findValidOTP(user_id, code);
    if (!validOTP) throw new Error('Invalid or expired code');

    await AuthRepo.markOTPUsed(validOTP.id);
    const password_hash = await bcrypt.hash(password, 10);
    await AuthRepo.updatePassword(user_id, password_hash);
  }

  static async updateProfile(userId: string, data: any) {
    return await AuthRepo.updateProfile(userId, data);
  }
}
