const Chapter = require('../models/Chapter');
const redis = require('../config/redis');
const fs = require('fs');

exports.getAllChapters = async (req, res) => {
  try {
    const {
      class: classFilter,
      unit,
      status,
      weakChapters,
      subject,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (classFilter) filter.class = classFilter;
    if (unit) filter.unit = unit;
    if (status) filter.status = status;
    if (subject) filter.subject = subject;
    if (weakChapters !== undefined) {
      filter.isWeakChapter = weakChapters === 'true';
    }

    const redisKey = `chapters:${JSON.stringify(filter)}:page=${page}:limit=${limit}`;
    const cached = await redis.get(redisKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const chapters = await Chapter.find(filter).skip(skip).limit(parseInt(limit));
    const total = await Chapter.countDocuments(filter);

    const response = {
      totalChapters: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      chapters,
    };

    await redis.set(redisKey, JSON.stringify(response), { ex: 60 * 60 }); // cache for 1 hour

    res.status(200).json(response);
  } catch (error) {
    console.error('getAllChapters error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getChapterById = async (req, res) => {
  try {
    const { id } = req.params;
    const chapter = await Chapter.findById(id);

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    res.status(200).json(chapter);
  } catch (error) {
    console.error('getChapterById error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};




exports.uploadChapters = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileData = req.file.buffer.toString('utf-8');
    let chapters;

    try {
      chapters = JSON.parse(fileData);
      if (!Array.isArray(chapters)) throw new Error('Uploaded JSON must be an array');
    } catch (parseError) {
      return res.status(400).json({ error: 'Invalid JSON format' });
    }

    const validChapters = [];
    const failedChapters = [];

    for (const ch of chapters) {
      try {
        const chapter = new Chapter(ch);
        //validating so that user doesn't have to wait for long time
        await chapter.validate();
        validChapters.push(ch);
      } catch (err) {
        failedChapters.push({
          chapter: ch.chapter || null,
          reason: err.message
        });
      }
    }

    // Send response immediately with failed ones for better UX
    res.status(200).json({
      message: 'Upload processed',
      uploaded: validChapters.length,
      failed: failedChapters.length,
      failedChapters
    });

    // Save valid chapters in background
    setImmediate(async () => {
      try {
        await Chapter.insertMany(validChapters, { ordered: false });
        await redis.flushall(); // Invalidate Redis cache as per req
        console.log('Chapters saved in DB & cache invalidated');
      } catch (e) {
        console.error('Error inserting chapters in background:', e.message);
      }
    });

  } catch (error) {
    console.error('uploadChapters error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};