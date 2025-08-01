import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { DataStore } from "@/lib/dataStore";
import {
  Zap,
  Search,
  Filter,
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
  Download,
  Building,
} from "lucide-react";

export default function InvestorDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [likedIdeas, setLikedIdeas] = useState<string[]>([]);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [expressingInterest, setExpressingInterest] = useState(false);
  const [allIdeas, setAllIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [selectedFounder, setSelectedFounder] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [userInvestments, setUserInvestments] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [allChats, setAllChats] = useState<any[]>([]);
  const [currentChatMessages, setCurrentChatMessages] = useState<any[]>([]);

  // Load all ideas and user's likes on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Get all ideas from shared data store
      const ideas = DataStore.getAllIdeas();
      setAllIdeas(ideas);

      // Get user's liked ideas and investments
      const userId = DataStore.getCurrentUserId();
      const userLikes = DataStore.getLikedIdeas(userId);
      setLikedIdeas(userLikes);

      // Get user's investments
      const investments = DataStore.getInvestments().filter(
        (inv) => inv.investorId === userId,
      );
      setUserInvestments(investments);

      // Load chats
      loadChats();
    } catch (error) {
      console.error("Error loading data:", error);
      // Fallback to empty arrays if error
      setAllIdeas([]);
      setLikedIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "all",
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

  const myLikedIdeas = allIdeas.filter((idea) =>
    likedIdeas.includes(idea.id.toString()),
  );

  const filteredIdeas = allIdeas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.founder.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || idea.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLikeIdea = (ideaId: string) => {
    const userId = DataStore.getCurrentUserId();
    const newLikeStatus = DataStore.toggleLike(userId, ideaId);

    // Update local state
    setLikedIdeas((prev) =>
      newLikeStatus ? [...prev, ideaId] : prev.filter((id) => id !== ideaId),
    );

    // Refresh ideas to get updated like counts
    const updatedIdeas = DataStore.getAllIdeas();
    setAllIdeas(updatedIdeas);
  };

  const handleExpressInterest = async (idea: any) => {
    if (!investmentAmount.trim()) {
      alert("Please enter an investment amount");
      return;
    }

    setExpressingInterest(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store investment interest
      DataStore.addInvestment({
        ideaId: idea.id,
        investorId: DataStore.getCurrentUserId(),
        investorName: DataStore.getCurrentUserName(),
        amount: investmentAmount,
        status: "interested",
      });

      // Refresh user investments
      const userId = DataStore.getCurrentUserId();
      const investments = DataStore.getInvestments().filter(
        (inv) => inv.investorId === userId,
      );
      setUserInvestments(investments);

      console.log(
        "Expressing interest in:",
        idea.title,
        "Amount:",
        investmentAmount,
      );
      alert(`Interest expressed in "${idea.title}" for ${investmentAmount}!`);

      setSelectedIdea(null);
      setInvestmentAmount("");
    } catch (error) {
      console.error("Error expressing interest:", error);
      alert("Failed to express interest. Please try again.");
    } finally {
      setExpressingInterest(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !currentChatId) return;

    try {
      const userId = DataStore.getCurrentUserId();
      const userName = DataStore.getCurrentUserName();

      // Add message to shared chat storage
      DataStore.addMessageToChat(currentChatId, userId, userName, chatMessage);

      // Reload current chat messages specifically
      const updatedChat = DataStore.getChatById(currentChatId);
      setCurrentChatMessages(updatedChat?.messages || []);

      // Also reload all chats for the Messages tab
      loadChats();

      // Clear input
      setChatMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
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

  const handleStartChat = (founder: any, ideaId: string) => {
    const userId = DataStore.getCurrentUserId();

    // Get the idea to find the founder ID
    const idea = allIdeas.find((i) => i.id === ideaId);
    if (!idea) {
      alert("Unable to find idea");
      return;
    }

    // Get or create chat for this investor-founder-idea combination
    const chat = DataStore.getOrCreateChat(idea.founderId, userId, ideaId);
    setCurrentChatId(chat.id);

    // Load current chat messages specifically for this dialog
    const currentChat = DataStore.getChatById(chat.id);
    setCurrentChatMessages(currentChat?.messages || []);

    setSelectedFounder(founder);
    setShowChatDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Loading investor dashboard...
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                localStorage.removeItem("auth_token");
                navigate("/login");
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {DataStore.getCurrentUserName()}!</h1>
          <p className="text-muted-foreground">
            Discover innovative startups and investment opportunities.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Ideas Available
                  </p>
                  <p className="text-2xl font-bold">{allIdeas.length}</p>
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
                    Liked Ideas
                  </p>
                  <p className="text-2xl font-bold">{likedIdeas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-secondary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Investments Made
                  </p>
                  <p className="text-2xl font-bold">3</p>
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
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Ideas</TabsTrigger>
            <TabsTrigger value="liked">
              Liked Ideas ({likedIdeas.length})
            </TabsTrigger>
            <TabsTrigger value="investments">My Investments</TabsTrigger>
            <TabsTrigger value="chats">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search ideas, founders, or companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Ideas List */}
            <div className="grid gap-6">
              {filteredIdeas.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No ideas found
                      </h3>
                      <p className="text-muted-foreground">
                        {searchTerm || selectedCategory !== "all"
                          ? "Try adjusting your search or filter criteria."
                          : "No startup ideas have been submitted yet. Check back later!"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredIdeas.map((idea) => (
                  <Card
                    key={idea.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">
                              {idea.title}
                            </CardTitle>
                            <Badge variant="secondary">{idea.category}</Badge>
                          </div>
                          <CardDescription className="text-base mb-3">
                            {idea.description}
                          </CardDescription>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Building className="mr-1 h-4 w-4" />
                              {idea.founder.company || "Startup"}
                            </div>
                            <div className="flex items-center">
                              <Users className="mr-1 h-4 w-4" />
                              {idea.founder.name}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4" />
                              {new Date(idea.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Heart className="mr-1 h-4 w-4" />
                              {idea.likes} likes
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={
                              likedIdeas.includes(idea.id.toString())
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handleLikeIdea(idea.id.toString())}
                            className={
                              likedIdeas.includes(idea.id.toString())
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : ""
                            }
                          >
                            <Heart
                              className={`mr-2 h-4 w-4 ${likedIdeas.includes(idea.id.toString()) ? "fill-current" : ""}`}
                            />
                            {likedIdeas.includes(idea.id.toString())
                              ? "Liked"
                              : "Like"}
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            View Document
                          </Button>
                        </div>
                        {(() => {
                          const existingInvestment = userInvestments.find(
                            (inv) => inv.ideaId === idea.id.toString(),
                          );
                          if (existingInvestment) {
                            return (
                              <div className="text-right">
                                <div className="flex items-center text-green-600 font-medium mb-1">
                                  <DollarSign className="mr-1 h-4 w-4" />
                                  {existingInvestment.amount}
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {existingInvestment.status === "liked_back"
                                    ? "Mutual Interest"
                                    : "Interest Expressed"}
                                </Badge>
                                {existingInvestment.status === "liked_back" && (
                                  <Button
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90 mt-2"
                                    onClick={() =>
                                      handleStartChat(idea.founder, idea.id)
                                    }
                                  >
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Chat
                                  </Button>
                                )}
                              </div>
                            );
                          } else {
                            return (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90"
                                    onClick={() => setSelectedIdea(idea)}
                                  >
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Express Interest
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Express Investment Interest
                                    </DialogTitle>
                                    <DialogDescription>
                                      Show your interest in "{idea.title}" and
                                      specify your potential investment amount.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="amount">
                                        Investment Amount
                                      </Label>
                                      <Input
                                        id="amount"
                                        placeholder="e.g., $250,000"
                                        value={investmentAmount}
                                        onChange={(e) =>
                                          setInvestmentAmount(e.target.value)
                                        }
                                      />
                                    </div>
                                    <Button
                                      onClick={() =>
                                        handleExpressInterest(idea)
                                      }
                                      className="w-full bg-primary hover:bg-primary/90"
                                      disabled={expressingInterest}
                                    >
                                      {expressingInterest
                                        ? "Expressing Interest..."
                                        : "Express Interest"}
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            );
                          }
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="liked" className="space-y-6">
            {myLikedIdeas.length > 0 ? (
              <div className="grid gap-6">
                {myLikedIdeas.map((idea) => (
                  <Card key={idea.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            {idea.title}
                          </CardTitle>
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
                            <Building className="mr-1 h-4 w-4" />
                            {idea.founder.company || "Startup"}
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            {idea.founder.name}
                          </div>
                          <div className="flex items-center">
                            <Heart className="mr-1 h-4 w-4" />
                            {idea.likes} likes
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleStartChat(idea.founder, idea.id)}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Start Conversation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No liked ideas yet
                    </h3>
                    <p className="text-muted-foreground">
                      Browse ideas and like the ones that interest you to see
                      them here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="investments">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No investments yet
                  </h3>
                  <p className="text-muted-foreground">
                    Your investment portfolio will appear here once you start
                    investing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chats">
            {chatHistory.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Conversations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {chatHistory.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === DataStore.getCurrentUserName() ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender === DataStore.getCurrentUserName()
                              ? "bg-primary text-white"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm font-medium">{msg.sender}</p>
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No active conversations
                    </h3>
                    <p className="text-muted-foreground">
                      Start conversations by expressing interest in ideas and
                      messaging founders.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Dialog */}
      <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Chat with {selectedFounder?.name}</DialogTitle>
            <DialogDescription>
              {selectedFounder?.name} from {selectedFounder?.company}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Chat History */}
            {currentChatMessages.length > 0 && (
              <div className="max-h-60 overflow-y-auto space-y-2 p-4 bg-muted rounded-lg">
                {currentChatMessages.map((msg) => (
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
                      <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
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
