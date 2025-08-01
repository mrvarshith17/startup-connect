import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Lightbulb,
  TrendingUp,
  MessageCircle,
  Users,
  Star,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DatabaseStatus } from "@/components/DatabaseStatus";

export default function Index() {
  const features = [
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Submit Your Ideas",
      description:
        "Share your innovative startup concepts with a curated network of investors",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Smart Matching",
      description:
        "Our algorithm connects founders with investors based on industry preferences",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Direct Communication",
      description:
        "Real-time chat unlocks when both parties show mutual interest",
    },
  ];

  const stats = [
    { number: "500+", label: "Active Founders" },
    { number: "200+", label: "Verified Investors" },
    { number: "$50M+", label: "Total Funding" },
    { number: "85%", label: "Match Success Rate" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
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
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-primary to-secondary text-white">
            The Future of Startup Funding
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Connect Ideas with
            <br />
            Capital
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            VentureLink is the premier platform where innovative founders meet
            visionary investors. Share your ideas, discover opportunities, and
            build the future together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register?role=founder">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Users className="mr-2 h-5 w-5" />
                Join as Founder
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/register?role=investor">
              <Button
                size="lg"
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary hover:text-white"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Join as Investor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How VentureLink Works</h2>
            <p className="text-lg text-muted-foreground">
              A simple, efficient process to connect startup founders with
              investors
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="mx-auto bg-gradient-to-r from-primary to-secondary p-3 rounded-full w-fit text-white mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-lg text-muted-foreground">
              Join a thriving community of entrepreneurs and investors
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Debug Panel - Remove in production */}
      <section className="py-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Debug Panel (Testing Only)
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>LocalStorage Debug</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Current User:</strong>{" "}
                      {localStorage.getItem("user_email") || "None"}
                    </p>
                    <p>
                      <strong>Current Role:</strong>{" "}
                      {localStorage.getItem("user_role") || "None"}
                    </p>
                    <p>
                      <strong>Current Name:</strong>{" "}
                      {localStorage.getItem("user_name") || "None"}
                    </p>
                    <p>
                      <strong>Auth Token:</strong>{" "}
                      {localStorage.getItem("auth_token") ? "Present" : "None"}
                    </p>
                    <div>
                      <strong>Database:</strong> <DatabaseStatus />
                    </div>
                  </div>
                  <div className="mt-4 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log(
                          "All localStorage keys:",
                          Object.keys(localStorage),
                        );
                        console.log(
                          "All localStorage data:",
                          Object.keys(localStorage).reduce((acc, key) => {
                            acc[key] = localStorage.getItem(key);
                            return acc;
                          }, {} as any),
                        );
                      }}
                    >
                      Log Storage to Console
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                    >
                      Clear All & Refresh
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Registered Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    {Object.keys(localStorage)
                      .filter((key) => key.startsWith("user_role_"))
                      .map((key) => {
                        const email = key.replace("user_role_", "");
                        const role = localStorage.getItem(key);
                        const name = localStorage.getItem(`user_name_${email}`);
                        return (
                          <div key={email} className="p-2 bg-gray-50 rounded">
                            <p>
                              <strong>{name}</strong> ({email})
                            </p>
                            <p className="text-gray-600">Role: {role}</p>
                          </div>
                        );
                      })}
                    {Object.keys(localStorage).filter((key) =>
                      key.startsWith("user_role_"),
                    ).length === 0 && (
                      <p className="text-gray-500">No users registered yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're a founder with the next big idea or an investor
            looking for opportunities, VentureLink is your gateway to success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                VentureLink
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 VentureLink. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
