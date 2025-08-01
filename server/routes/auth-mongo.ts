import { RequestHandler } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
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

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body) as LoginRequest;
    
    // Find user by email
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid email or password"
      };
      return res.status(401).json(response);
    }

    // For demo purposes, we'll skip password verification
    // In production, you'd verify with: await bcrypt.compare(validatedData.password, user.password)
    
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

    const authResponse: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: userResponse,
        token
      }
    };

    res.json(authResponse);
  } catch (error) {
    console.error("Login error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Invalid request data"
    };
    res.status(400).json(response);
  }
};

export const handleRegister: RequestHandler = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body) as RegisterRequest;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        error: "User with this email already exists"
      };
      return res.status(400).json(response);
    }

    // For demo purposes, we'll store password as-is
    // In production, hash password: const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create new user
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

    const authResponse: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: userResponse,
        token
      }
    };

    res.status(201).json(authResponse);
  } catch (error) {
    console.error("Registration error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Registration failed"
    };
    res.status(400).json(response);
  }
};

export const handleLogout: RequestHandler = (req, res) => {
  // In production, you would invalidate the token here
  const response: ApiResponse = {
    success: true,
    message: "Logged out successfully"
  };
  res.json(response);
};

// Middleware to verify authentication
export const authenticateToken: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    const response: ApiResponse = {
      success: false,
      error: "Access token required"
    };
    return res.status(401).json(response);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid token"
      };
      return res.status(403).json(response);
    }

    // Add user to request object
    (req as any).user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      bio: user.bio
    };
    
    next();
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: "Invalid token"
    };
    return res.status(403).json(response);
  }
};
