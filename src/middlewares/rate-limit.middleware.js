import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/response.js';

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100;

/**
 * General API Rate Limiter
 */
export const apiRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    return sendError(
      res,
      'Too many requests from this IP. Please try again later.',
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  },
});

/**
 * Strict Auth Rate Limiter for Login Endpoint (brute-force defense)
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many login attempts from this IP. Please try again after 15 minutes.',
      429,
      'TOO_MANY_LOGIN_ATTEMPTS'
    );
  },
});
