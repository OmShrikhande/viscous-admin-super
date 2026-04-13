const app = require('./app');
const env = require('./config/env');

const seedDatabase = require('./utils/seedDatabase');

let server;

// Execute the database seeder then start listening
seedDatabase().then(() => {
  server = app.listen(env.port, () => {
    console.log(`Listening to port ${env.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
