import { RequestHandler } from "express";
import { z } from "zod";
import { 
  Chat, 
  ChatMessage,
  ApiResponse,
  User 
} from "@shared/api";

// Mock database - In production, this would be replaced with actual database
const chats: Chat[] = [];
const messages: ChatMessage[] = [];
let chatIdCounter = 1;
let messageIdCounter = 1;

// Validation schemas
const createChatSchema = z.object({
  founderId: z.string(),
  investorId: z.string(),
  ideaId: z.string()
});

const sendMessageSchema = z.object({
  chatId: z.string(),
  content: z.string().min(1).max(1000)
});

// Create a new chat between founder and investor
export const handleCreateChat: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    const validatedData = createChatSchema.parse(req.body);

    // Check if chat already exists
    const existingChat = chats.find(
      chat => chat.founderId === validatedData.founderId && 
               chat.investorId === validatedData.investorId &&
               chat.ideaId === validatedData.ideaId
    );

    if (existingChat) {
      const response: ApiResponse<Chat> = {
        success: true,
        data: existingChat,
        message: "Chat already exists"
      };
      return res.json(response);
    }

    // Verify user is either the founder or investor in this chat
    if (user.id !== validatedData.founderId && user.id !== validatedData.investorId) {
      const response: ApiResponse = {
        success: false,
        error: "You can only create chats you're part of"
      };
      return res.status(403).json(response);
    }

    const newChat: Chat = {
      id: chatIdCounter.toString(),
      founderId: validatedData.founderId,
      investorId: validatedData.investorId,
      ideaId: validatedData.ideaId,
      createdAt: new Date().toISOString(),
      messages: []
    };

    chats.push(newChat);
    chatIdCounter++;

    const response: ApiResponse<Chat> = {
      success: true,
      data: newChat,
      message: "Chat created successfully"
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Create chat error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Invalid request data"
    };
    res.status(400).json(response);
  }
};

// Get all chats for current user
export const handleGetUserChats: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    
    const userChats = chats.filter(
      chat => chat.founderId === user.id || chat.investorId === user.id
    );

    // Add messages to each chat
    const chatsWithMessages = userChats.map(chat => ({
      ...chat,
      messages: messages.filter(msg => msg.chatId === chat.id)
    }));

    const response: ApiResponse<Chat[]> = {
      success: true,
      data: chatsWithMessages
    };

    res.json(response);
  } catch (error) {
    console.error("Get user chats error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch chats"
    };
    res.status(500).json(response);
  }
};

// Get specific chat by ID
export const handleGetChat: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user as User;
    
    const chat = chats.find(c => c.id === id);
    
    if (!chat) {
      const response: ApiResponse = {
        success: false,
        error: "Chat not found"
      };
      return res.status(404).json(response);
    }

    // Check if user is part of this chat
    if (chat.founderId !== user.id && chat.investorId !== user.id) {
      const response: ApiResponse = {
        success: false,
        error: "You don't have access to this chat"
      };
      return res.status(403).json(response);
    }

    // Add messages to chat
    const chatMessages = messages.filter(msg => msg.chatId === chat.id);
    const chatWithMessages: Chat = {
      ...chat,
      messages: chatMessages
    };

    const response: ApiResponse<Chat> = {
      success: true,
      data: chatWithMessages
    };

    res.json(response);
  } catch (error) {
    console.error("Get chat error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch chat"
    };
    res.status(500).json(response);
  }
};

// Send a message in a chat
export const handleSendMessage: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    const validatedData = sendMessageSchema.parse(req.body);

    const chat = chats.find(c => c.id === validatedData.chatId);
    
    if (!chat) {
      const response: ApiResponse = {
        success: false,
        error: "Chat not found"
      };
      return res.status(404).json(response);
    }

    // Check if user is part of this chat
    if (chat.founderId !== user.id && chat.investorId !== user.id) {
      const response: ApiResponse = {
        success: false,
        error: "You don't have access to this chat"
      };
      return res.status(403).json(response);
    }

    const newMessage: ChatMessage = {
      id: messageIdCounter.toString(),
      chatId: validatedData.chatId,
      senderId: user.id,
      content: validatedData.content,
      createdAt: new Date().toISOString()
    };

    messages.push(newMessage);
    messageIdCounter++;

    const response: ApiResponse<ChatMessage> = {
      success: true,
      data: newMessage,
      message: "Message sent successfully"
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Send message error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Invalid request data"
    };
    res.status(400).json(response);
  }
};

// Get messages for a specific chat
export const handleGetChatMessages: RequestHandler = (req, res) => {
  try {
    const { chatId } = req.params;
    const user = (req as any).user as User;
    
    const chat = chats.find(c => c.id === chatId);
    
    if (!chat) {
      const response: ApiResponse = {
        success: false,
        error: "Chat not found"
      };
      return res.status(404).json(response);
    }

    // Check if user is part of this chat
    if (chat.founderId !== user.id && chat.investorId !== user.id) {
      const response: ApiResponse = {
        success: false,
        error: "You don't have access to this chat"
      };
      return res.status(403).json(response);
    }

    const chatMessages = messages.filter(msg => msg.chatId === chatId);

    const response: ApiResponse<ChatMessage[]> = {
      success: true,
      data: chatMessages
    };

    res.json(response);
  } catch (error) {
    console.error("Get chat messages error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch messages"
    };
    res.status(500).json(response);
  }
};
