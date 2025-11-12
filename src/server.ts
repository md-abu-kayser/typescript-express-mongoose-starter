import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server } from 'http';

let server: Server;

process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception is detected!', error);
  process.exit(1);
});

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Database connected successfully');

    server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (err) {
    console.log('Failed to connect to the database', err);
  }

  process.on('unhandledRejection', (error) => {
    console.log(
      'Unhandled Rejection is detected, we are closing our server!',
      error,
    );
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

// main server
main();

process.on('SIGTERM', () => {
  console.log('SIGTERM is received');
  if (server) {
    server.close();
  }
});
