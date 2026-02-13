import { redisClient } from "../config/redis.config";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds
const CAPTCHA_THRESHOLD = 3; // Show captcha after 3 failed attempts

export interface ILoginAttemptResult {
  remainingAttempts: number;
  lockedUntil?: Date;
  requiresCaptcha: boolean;
  isLocked: boolean;
}

const getKey = (email: string): string => `login_attempts:${email.toLowerCase()}`;

export const loginAttemptTracker = {
  /**
   * Check if user is currently locked out
   */
  async isUserLocked(email: string): Promise<boolean> {
    const key = getKey(email);
    const attempts = await redisClient.get(key);
    return attempts ? parseInt(attempts) >= MAX_LOGIN_ATTEMPTS : false;
  },

  /**
   * Record a failed login attempt
   */
  async recordFailedAttempt(email: string): Promise<ILoginAttemptResult> {
    const key = getKey(email);
    
    // Increment attempts
    const attempts = await redisClient.incr(key);
    
    // Set expiration for lockout period
    await redisClient.expire(key, LOCKOUT_TIME / 1000);
    
    const remainingAttempts = Math.max(0, MAX_LOGIN_ATTEMPTS - attempts);
    const isLocked = attempts >= MAX_LOGIN_ATTEMPTS;
    const requiresCaptcha = attempts >= CAPTCHA_THRESHOLD;
    
    return {
      remainingAttempts,
      lockedUntil: isLocked ? new Date(Date.now() + LOCKOUT_TIME) : undefined,
      requiresCaptcha,
      isLocked,
    };
  },

  /**
   * Clear all attempts for successful login
   */
  async clearAttempts(email: string): Promise<void> {
    const key = getKey(email);
    await redisClient.del(key);
  },

  /**
   * Get current attempt status without modifying
   */
  async getAttemptStatus(email: string): Promise<ILoginAttemptResult> {
    const key = getKey(email);
    const attempts = await redisClient.get(key);
    const currentAttempts = attempts ? parseInt(attempts) : 0;
    
    const remainingAttempts = Math.max(0, MAX_LOGIN_ATTEMPTS - currentAttempts);
    const isLocked = currentAttempts >= MAX_LOGIN_ATTEMPTS;
    const requiresCaptcha = currentAttempts >= CAPTCHA_THRESHOLD;
    
    return {
      remainingAttempts,
      lockedUntil: isLocked ? new Date(Date.now() + LOCKOUT_TIME) : undefined,
      requiresCaptcha,
      isLocked,
    };
  },
};