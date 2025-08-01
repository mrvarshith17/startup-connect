import { RequestHandler } from "express";
import { z } from "zod";
import { 
  Like, 
  ApiResponse,
  User 
} from "@shared/api";

// Mock database - In production, this would be replaced with actual database
const likes: Like[] = [];
let likeIdCounter = 1;

// Validation schemas
const toggleLikeSchema = z.object({
  ideaId: z.string()
});

// Toggle like on an idea (investors only)
export const handleToggleLike: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    
    if (user.role !== "investor") {
      const response: ApiResponse = {
        success: false,
        error: "Only investors can like ideas"
      };
      return res.status(403).json(response);
    }

    const validatedData = toggleLikeSchema.parse(req.body);
    const { ideaId } = validatedData;

    // Check if user already liked this idea
    const existingLikeIndex = likes.findIndex(
      like => like.ideaId === ideaId && like.userId === user.id
    );

    if (existingLikeIndex !== -1) {
      // Unlike - remove the like
      likes.splice(existingLikeIndex, 1);
      
      const response: ApiResponse = {
        success: true,
        message: "Idea unliked successfully"
      };
      
      return res.json(response);
    } else {
      // Like - add new like
      const newLike: Like = {
        id: likeIdCounter.toString(),
        ideaId,
        userId: user.id,
        createdAt: new Date().toISOString()
      };

      likes.push(newLike);
      likeIdCounter++;

      const response: ApiResponse<Like> = {
        success: true,
        data: newLike,
        message: "Idea liked successfully"
      };

      return res.status(201).json(response);
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Invalid request data"
    };
    res.status(400).json(response);
  }
};

// Get likes for a specific idea
export const handleGetIdeaLikes: RequestHandler = (req, res) => {
  try {
    const { ideaId } = req.params;
    
    const ideaLikes = likes.filter(like => like.ideaId === ideaId);
    
    const response: ApiResponse<Like[]> = {
      success: true,
      data: ideaLikes
    };

    res.json(response);
  } catch (error) {
    console.error("Get idea likes error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch likes"
    };
    res.status(500).json(response);
  }
};

// Get user's liked ideas (for investor dashboard)
export const handleGetUserLikes: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    
    if (user.role !== "investor") {
      const response: ApiResponse = {
        success: false,
        error: "Only investors can access this endpoint"
      };
      return res.status(403).json(response);
    }

    const userLikes = likes.filter(like => like.userId === user.id);
    
    const response: ApiResponse<Like[]> = {
      success: true,
      data: userLikes
    };

    res.json(response);
  } catch (error) {
    console.error("Get user likes error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch user likes"
    };
    res.status(500).json(response);
  }
};

// Check if user has liked a specific idea
export const handleCheckUserLike: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    const { ideaId } = req.params;
    
    const hasLiked = likes.some(
      like => like.ideaId === ideaId && like.userId === user.id
    );
    
    const response: ApiResponse<{ hasLiked: boolean }> = {
      success: true,
      data: { hasLiked }
    };

    res.json(response);
  } catch (error) {
    console.error("Check user like error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to check like status"
    };
    res.status(500).json(response);
  }
};
