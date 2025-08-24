import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Users, Briefcase, Mail } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  department: string;
  status: "available" | "busy" | "away";
  currentProjects: string[];
  subordinates?: TeamMember[];
}

interface OrgNodeProps {
  member: TeamMember;
  level?: number;
}

const statusColors = {
  available: "bg-success",
  busy: "bg-warning",
  away: "bg-muted"
};

function OrgNode({ member, level = 0 }: OrgNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasSubordinates = member.subordinates && member.subordinates.length > 0;

  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        <Card className={cn(
          "w-72 transition-all duration-base hover:shadow-lg",
          level === 0 && "border-primary/50 shadow-md"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                    statusColors[member.status]
                  )} />
                </div>
                <div>
                  <CardTitle className="text-base">{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
              {hasSubordinates && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{member.department}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{member.email}</span>
            </div>
            {member.currentProjects.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Projets actuels:</p>
                <div className="flex flex-wrap gap-1">
                  {member.currentProjects.slice(0, 3).map((project, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {project}
                    </Badge>
                  ))}
                  {member.currentProjects.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.currentProjects.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
            {hasSubordinates && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                <Users className="h-3 w-3" />
                <span>{member.subordinates!.length} membres d'équipe</span>
              </div>
            )}
          </CardContent>
        </Card>

        {hasSubordinates && isExpanded && (
          <>
            <div className="w-0.5 h-8 bg-border" />
            <div className="flex gap-8">
              {member.subordinates!.map((subordinate, index) => (
                <div key={subordinate.id} className="relative">
                  {member.subordinates!.length > 1 && (
                    <>
                      {index === 0 && (
                        <div className="absolute top-0 left-1/2 w-full h-0.5 bg-border -translate-x-1/2" />
                      )}
                      {index === member.subordinates!.length - 1 && (
                        <div className="absolute top-0 right-1/2 w-full h-0.5 bg-border translate-x-1/2" />
                      )}
                      {index > 0 && index < member.subordinates!.length - 1 && (
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-border" />
                      )}
                    </>
                  )}
                  <div className="w-0.5 h-8 bg-border mx-auto" />
                  <OrgNode member={subordinate} level={level + 1} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function OrgChart({ data }: { data: TeamMember }) {
  return (
    <div className="w-full overflow-x-auto p-8">
      <div className="inline-block min-w-max">
        <OrgNode member={data} />
      </div>
    </div>
  );
}