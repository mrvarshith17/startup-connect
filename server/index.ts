import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/database";
import { handleDemo } from "./routes/demo";

// Authentication routes (Hybrid: MongoDB + localStorage fallback)
import { handleLogin, handleRegister, handleLogout, authenticateToken } from "./routes/auth-hybrid";

// Ideas routes
import {
  handleGetIdeas,
  handleGetIdea,
  handleCreateIdea,
  handleUpdateIdea,
  handleDeleteIdea,
  handleGetFounderIdeas
} from "./routes/ideas";

// Likes routes
import {
  handleToggleLike,
  handleGetIdeaLikes,
  handleGetUserLikes,
  handleCheckUserLike
} from "./routes/likes";

// Investments routes
import {
  handleExpressInterest,
  handleGetIdeaInvestments,
  handleGetUserInvestments,
  handleGetFounderInvestments,
  handleUpdateInvestment,
  handleDeleteInvestment
} from "./routes/investments";

// Chat routes
import {
  handleCreateChat,
  handleGetUserChats,
  handleGetChat,
  handleSendMessage,
  handleGetChatMessages
} from "./routes/chat";

export function createServer() {
  const app = express();

  // Try to connect to MongoDB (non-blocking)
  connectDB().then((connected) => {
    if (connected) {
      console.log('🎯 Running in MongoDB mode');
    } else {
      console.log('🔄 Running in localStorage mode (MongoDB not available)');
    }
  });

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "VentureLink API is running!";
    res.json({ message: ping });
  });

  // Status endpoint
  app.get("/api/status", (_req, res) => {
    const mongoConnected = mongoose.connection.readyState === 1;
    res.json({
      success: true,
      data: {
        mode: mongoConnected ? "MongoDB" : "localStorage",
        mongoConnected,
        message: mongoConnected
          ? "✅ Using MongoDB database"
          : "🔄 Using localStorage fallback (start MongoDB with 'mongod' for database mode)"
      }
    });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/logout", authenticateToken, handleLogout);

  // Ideas routes
  app.get("/api/ideas", handleGetIdeas);
  app.get("/api/ideas/:id", handleGetIdea);
  app.post("/api/ideas", authenticateToken, handleCreateIdea);
  app.put("/api/ideas/:id", authenticateToken, handleUpdateIdea);
  app.delete("/api/ideas/:id", authenticateToken, handleDeleteIdea);
  app.get("/api/founder/ideas", authenticateToken, handleGetFounderIdeas);

  // Likes routes
  app.post("/api/likes", authenticateToken, handleToggleLike);
  app.get("/api/likes/idea/:ideaId", handleGetIdeaLikes);
  app.get("/api/likes/user", authenticateToken, handleGetUserLikes);
  app.get("/api/likes/check/:ideaId", authenticateToken, handleCheckUserLike);

  // Investments routes
  app.post("/api/investments", authenticateToken, handleExpressInterest);
  app.get("/api/investments/idea/:ideaId", authenticateToken, handleGetIdeaInvestments);
  app.get("/api/investments/user", authenticateToken, handleGetUserInvestments);
  app.get("/api/investments/founder", authenticateToken, handleGetFounderInvestments);
  app.put("/api/investments/:id", authenticateToken, handleUpdateInvestment);
  app.delete("/api/investments/:id", authenticateToken, handleDeleteInvestment);

  // Chat routes
  app.post("/api/chats", authenticateToken, handleCreateChat);
  app.get("/api/chats", authenticateToken, handleGetUserChats);
  app.get("/api/chats/:id", authenticateToken, handleGetChat);
  app.post("/api/chats/message", authenticateToken, handleSendMessage);
  app.get("/api/chats/:chatId/messages", authenticateToken, handleGetChatMessages);

  return app;
}
