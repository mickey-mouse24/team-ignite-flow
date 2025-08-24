import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Clock, Users, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface InitiativeCardProps {
  title: string;
  description: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  status: "pending" | "in-progress" | "completed" | "on-hold";
  likes: number;
  comments: number;
  participants: number;
  progress?: number;
  category: string;
  createdAt: string;
}

const statusConfig = {
  "pending": { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  "in-progress": { label: "En cours", className: "bg-primary/10 text-primary border-primary/20" },
  "completed": { label: "Terminé", className: "bg-success/10 text-success border-success/20" },
  "on-hold": { label: "En pause", className: "bg-muted text-muted-foreground border-muted" }
};

export function InitiativeCard({
  title,
  description,
  author,
  status,
  likes,
  comments,
  participants,
  progress = 0,
  category,
  createdAt
}: InitiativeCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <Card className="group hover:shadow-xl transition-all duration-slow border-border/50 bg-gradient-card">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          <Badge variant="outline" className={statusInfo.className}>
            {statusInfo.label}
          </Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{participants}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{author.name}</span>
            <span className="text-xs text-muted-foreground">{author.role}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{createdAt}</span>
        </div>
      </CardFooter>
    </Card>
  );
}