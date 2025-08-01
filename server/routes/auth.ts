import { RequestHandler } from "express";
import { z } from "zod";
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ApiResponse,
  User 
} from "@shared/api";

// Mock database - In production, this would be replaced with actual database
const users: User[] = [];
let userIdCounter = 1;

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

// Mock JWT token generation (in production, use proper JWT library)
const generateToken = (userId: string): string => {
  return `mock_token_${userId}_${Date.now()}`;
};

// Mock password hashing (in production, use bcrypt)
const hashPassword = (password: string): string => {
  return `hashed_${password}`;
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashedPassword === `hashed_${password}`;
};

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body) as LoginRequest;
    
    // Find user by email
    const user = users.find(u => u.email === validatedData.email);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid email or password"
      };
      return res.status(401).json(response);
    }

    // In production, verify hashed password
    // For demo purposes, we'll just check if password is "password123"
    if (validatedData.password !== "password123") {
      const response: ApiResponse = {
        success: false,
        error: "Invalid email or password"
      };
      return res.status(401).json(response);
    }

    const token = generateToken(user.id);
    const authResponse: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user,
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

export const handleRegister: RequestHandler = (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body) as RegisterRequest;
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === validatedData.email);
    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        error: "User with this email already exists"
      };
      return res.status(400).json(response);
    }

    // Create new user
    const newUser: User = {
      id: userIdCounter.toString(),
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
      company: validatedData.company,
      bio: validatedData.bio,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    userIdCounter++;

    const token = generateToken(newUser.id);
    const authResponse: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: newUser,
        token
      }
    };

    res.status(201).json(authResponse);
  } catch (error) {
    console.error("Registration error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Invalid request data"
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

// Middleware to verify authentication (mock implementation)
export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    const response: ApiResponse = {
      success: false,
      error: "Access token required"
    };
    return res.status(401).json(response);
  }

  // In production, verify JWT token properly
  // For demo purposes, extract user ID from mock token
  const userId = token.split('_')[2];
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    const response: ApiResponse = {
      success: false,
      error: "Invalid token"
    };
    return res.status(403).json(response);
  }

  // Add user to request object
  (req as any).user = user;
  next();
};
