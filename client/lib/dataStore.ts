// Simulated database using localStorage
// This replaces the need for MongoDB connection in demo

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  likes: number;
  founderId: string;
  founder: {
    name: string;
    company?: string;
  };
  interestedInvestors: Array<{
    id: string;
    name: string;
    firm: string;
    amount: string;
  }>;
  status: "active" | "funded" | "closed";
  document?: File | null;
}

// Initialize with some mock data if localStorage is empty
const initializeDefaultIdeas = (): Idea[] => [
  {
    id: "1",
    title: "AI-Powered Personal Finance Assistant",
    description:
      "An intelligent chatbot that helps users manage their finances, track expenses, and provide personalized investment advice using machine learning.",
    category: "FinTech",
    createdAt: "2024-01-15",
    likes: 12,
    founderId: "demo_founder_1",
    founder: {
      name: "John Smith",
      company: "FinanceAI Inc.",
    },
    interestedInvestors: [
      { id: "1", name: "Sarah Chen", firm: "TechVentures", amount: "$250k" },
      {
        id: "2",
        name: "Mike Rodriguez",
        firm: "Innovation Capital",
        amount: "$500k",
      },
      { id: "3", name: "Alex Thompson", firm: "Future Fund", amount: "$1M" },
    ],
    status: "active",
  },
  {
    id: "2",
    title: "Sustainable Fashion Marketplace",
    description:
      "A platform connecting eco-conscious consumers with sustainable fashion brands, featuring carbon footprint tracking and ethical sourcing verification.",
    category: "E-commerce",
    createdAt: "2024-01-10",
    likes: 8,
    founderId: "demo_founder_2",
    founder: {
      name: "Emily Chen",
      company: "EcoWear",
    },
    interestedInvestors: [
      { id: "4", name: "Emma Wilson", firm: "Green Ventures", amount: "$150k" },
    ],
    status: "active",
  },
];

export class DataStore {
  private static IDEAS_KEY = "venturelink_ideas";
  private static LIKES_KEY = "venturelink_likes";
  private static INVESTMENTS_KEY = "venturelink_investments";

  // Ideas management
  static getAllIdeas(): Idea[] {
    try {
      const stored = localStorage.getItem(this.IDEAS_KEY);
      if (!stored) {
        const defaultIdeas = initializeDefaultIdeas();
        this.saveIdeas(defaultIdeas);
        return defaultIdeas;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error loading ideas:", error);
      return initializeDefaultIdeas();
    }
  }

  static saveIdeas(ideas: Idea[]): void {
    try {
      localStorage.setItem(this.IDEAS_KEY, JSON.stringify(ideas));
    } catch (error) {
      console.error("Error saving ideas:", error);
    }
  }

  static addIdea(
    newIdea: Omit<
      Idea,
      "id" | "createdAt" | "likes" | "interestedInvestors" | "status"
    >,
  ): Idea {
    const ideas = this.getAllIdeas();
    const idea: Idea = {
      ...newIdea,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      likes: 0,
      interestedInvestors: [],
      status: "active",
    };

    ideas.unshift(idea); // Add to beginning
    this.saveIdeas(ideas);
    return idea;
  }

  static getIdeasByFounder(founderId: string): Idea[] {
    const allIdeas = this.getAllIdeas();
    return allIdeas.filter((idea) => idea.founderId === founderId);
  }

  static updateIdea(ideaId: string, updates: Partial<Idea>): Idea | null {
    const ideas = this.getAllIdeas();
    const ideaIndex = ideas.findIndex((idea) => idea.id === ideaId);

    if (ideaIndex === -1) return null;

    ideas[ideaIndex] = { ...ideas[ideaIndex], ...updates };
    this.saveIdeas(ideas);
    return ideas[ideaIndex];
  }

  // Likes management
  static getLikedIdeas(userId: string): string[] {
    try {
      const stored = localStorage.getItem(this.LIKES_KEY);
      if (!stored) return [];
      const allLikes = JSON.parse(stored);
      return allLikes[userId] || [];
    } catch (error) {
      console.error("Error loading likes:", error);
      return [];
    }
  }

  static toggleLike(userId: string, ideaId: string): boolean {
    try {
      const stored = localStorage.getItem(this.LIKES_KEY);
      const allLikes = stored ? JSON.parse(stored) : {};

      if (!allLikes[userId]) {
        allLikes[userId] = [];
      }

      const userLikes = allLikes[userId];
      const isLiked = userLikes.includes(ideaId);

      if (isLiked) {
        allLikes[userId] = userLikes.filter((id: string) => id !== ideaId);
      } else {
        allLikes[userId].push(ideaId);
      }

      localStorage.setItem(this.LIKES_KEY, JSON.stringify(allLikes));

      // Update the idea's like count
      const ideas = this.getAllIdeas();
      const ideaIndex = ideas.findIndex((idea) => idea.id === ideaId);
      if (ideaIndex !== -1) {
        ideas[ideaIndex].likes += isLiked ? -1 : 1;
        this.saveIdeas(ideas);
      }

      return !isLiked; // Return new like status
    } catch (error) {
      console.error("Error toggling like:", error);
      return false;
    }
  }

  // Investment interest management
  static getInvestments(): any[] {
    try {
      const stored = localStorage.getItem(this.INVESTMENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading investments:", error);
      return [];
    }
  }

  static addInvestment(investment: any): void {
    try {
      const investments = this.getInvestments();
      investments.push({
        ...investment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "interested", // interested, liked_back, declined
      });
      localStorage.setItem(this.INVESTMENTS_KEY, JSON.stringify(investments));

      // Also update the idea with interested investor
      this.updateIdeaWithInvestor(investment.ideaId, investment);
    } catch (error) {
      console.error("Error adding investment:", error);
    }
  }

  static getInvestmentByUserAndIdea(
    userId: string,
    ideaId: string,
  ): any | null {
    const investments = this.getInvestments();
    return (
      investments.find(
        (inv) => inv.investorId === userId && inv.ideaId === ideaId,
      ) || null
    );
  }

  static getInvestmentsForIdea(ideaId: string): any[] {
    return this.getInvestments().filter((inv) => inv.ideaId === ideaId);
  }

  static updateInvestmentStatus(investmentId: string, status: string): void {
    try {
      const investments = this.getInvestments();
      const index = investments.findIndex((inv) => inv.id === investmentId);
      if (index !== -1) {
        investments[index].status = status;
        localStorage.setItem(this.INVESTMENTS_KEY, JSON.stringify(investments));
      }
    } catch (error) {
      console.error("Error updating investment status:", error);
    }
  }

  private static updateIdeaWithInvestor(ideaId: string, investment: any): void {
    const ideas = this.getAllIdeas();
    const ideaIndex = ideas.findIndex((idea) => idea.id === ideaId);
    if (ideaIndex !== -1) {
      if (!ideas[ideaIndex].interestedInvestors) {
        ideas[ideaIndex].interestedInvestors = [];
      }

      // Check if investor already in list
      const existingIndex = ideas[ideaIndex].interestedInvestors.findIndex(
        (inv: any) => inv.investorId === investment.investorId,
      );

      const investorData = {
        id: investment.investorId,
        investorId: investment.investorId,
        name: investment.investorName,
        firm: "Investment Firm", // Could be stored in user profile
        amount: investment.amount,
        status: investment.status || "interested",
      };

      if (existingIndex !== -1) {
        ideas[ideaIndex].interestedInvestors[existingIndex] = investorData;
      } else {
        ideas[ideaIndex].interestedInvestors.push(investorData);
      }

      this.saveIdeas(ideas);
    }
  }

  // Check if there's mutual interest (both parties liked each other)
  static hasMutualInterest(
    founderId: string,
    investorId: string,
    ideaId: string,
  ): boolean {
    // Check if investor liked the idea
    const investorLikes = this.getLikedIdeas(investorId);
    const investorLikedIdea = investorLikes.includes(ideaId);

    // Check if there's an investment from this investor
    const investment = this.getInvestmentByUserAndIdea(investorId, ideaId);
    const hasInvestment = !!investment;

    // Check if founder liked back (we'll simulate this by checking if investment status is 'liked_back')
    const founderLikedBack = investment?.status === "liked_back";

    return investorLikedIdea && hasInvestment && founderLikedBack;
  }

  // Founder likes back an investor (enables chat)
  static founderLikeBack(investorId: string, ideaId: string): void {
    const investments = this.getInvestments();
    const investment = investments.find(
      (inv) => inv.investorId === investorId && inv.ideaId === ideaId,
    );
    if (investment) {
      investment.status = "liked_back";
      localStorage.setItem(this.INVESTMENTS_KEY, JSON.stringify(investments));
    }
  }

  // Utility methods
  static getCurrentUserId(): string {
    // Use MongoDB user ID if available, fallback to email-based ID
    const mongoUserId = localStorage.getItem("user_id");
    if (mongoUserId) {
      return mongoUserId;
    }

    // Fallback for backward compatibility
    const email = localStorage.getItem("user_email");
    return email ? `user_${email.replace(/[^a-zA-Z0-9]/g, "_")}` : "anonymous";
  }

  static getCurrentUserEmail(): string {
    return localStorage.getItem("user_email") || "";
  }

  static getCurrentUserName(): string {
    return localStorage.getItem("user_name") || "User";
  }

  // Chat system
  private static CHATS_KEY = "venturelink_chats";

  static getChats(): any[] {
    try {
      const stored = localStorage.getItem(this.CHATS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading chats:", error);
      return [];
    }
  }

  static saveChats(chats: any[]): void {
    try {
      localStorage.setItem(this.CHATS_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error("Error saving chats:", error);
    }
  }

  // Generate unique chat ID for founder-investor pair
  static generateChatId(
    founderId: string,
    investorId: string,
    ideaId: string,
  ): string {
    return `chat_${founderId}_${investorId}_${ideaId}`;
  }

  // Get or create chat between founder and investor for specific idea
  static getOrCreateChat(
    founderId: string,
    investorId: string,
    ideaId: string,
  ): any {
    const chats = this.getChats();
    const chatId = this.generateChatId(founderId, investorId, ideaId);

    let chat = chats.find((c) => c.id === chatId);

    if (!chat) {
      chat = {
        id: chatId,
        founderId,
        investorId,
        ideaId,
        messages: [],
        createdAt: new Date().toISOString(),
      };
      chats.push(chat);
      this.saveChats(chats);
    }

    return chat;
  }

  // Add message to specific chat
  static addMessageToChat(
    chatId: string,
    senderId: string,
    senderName: string,
    message: string,
  ): void {
    const chats = this.getChats();
    const chatIndex = chats.findIndex((c) => c.id === chatId);

    if (chatIndex !== -1) {
      const newMessage = {
        id: Date.now().toString(),
        senderId,
        senderName,
        message,
        timestamp: new Date().toISOString(),
      };

      chats[chatIndex].messages.push(newMessage);
      this.saveChats(chats);
    }
  }

  // Get chat by ID
  static getChatById(chatId: string): any | null {
    const chats = this.getChats();
    return chats.find((c) => c.id === chatId) || null;
  }

  // Get all chats for a user
  static getChatsForUser(userId: string): any[] {
    const chats = this.getChats();
    return chats.filter(
      (chat) => chat.founderId === userId || chat.investorId === userId,
    );
  }

  // Clear all data (for debugging)
  static clearAllData(): void {
    localStorage.removeItem(this.IDEAS_KEY);
    localStorage.removeItem(this.LIKES_KEY);
    localStorage.removeItem(this.INVESTMENTS_KEY);
    localStorage.removeItem(this.CHATS_KEY);
  }
}
