import { RequestHandler } from "express";
import { z } from "zod";
import { 
  Investment, 
  ExpressInterestRequest,
  ApiResponse,
  User 
} from "@shared/api";

// Mock database - In production, this would be replaced with actual database
const investments: Investment[] = [];
let investmentIdCounter = 1;

// Validation schemas
const expressInterestSchema = z.object({
  ideaId: z.string(),
  amount: z.string().min(1)
});

const updateInvestmentSchema = z.object({
  status: z.enum(["interested", "negotiating", "funded"]).optional(),
  amount: z.string().optional()
});

// Express interest in an idea (investors only)
export const handleExpressInterest: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    
    if (user.role !== "investor") {
      const response: ApiResponse = {
        success: false,
        error: "Only investors can express interest"
      };
      return res.status(403).json(response);
    }

    const validatedData = expressInterestSchema.parse(req.body) as ExpressInterestRequest;

    // Check if investor already expressed interest in this idea
    const existingInvestment = investments.find(
      inv => inv.ideaId === validatedData.ideaId && inv.investorId === user.id
    );

    if (existingInvestment) {
      const response: ApiResponse = {
        success: false,
        error: "You have already expressed interest in this idea"
      };
      return res.status(400).json(response);
    }

    const newInvestment: Investment = {
      id: investmentIdCounter.toString(),
      ideaId: validatedData.ideaId,
      investorId: user.id,
      amount: validatedData.amount,
      status: "interested",
      createdAt: new Date().toISOString()
    };

    investments.push(newInvestment);
    investmentIdCounter++;

    const response: ApiResponse<Investment> = {
      success: true,
      data: newInvestment,
      message: "Interest expressed successfully"
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Express interest error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Invalid request data"
    };
    res.status(400).json(response);
  }
};

// Get investments for a specific idea (for founder dashboard)
export const handleGetIdeaInvestments: RequestHandler = (req, res) => {
  try {
    const { ideaId } = req.params;
    const user = (req as any).user as User;
    
    const ideaInvestments = investments.filter(inv => inv.ideaId === ideaId);
    
    // If user is not the founder of the idea, they can only see their own investment
    // For demo purposes, we'll show all investments to founders
    
    const response: ApiResponse<Investment[]> = {
      success: true,
      data: ideaInvestments
    };

    res.json(response);
  } catch (error) {
    console.error("Get idea investments error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch investments"
    };
    res.status(500).json(response);
  }
};

// Get all investments by current user (for investor dashboard)
export const handleGetUserInvestments: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    
    if (user.role !== "investor") {
      const response: ApiResponse = {
        success: false,
        error: "Only investors can access this endpoint"
      };
      return res.status(403).json(response);
    }

    const userInvestments = investments.filter(inv => inv.investorId === user.id);
    
    const response: ApiResponse<Investment[]> = {
      success: true,
      data: userInvestments
    };

    res.json(response);
  } catch (error) {
    console.error("Get user investments error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch user investments"
    };
    res.status(500).json(response);
  }
};

// Get investments for founder's ideas (for founder dashboard)
export const handleGetFounderInvestments: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    
    if (user.role !== "founder") {
      const response: ApiResponse = {
        success: false,
        error: "Only founders can access this endpoint"
      };
      return res.status(403).json(response);
    }

    // For demo purposes, we'll return all investments
    // In production, you'd filter by founder's ideas
    const founderInvestments = investments;
    
    const response: ApiResponse<Investment[]> = {
      success: true,
      data: founderInvestments
    };

    res.json(response);
  } catch (error) {
    console.error("Get founder investments error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch founder investments"
    };
    res.status(500).json(response);
  }
};

// Update investment status (for negotiations)
export const handleUpdateInvestment: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user as User;
    
    const investmentIndex = investments.findIndex(inv => inv.id === id);
    if (investmentIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Investment not found"
      };
      return res.status(404).json(response);
    }

    const investment = investments[investmentIndex];
    
    // Check if user is either the investor or has permission to update
    if (investment.investorId !== user.id && user.role !== "founder") {
      const response: ApiResponse = {
        success: false,
        error: "You don't have permission to update this investment"
      };
      return res.status(403).json(response);
    }

    const validatedData = updateInvestmentSchema.parse(req.body);
    
    // Update the investment
    investments[investmentIndex] = {
      ...investment,
      ...validatedData
    };

    const response: ApiResponse<Investment> = {
      success: true,
      data: investments[investmentIndex],
      message: "Investment updated successfully"
    };

    res.json(response);
  } catch (error) {
    console.error("Update investment error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Invalid request data"
    };
    res.status(400).json(response);
  }
};

// Delete/withdraw investment interest
export const handleDeleteInvestment: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user as User;
    
    const investmentIndex = investments.findIndex(inv => inv.id === id);
    if (investmentIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Investment not found"
      };
      return res.status(404).json(response);
    }

    const investment = investments[investmentIndex];
    
    // Check if user owns this investment
    if (investment.investorId !== user.id) {
      const response: ApiResponse = {
        success: false,
        error: "You can only withdraw your own investments"
      };
      return res.status(403).json(response);
    }

    investments.splice(investmentIndex, 1);

    const response: ApiResponse = {
      success: true,
      message: "Investment interest withdrawn successfully"
    };

    res.json(response);
  } catch (error) {
    console.error("Delete investment error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to withdraw investment"
    };
    res.status(500).json(response);
  }
};
