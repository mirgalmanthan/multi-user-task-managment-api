import express from 'express';
import * as dotenv from 'dotenv';
import userRouter from './src/routers/user';

if (process.env.NODE_ENV !== 'production') dotenv.config();
const app = express();
app.use(express.json())

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send({
    message: "Hello Tasks API",
  });
});

app.use('/users', userRouter);


const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


function shutdown() {
  console.log('Received shutdown signal. Closing server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });

  // Force shutdown if it takes too long
  setTimeout(() => {
    console.error('Forcefully shutting down...');
    process.exit(1);
  }, 10000);
}

// Listen for termination signals
process.on('SIGINT', shutdown);  // Ctrl+C
process.on('SIGTERM', shutdown); // `kill` command or container stop
