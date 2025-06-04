require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const chapterRoutes = require('./routes/chapter.routes');
const { Redis } = require('@upstash/redis');

const app = express();
app.use(express.json());

// Connecting upstash Redis
const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

// Attach redis client to app
app.locals.redis = redis;

// mongo atlas connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// Routes
app.use('/api/v1/chapters', chapterRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});