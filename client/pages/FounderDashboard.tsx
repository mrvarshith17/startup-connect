import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Zap,
  Plus,
  Upload,
  FileText,
  Users,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  DollarSign,
  Bell,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DataStore } from "@/lib/dataStore";

export default function FounderDashboard() {
  const navigate = useNavigate();
  const [newIdea, setNewIdea] = useState({
    title: "",
    description: "",
    category: "",
    document: null as File | null,
  });
  const [showNewIdeaDialog, setShowNewIdeaDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [myIdeas, setMyIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedIdeaForDetails, setSelectedIdeaForDetails] =
    useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [allChats, setAllChats] = useState<any[]>([]);

  // Load user's ideas on component mount
  useEffect(() => {
    fetchMyIdeas();
    loadInvestments();
    loadChats();
  }, []);

  const loadInvestments = () => {
    const allInvestments = DataStore.getInvestments();
    setInvestments(allInvestments);
  };

  const loadChats = () => {
    const userId = DataStore.getCurrentUserId();
    const userChats = DataStore.getChatsForUser(userId);
    setAllChats(userChats);

    // Load all messages from all chats for display in Messages tab
    const allMessages = userChats.flatMap((chat) =>
      chat.messages.map((msg: any) => ({
        ...msg,
        chatId: chat.id,
        otherParty:
          chat.founderId === userId ? chat.investorId : chat.founderId,
      })),
    );
    setChatHistory(allMessages);
  };

  const fetchMyIdeas = async () => {
    try {
      setLoading(true);
      // Get current user's ideas from shared data store
      const userId = DataStore.getCurrentUserId();
      const allIdeas = DataStore.getIdeasByFounder(userId);
      setMyIdeas(allIdeas);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "FinTech",
    "HealthTech",
    "EdTech",
    "E-commerce",
    "SaaS",
    "AI/ML",
    "Blockchain",
    "IoT",
    "CleanTech",
    "FoodTech",
    "Mobility",
    "Other",
  ];

  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newIdea.title || !newIdea.description || !newIdea.category) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add idea to shared data store
      const userId = DataStore.getCurrentUserId();
      const userName = DataStore.getCurrentUserName();

      const savedIdea = DataStore.addIdea({
        title: newIdea.title,
        description: newIdea.description,
        category: newIdea.category,
        founderId: userId,
        founder: {
          name: userName,
          company: "Your Company", // Could be stored in user profile
        },
        document: newIdea.document,
      });

      // Refresh ideas from data store to ensure consistency
      fetchMyIdeas();
      loadInvestments();
      setShowNewIdeaDialog(false);
      setNewIdea({ title: "", description: "", category: "", document: null });

      alert(
        "Idea submitted successfully! It will now be visible to investors.",
      );
    } catch (error) {
      console.error("Error submitting idea:", error);
      alert("Failed to submit idea. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewIdea((prev) => ({ ...prev, document: file }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  const handleStartChat = (investor: any) => {
    const userId = DataStore.getCurrentUserId();

    // Find the idea that this investor is interested in
    const investment = investments.find(
      (inv) => inv.investorId === investor.investorId,
    );
    if (!investment) {
      alert("Unable to find investment record");
      return;
    }

    // Get or create chat for this founder-investor-idea combination
    const chat = DataStore.getOrCreateChat(
      userId,
      investor.investorId,
      investment.ideaId,
    );
    setCurrentChatId(chat.id);

    // Load current chat messages
    const currentChat = DataStore.getChatById(chat.id);
    setChatHistory(currentChat?.messages || []);

    setSelectedInvestor(investor);
    setShowChatDialog(true);
  };

  const handleLikeBack = (investorId: string, ideaId: string) => {
    DataStore.founderLikeBack(investorId, ideaId);
    loadInvestments();
    alert("You liked back! Chat is now enabled with this investor.");
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !currentChatId) return;

    try {
      const userId = DataStore.getCurrentUserId();
      const userName = DataStore.getCurrentUserName();

      // Add message to shared chat storage
      DataStore.addMessageToChat(currentChatId, userId, userName, chatMessage);

      // Reload chats to get updated messages
      loadChats();

      // Clear input
      setChatMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              VentureLink
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {DataStore.getCurrentUserName()}!
          </h1>
          <p className="text-muted-foreground">
            Manage your ideas and connect with investors on your founder
            journey.
          </p>
          {/* Debug info - remove in production */}
          <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
            <p>
              <strong>Debug Info:</strong>
            </p>
            <p>User ID: {DataStore.getCurrentUserId()}</p>
            <p>Email: {DataStore.getCurrentUserEmail()}</p>
            <p>Total Ideas in Database: {DataStore.getAllIdeas().length}</p>
            <p>Your Ideas: {myIdeas.length}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                DataStore.clearAllData();
                window.location.reload();
              }}
              className="mt-2"
            >
              Clear All Data & Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Ideas
                  </p>
                  <p className="text-2xl font-bold">{myIdeas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Likes
                  </p>
                  <p className="text-2xl font-bold">
                    {myIdeas.reduce((sum, idea) => sum + idea.likes, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-secondary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Interested Investors
                  </p>
                  <p className="text-2xl font-bold">
                    {myIdeas.reduce(
                      (sum, idea) => sum + idea.interestedInvestors.length,
                      0,
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Chats
                  </p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="ideas" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <TabsList>
              <TabsTrigger value="ideas">My Ideas</TabsTrigger>
              <TabsTrigger value="investors">Interested Investors</TabsTrigger>
              <TabsTrigger value="chats">Messages</TabsTrigger>
            </TabsList>

            <Dialog
              open={showNewIdeaDialog}
              onOpenChange={setShowNewIdeaDialog}
            >
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 mt-4 sm:mt-0">
                  <Plus className="mr-2 h-4 w-4" />
                  Submit New Idea
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Submit a New Idea</DialogTitle>
                  <DialogDescription>
                    Share your innovative startup concept with potential
                    investors.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitIdea} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Idea Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter your idea title"
                      value={newIdea.title}
                      onChange={(e) =>
                        setNewIdea((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      onValueChange={(value) =>
                        setNewIdea((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your idea in detail..."
                      value={newIdea.description}
                      onChange={(e) =>
                        setNewIdea((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="document">
                      Supporting Document (Optional)
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="document"
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        onChange={handleFileUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                      />
                    </div>
                    {newIdea.document && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {newIdea.document.name}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Idea"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="ideas" className="space-y-6">
            {myIdeas.map((idea) => (
              <Card key={idea.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{idea.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {idea.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{idea.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Heart className="mr-1 h-4 w-4" />
                        {idea.likes} likes
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        {idea.interestedInvestors.length} interested
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedIdeaForDetails(idea);
                        setShowDetailsDialog(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="investors" className="space-y-6">
            {investments
              .filter((investment) => {
                // Show investments for current user's ideas
                return myIdeas.some((idea) => idea.id === investment.ideaId);
              })
              .map((investment) => {
                const idea = myIdeas.find((i) => i.id === investment.ideaId);
                return (
                  <Card key={investment.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {investment.investorName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {investment.investorName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Investment Firm
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Interested in:{" "}
                              <span className="font-medium">{idea?.title}</span>
                            </p>
                            <div className="flex items-center mt-1">
                              <Badge
                                variant={
                                  investment.status === "liked_back"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {investment.status === "liked_back"
                                  ? "Mutual Interest"
                                  : "Awaiting Response"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-green-600 font-medium mb-2">
                            <DollarSign className="mr-1 h-4 w-4" />
                            {investment.amount}
                          </div>
                          {investment.status === "liked_back" ? (
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90"
                              onClick={() =>
                                handleStartChat({
                                  name: investment.investorName,
                                  firm: "Investment Firm",
                                  investorId: investment.investorId,
                                })
                              }
                            >
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Chat
                            </Button>
                          ) : (
                            <div className="space-y-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-500 text-green-600 hover:bg-green-50"
                                onClick={() =>
                                  handleLikeBack(
                                    investment.investorId,
                                    investment.ideaId,
                                  )
                                }
                              >
                                <Heart className="mr-2 h-4 w-4" />
                                Like Back
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            {investments.filter((investment) =>
              myIdeas.some((idea) => idea.id === investment.ideaId),
            ).length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No interested investors yet
                    </h3>
                    <p className="text-muted-foreground">
                      When investors express interest in your ideas, they'll
                      appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="chats">
            {allChats.length > 0 ? (
              <div className="space-y-4">
                {allChats.map((chat) => {
                  const lastMessage = chat.messages[chat.messages.length - 1];
                  const otherPartyId =
                    chat.founderId === DataStore.getCurrentUserId()
                      ? chat.investorId
                      : chat.founderId;
                  const otherPartyName = lastMessage
                    ? lastMessage.senderId === DataStore.getCurrentUserId()
                      ? "You"
                      : lastMessage.senderName
                    : "No messages yet";

                  return (
                    <Card
                      key={chat.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setCurrentChatId(chat.id);
                        setChatHistory(chat.messages);
                        const investment = investments.find(
                          (inv) => inv.investorId === otherPartyId,
                        );
                        if (investment) {
                          setSelectedInvestor({
                            name: investment.investorName,
                            firm: "Investment Firm",
                            investorId: investment.investorId,
                          });
                          setShowChatDialog(true);
                        }
                      }}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {chat.founderId === DataStore.getCurrentUserId()
                                ? "Investor"
                                : "Founder"}{" "}
                              Conversation
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {lastMessage
                                ? lastMessage.message
                                : "No messages yet"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {lastMessage
                                ? new Date(
                                    lastMessage.timestamp,
                                  ).toLocaleDateString()
                                : new Date(chat.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {chat.messages.length} messages
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No conversations yet
                    </h3>
                    <p className="text-muted-foreground">
                      When you have mutual interest with investors, you can
                      start conversations with them.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedIdeaForDetails?.title}</DialogTitle>
            <DialogDescription>
              Detailed view of your startup idea
            </DialogDescription>
          </DialogHeader>
          {selectedIdeaForDetails && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Category</Label>
                <Badge variant="secondary" className="ml-2">
                  {selectedIdeaForDetails.category}
                </Badge>
              </div>
              <div>
                <Label className="text-base font-medium">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedIdeaForDetails.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(
                      selectedIdeaForDetails.createdAt,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-base font-medium">Status</Label>
                  <Badge variant="outline" className="ml-1">
                    {selectedIdeaForDetails.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Likes</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedIdeaForDetails.likes}
                  </p>
                </div>
                <div>
                  <Label className="text-base font-medium">
                    Interested Investors
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedIdeaForDetails.interestedInvestors?.length || 0}
                  </p>
                </div>
              </div>
              {selectedIdeaForDetails.document && (
                <div>
                  <Label className="text-base font-medium">
                    Supporting Document
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedIdeaForDetails.document.name ||
                      "Document attached"}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Chat with {selectedInvestor?.name}</DialogTitle>
            <DialogDescription>
              {selectedInvestor?.name} from {selectedInvestor?.firm}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Chat History */}
            {chatHistory.length > 0 && (
              <div className="max-h-60 overflow-y-auto space-y-2 p-4 bg-muted rounded-lg">
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === DataStore.getCurrentUserId() ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.senderId === DataStore.getCurrentUserId()
                          ? "bg-primary text-white"
                          : "bg-white"
                      }`}
                    >
                      <p className="font-medium">{msg.senderName}</p>
                      <p>{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Message Input */}
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                rows={3}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleSendMessage}
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={!chatMessage.trim()}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowChatDialog(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
