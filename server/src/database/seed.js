const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Track = require('../models/Track.model');
const Topic = require('../models/Topic.model');

// Load env vars
dotenv.config({ path: '../../.env' });

const seedTracks = [
  {
    slug: 'frontend',
    name: 'Frontend Engineering',
    description: 'Master HTML, CSS, JavaScript, and modern frameworks like React and Vue.',
    icon: 'layout',
    color: '#3b82f6',
    category: 'core',
    order: 1
  },
  {
    slug: 'backend',
    name: 'Backend Engineering',
    description: 'Build scalable APIs, work with Node.js, Python, and microservices.',
    icon: 'server',
    color: '#10b981',
    category: 'core',
    order: 2
  },
  {
    slug: 'generative-ai',
    name: 'Generative AI',
    description: 'Learn LLMs, RAG, prompt engineering, and building AI applications.',
    icon: 'cpu',
    color: '#8b5cf6',
    category: 'ai',
    order: 3
  }
];

const seedTopics = [
  // Frontend Topics
  {
    slug: 'react-hooks',
    name: 'React Hooks Deep Dive',
    trackSlug: 'frontend',
    order: 1,
    difficulty: 'intermediate',
    estimatedTime: 45,
    tags: ['react', 'frontend', 'javascript']
  },
  {
    slug: 'css-grid-flexbox',
    name: 'CSS Grid & Flexbox',
    trackSlug: 'frontend',
    order: 2,
    difficulty: 'beginner',
    estimatedTime: 30,
    tags: ['css', 'layout', 'frontend']
  },
  // Backend Topics
  {
    slug: 'nodejs-event-loop',
    name: 'Node.js Event Loop',
    trackSlug: 'backend',
    order: 1,
    difficulty: 'advanced',
    estimatedTime: 60,
    tags: ['nodejs', 'backend', 'architecture']
  },
  // Gen AI Topics
  {
    slug: 'retrieval-augmented-generation',
    name: 'Retrieval-Augmented Generation (RAG)',
    trackSlug: 'generative-ai',
    order: 1,
    difficulty: 'advanced',
    estimatedTime: 90,
    tags: ['ai', 'rag', 'llm']
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-prep');

    await Track.deleteMany();
    await Topic.deleteMany();

    const createdTracks = await Track.insertMany(seedTracks);
    
    // Map topics to track IDs
    const topicsWithTrackRefs = seedTopics.map(topic => {
      const track = createdTracks.find(t => t.slug === topic.trackSlug);
      const { trackSlug, ...topicData } = topic;
      return { ...topicData, track: track._id };
    });

    const createdTopics = await Topic.insertMany(topicsWithTrackRefs);

    // Update tracks with topic IDs
    for (const track of createdTracks) {
      const trackTopics = createdTopics.filter(t => t.track.toString() === track._id.toString());
      track.topics = trackTopics.map(t => t._id);
      await track.save();
    }

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // destroy data logic (optional)
} else {
  importData();
}
