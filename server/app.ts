import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/database";
import { handleDemo } from "./routes/demo";

// Import MongoDB-based routes
import { handleLogin, handleRegister, handleLogout, authenticateToken } from "./routes/auth-mongo";

// Import other routes (you can update these to use MongoDB too)
import { 
  handleGetIdeas, 
  handleGetIdea, 
  handleCreateIdea, 
  handleUpdateIdea, 
  handleDeleteIdea,
  handleGetFounderIdeas 
} from "./routes/ideas";

import { 
  handleToggleLike, 
  handleGetIdeaLikes, 
  handleGetUserLikes, 
  handleCheckUserLike 
} from "./routes/likes";

import { 
  handleExpressInterest, 
  handleGetIdeaInvestments, 
  handleGetUserInvestments, 
  handleGetFounderInvestments,
  handleUpdateInvestment,
  handleDeleteInvestment 
} from "./routes/investments";

import { 
  handleCreateChat, 
  handleGetUserChats, 
  handleGetChat, 
  handleSendMessage, 
  handleGetChatMessages 
} from "./routes/chat";

export function createServer() {
  const app = express();

  // Connect to MongoDB
  connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "VentureLink API with MongoDB is running!";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes (MongoDB-based)
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/logout", authenticateToken, handleLogout);

  // Ideas routes (keeping existing localStorage-based for now)
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
