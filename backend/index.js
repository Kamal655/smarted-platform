import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectDB, { isInMemory } from './config/db.js';
import { seedData } from './seeder.js';
import internshipRoutes from './routes/internshipRoutes.js';
import userRoutes from './routes/userRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import testRoutes from './routes/testRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

// Connect to MongoDB
const startApp = async () => {
  await connectDB();
  
  // Auto-seed if in-memory
  if (isInMemory) {
    console.log('🔄 In-Memory mode detected. Auto-seeding database...');
    await seedData(false);
  }
};
startApp();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP Server & Socket.io
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // For dev
    methods: ['GET', 'POST']
  }
});

// Store connected users mapping: userId -> socketId
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('⚡ A user connected via WebSocket:', socket.id);

  socket.on('register', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} registered socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    // Remove from map on DC
    for (let [key, value] of connectedUsers.entries()) {
      if (value === socket.id) {
        connectedUsers.delete(key);
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

// Make io globally available to controllers
global.io = io;
global.connectedUsers = connectedUsers;

// Basic Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/internships', internshipRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', testRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'production') {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
