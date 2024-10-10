process.on('uncaughtException', (error) => {
  console.log(error);
  console.log('server shutting down');
  process.exit(1);
});
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const server = app.listen(process.env.PORT, () => {
  console.log('Server has Started ');
});

process.on('unhandledRejection', (error) => {
  console.log(error);
  console.log('server shutting down');
  server.close(() => {
    process.exit(1);
  });
});
