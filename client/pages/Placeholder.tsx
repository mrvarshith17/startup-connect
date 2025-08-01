import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, ArrowLeft, Code } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderProps {
  title: string;
  description: string;
  feature?: string;
}

export default function Placeholder({ 
  title = "Coming Soon", 
  description = "This feature is under development.", 
  feature = "this feature" 
}: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-4 left-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            VentureLink
          </span>
        </Link>
      </div>

      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-gradient-to-r from-primary to-secondary p-4 rounded-full w-fit text-white mb-4">
            <Code className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We're working hard to bring you {feature}. In the meantime, explore other parts of the platform or continue prompting to help us build this feature!
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" className="w-full">
              Request Feature Development
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
