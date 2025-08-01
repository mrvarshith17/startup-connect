/**
 * Shared code between client and server
 * API types and interfaces for VentureLink platform
 */

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "founder" | "investor";
  company?: string;
  bio?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "founder" | "investor";
  company?: string;
  bio?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Idea types
export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  founderId: string;
  founder: {
    name: string;
    company?: string;
  };
  createdAt: string;
  likes: number;
  status: "active" | "funded" | "closed";
  fundingGoal?: string;
  document?: {
    filename: string;
    url: string;
  };
}

export interface CreateIdeaRequest {
  title: string;
  description: string;
  category: string;
  fundingGoal?: string;
}

// Investment types
export interface Investment {
  id: string;
  ideaId: string;
  investorId: string;
  amount: string;
  status: "interested" | "negotiating" | "funded";
  createdAt: string;
}

export interface ExpressInterestRequest {
  ideaId: string;
  amount: string;
}

// Like types
export interface Like {
  id: string;
  ideaId: string;
  userId: string;
  createdAt: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  founderId: string;
  investorId: string;
  ideaId: string;
  createdAt: string;
  messages: ChatMessage[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Query types
export interface IdeasQuery {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}
