const app = require('./src/app');
const connectDB = require('./src/database/connection');
const env = require('./src/config/env.config');
const logger = require('./src/utils/logger');

const startServer = async () => {
  try {
    await connectDB();
    app.listen(env.port, () => {
      logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
    });
  } catch (error) {
    logger.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
