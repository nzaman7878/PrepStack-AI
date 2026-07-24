require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../src/config/env.config');
const Track = require('../src/models/Track.model');
const Topic = require('../src/models/Topic.model');

async function seedData() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing
    await Track.deleteMany({});
    await Topic.deleteMany({});

    // Create Track
    const track = await Track.create({
      name: 'Frontend Development',
      slug: 'frontend',
      description: 'Master modern frontend development.',
      color: '#3b82f6',
      icon: 'Code2',
      category: 'framework',
      isActive: true,
      order: 1
    });

    // Create Topics
    const topics = await Topic.insertMany([
      {
        track: track._id,
        name: 'React Fundamentals',
        slug: 'react-fundamentals',
        description: 'Learn the basics of React',
        order: 1,
        difficulty: 'beginner',
        estimatedTime: 60,
        tags: ['react', 'components']
      },
      {
        track: track._id,
        name: 'Advanced State Management',
        slug: 'advanced-state',
        description: 'Learn Redux, Context API, and Zustand',
        order: 2,
        difficulty: 'advanced',
        estimatedTime: 120,
        tags: ['react', 'state']
      }
    ]);

    // Link topics to track
    track.topics = topics.map(t => t._id);
    await track.save();

    console.log('Seed successful!');
    
  } catch (error) {
    console.error('Seed Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedData();
