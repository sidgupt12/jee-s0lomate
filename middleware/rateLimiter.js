const redis = require('../config/redis');

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `rate_limit:${ip}`;
    
    // Get current count for this IP
    const current = await redis.get(key);
    
    if (current === null) {
      // First request from this IP
      await redis.set(key, 1, { ex: 60 }); // Set expiry to 60 seconds
      next();
    } else if (parseInt(current) >= 30) {
      // Rate limit exceeded
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again in a minute.'
      });
    } else {
      // Increment counter
      await redis.incr(key);
      next();
    }
  } catch (error) {
    console.error('Rate limiter error:', error);
    // In case of Redis error, allow the request to proceed
    next();
  }
};

module.exports = rateLimiter; 