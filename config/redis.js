const { Redis } = require('@upstash/redis');

// Connecting upstash Redis
const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

module.exports = redis;
