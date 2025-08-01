import { RequestHandler } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import User from "../models/User";
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ApiResponse 
} from "@shared/api";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["founder", "investor"]),
  company: z.string().optional(),
  bio: z.string().optional()
});

// Check if MongoDB is connected
const isMongoConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

// Generate simple token for demo
const generateToken = (userId: string): string => {
  return `token_${userId}_${Date.now()}`;
};

// localStorage-based fallback (for when MongoDB is not available)
let localUsers: any[] = [];

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body) as LoginRequest;
    
    if (isMongoConnected()) {
      // MongoDB mode
      try {
        const user = await User.findOne({ email: validatedData.email });
        if (!user) {
          return res.status(401).json({
            success: false,
            error: "Invalid email or password"
          });
        }

        const token = generateToken(user._id.toString());
        
        const userResponse = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company,
          bio: user.bio,
          createdAt: user.createdAt.toISOString()
        };

        return res.json({
          success: true,
          data: { user: userResponse, token }
        });
      } catch (error) {
        console.error("MongoDB query error:", error);
        // Fall through to localStorage mode
      }
    }
    
    // localStorage fallback mode
    const user = localUsers.find(u => u.email === validatedData.email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password (localStorage mode)"
      });
    }

    const token = generateToken(user.id);
    
    res.json({
      success: true,
      data: { user, token }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({
      success: false,
      error: "Invalid request data"
    });
  }
};

export const handleRegister: RequestHandler = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body) as RegisterRequest;
    
    if (isMongoConnected()) {
      // MongoDB mode
      try {
        const existingUser = await User.findOne({ email: validatedData.email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            error: "User with this email already exists"
          });
        }

        const newUser = new User({
          name: validatedData.name,
          email: validatedData.email,
          role: validatedData.role,
          company: validatedData.company,
          bio: validatedData.bio
        });

        await newUser.save();

        const token = generateToken(newUser._id.toString());
        
        const userResponse = {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          company: newUser.company,
          bio: newUser.bio,
          createdAt: newUser.createdAt.toISOString()
        };

        return res.status(201).json({
          success: true,
          data: { user: userResponse, token }
        });
      } catch (error) {
        console.error("MongoDB save error:", error);
        // Fall through to localStorage mode
      }
    }
    
    // localStorage fallback mode
    const existingUser = localUsers.find(u => u.email === validatedData.email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists (localStorage mode)"
      });
    }

    const newUser = {
      id: Date.now().toString(),
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
      company: validatedData.company,
      bio: validatedData.bio,
      createdAt: new Date().toISOString()
    };

    localUsers.push(newUser);

    const token = generateToken(newUser.id);
    
    res.status(201).json({
      success: true,
      data: { user: newUser, token }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      success: false,
      error: "Registration failed"
    });
  }
};

export const handleLogout: RequestHandler = (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
};

// Simple token verification for demo
export const authenticateToken: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access token required"
    });
  }

  try {
    // Extract user ID from token
    const userId = token.split('_')[1];
    
    if (isMongoConnected()) {
      // MongoDB mode
      try {
        const user = await User.findById(userId);
        if (user) {
          (req as any).user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company,
            bio: user.bio
          };
          return next();
        }
      } catch (error) {
        console.error("MongoDB auth error:", error);
        // Fall through to localStorage mode
      }
    }
    
    // localStorage fallback mode
    const user = localUsers.find(u => u.id === userId);
    if (!user) {
      return res.status(403).json({
        success: false,
        error: "Invalid token"
      });
    }

    (req as any).user = user;
    next();

  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Invalid token"
    });
  }
};
