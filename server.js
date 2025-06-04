require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const chapterRoutes = require('./routes/chapter.routes');
const redis = require('./config/redis');

const app = express();
app.use(express.json());

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

app.get('/',(req,res)=>{
  res.status(200).send({
    "message":"Hello",
  })
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});