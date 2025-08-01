import { RequestHandler } from "express";
import { z } from "zod";
import { 
  Idea, 
  CreateIdeaRequest, 
  ApiResponse, 
  PaginatedResponse,
  IdeasQuery,
  User
} from "@shared/api";

// Mock database - In production, this would be replaced with actual database
const ideas: Idea[] = [
  {
    id: "1",
    title: "AI-Powered Personal Finance Assistant",
    description: "An intelligent chatbot that helps users manage their finances, track expenses, and provide personalized investment advice using machine learning algorithms.",
    category: "FinTech",
    founderId: "1",
    founder: {
      name: "John Smith",
      company: "FinanceAI Inc."
    },
    createdAt: "2024-01-15T10:00:00Z",
    likes: 12,
    status: "active",
    fundingGoal: "$500k"
  },
  {
    id: "2",
    title: "Sustainable Fashion Marketplace",
    description: "A platform connecting eco-conscious consumers with sustainable fashion brands, featuring carbon footprint tracking and ethical sourcing verification.",
    category: "E-commerce",
    founderId: "2",
    founder: {
      name: "Emily Chen",
      company: "EcoWear"
    },
    createdAt: "2024-01-10T10:00:00Z",
    likes: 8,
    status: "active",
    fundingGoal: "$300k"
  },
  {
    id: "3",
    title: "Remote Healthcare Monitoring",
    description: "IoT-enabled health monitoring devices that allow patients to track vital signs from home and share data with healthcare providers in real-time.",
    category: "HealthTech",
    founderId: "3",
    founder: {
      name: "Dr. Michael Rodriguez",
      company: "HealthConnect"
    },
    createdAt: "2024-01-08T10:00:00Z",
    likes: 15,
    status: "active",
    fundingGoal: "$1M"
  },
  {
    id: "4",
    title: "AR Learning Platform for Kids",
    description: "An augmented reality educational platform that makes learning interactive and engaging for children aged 6-12.",
    category: "EdTech",
    founderId: "4",
    founder: {
      name: "Sarah Johnson",
      company: "LearnAR"
    },
    createdAt: "2024-01-05T10:00:00Z",
    likes: 10,
    status: "active",
    fundingGoal: "$750k"
  }
];

let ideaIdCounter = 5;

// Validation schemas
const createIdeaSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(2000),
  category: z.string().min(2),
  fundingGoal: z.string().optional()
});

const updateIdeaSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(20).max(2000).optional(),
  category: z.string().min(2).optional(),
  fundingGoal: z.string().optional(),
  status: z.enum(["active", "funded", "closed"]).optional()
});

// Get all ideas with filtering and pagination
export const handleGetIdeas: RequestHandler = (req, res) => {
  try {
    const { category, search, page = "1", limit = "10" } = req.query as IdeasQuery & { page?: string; limit?: string };
    
    let filteredIdeas = [...ideas];

    // Filter by category
    if (category && category !== "all") {
      filteredIdeas = filteredIdeas.filter(idea => 
        idea.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredIdeas = filteredIdeas.filter(idea =>
        idea.title.toLowerCase().includes(searchLower) ||
        idea.description.toLowerCase().includes(searchLower) ||
        idea.founder.name.toLowerCase().includes(searchLower) ||
        (idea.founder.company && idea.founder.company.toLowerCase().includes(searchLower))
      );
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedIdeas = filteredIdeas.slice(startIndex, endIndex);

    const response: ApiResponse<PaginatedResponse<Idea>> = {
      success: true,
      data: {
        data: paginatedIdeas,
        total: filteredIdeas.length,
        page: pageNum,
        limit: limitNum
      }
    };

    res.json(response);
  } catch (error) {
    console.error("Get ideas error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch ideas"
    };
    res.status(500).json(response);
  }
};

// Get a specific idea by ID
export const handleGetIdea: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const idea = ideas.find(i => i.id === id);

    if (!idea) {
      const response: ApiResponse = {
        success: false,
        error: "Idea not found"
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Idea> = {
      success: true,
      data: idea
    };

    res.json(response);
  } catch (error) {
    console.error("Get idea error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch idea"
    };
    res.status(500).json(response);
  }
};

// Create a new idea (founders only)
export const handleCreateIdea: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    
    if (user.role !== "founder") {
      const response: ApiResponse = {
        success: false,
        error: "Only founders can create ideas"
      };
      return res.status(403).json(response);
    }

    const validatedData = createIdeaSchema.parse(req.body) as CreateIdeaRequest;

    const newIdea: Idea = {
      id: ideaIdCounter.toString(),
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      founderId: user.id,
      founder: {
        name: user.name,
        company: user.company
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      status: "active",
      fundingGoal: validatedData.fundingGoal
    };

    ideas.push(newIdea);
    ideaIdCounter++;

    const response: ApiResponse<Idea> = {
      success: true,
      data: newIdea,
      message: "Idea created successfully"
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Create idea error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Invalid request data"
    };
    res.status(400).json(response);
  }
};

// Update an idea (idea owner only)
export const handleUpdateIdea: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user as User;
    
    const ideaIndex = ideas.findIndex(i => i.id === id);
    if (ideaIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Idea not found"
      };
      return res.status(404).json(response);
    }

    const idea = ideas[ideaIndex];
    
    // Check if user owns this idea
    if (idea.founderId !== user.id) {
      const response: ApiResponse = {
        success: false,
        error: "You can only update your own ideas"
      };
      return res.status(403).json(response);
    }

    const validatedData = updateIdeaSchema.parse(req.body);
    
    // Update the idea
    ideas[ideaIndex] = {
      ...idea,
      ...validatedData
    };

    const response: ApiResponse<Idea> = {
      success: true,
      data: ideas[ideaIndex],
      message: "Idea updated successfully"
    };

    res.json(response);
  } catch (error) {
    console.error("Update idea error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Invalid request data"
    };
    res.status(400).json(response);
  }
};

// Delete an idea (idea owner only)
export const handleDeleteIdea: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user as User;
    
    const ideaIndex = ideas.findIndex(i => i.id === id);
    if (ideaIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Idea not found"
      };
      return res.status(404).json(response);
    }

    const idea = ideas[ideaIndex];
    
    // Check if user owns this idea
    if (idea.founderId !== user.id) {
      const response: ApiResponse = {
        success: false,
        error: "You can only delete your own ideas"
      };
      return res.status(403).json(response);
    }

    ideas.splice(ideaIndex, 1);

    const response: ApiResponse = {
      success: true,
      message: "Idea deleted successfully"
    };

    res.json(response);
  } catch (error) {
    console.error("Delete idea error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to delete idea"
    };
    res.status(500).json(response);
  }
};

// Get ideas by founder (for founder dashboard)
export const handleGetFounderIdeas: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    
    if (user.role !== "founder") {
      const response: ApiResponse = {
        success: false,
        error: "Only founders can access this endpoint"
      };
      return res.status(403).json(response);
    }

    const founderIdeas = ideas.filter(idea => idea.founderId === user.id);

    const response: ApiResponse<Idea[]> = {
      success: true,
      data: founderIdeas
    };

    res.json(response);
  } catch (error) {
    console.error("Get founder ideas error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch founder ideas"
    };
    res.status(500).json(response);
  }
};
