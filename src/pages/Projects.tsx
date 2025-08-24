import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  MoreVertical, 
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const projects = [
  {
    id: 1,
    title: "Migration Cloud AWS",
    description: "Migration complète de l'infrastructure vers AWS avec mise en place de CI/CD",
    status: "in-progress",
    priority: "high",
    progress: 65,
    startDate: "15 Oct 2024",
    endDate: "15 Jan 2025",
    team: [
      { name: "Alexandre Moreau", role: "DevOps Lead" },
      { name: "Sophie Bernard", role: "Backend Dev" },
      { name: "Thomas Martin", role: "CTO" }
    ],
    tasks: {
      total: 24,
      completed: 16
    },
    budget: {
      allocated: 150000,
      spent: 97500
    }
  },
  {
    id: 2,
    title: "Refonte Application Mobile",
    description: "Nouvelle version de l'application mobile avec React Native",
    status: "planning",
    priority: "medium",
    progress: 15,
    startDate: "1 Dec 2024",
    endDate: "30 Mar 2025",
    team: [
      { name: "Julie Lambert", role: "UI/UX Designer" },
      { name: "Lucas Petit", role: "Mobile Dev" }
    ],
    tasks: {
      total: 32,
      completed: 5
    },
    budget: {
      allocated: 80000,
      spent: 12000
    }
  },
  {
    id: 3,
    title: "Système de Mentorat",
    description: "Plateforme de mentorat interne pour le développement des compétences",
    status: "in-progress",
    priority: "low",
    progress: 40,
    startDate: "1 Nov 2024",
    endDate: "28 Feb 2025",
    team: [
      { name: "Emma Richard", role: "Project Manager" },
      { name: "Marie Dupont", role: "HR Lead" }
    ],
    tasks: {
      total: 18,
      completed: 7
    },
    budget: {
      allocated: 45000,
      spent: 18000
    }
  },
  {
    id: 4,
    title: "Dashboard Analytics v2",
    description: "Nouvelle version du dashboard avec visualisations temps réel",
    status: "review",
    priority: "high",
    progress: 85,
    startDate: "1 Sep 2024",
    endDate: "30 Nov 2024",
    team: [
      { name: "Sophie Bernard", role: "Data Analyst" },
      { name: "Thomas Martin", role: "Tech Lead" }
    ],
    tasks: {
      total: 28,
      completed: 24
    },
    budget: {
      allocated: 120000,
      spent: 102000
    }
  }
];

const statusConfig = {
  "planning": { label: "Planification", color: "bg-muted text-muted-foreground" },
  "in-progress": { label: "En cours", color: "bg-primary/10 text-primary" },
  "review": { label: "En révision", color: "bg-warning/10 text-warning" },
  "completed": { label: "Terminé", color: "bg-success/10 text-success" },
  "on-hold": { label: "En pause", color: "bg-destructive/10 text-destructive" }
};

const priorityConfig = {
  "low": { label: "Basse", icon: "→", color: "text-muted-foreground" },
  "medium": { label: "Moyenne", icon: "↑", color: "text-warning" },
  "high": { label: "Haute", icon: "⇈", color: "text-destructive" }
};

export default function Projects() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projets</h1>
            <p className="text-muted-foreground mt-1">
              Gérez et suivez l'avancement de tous les projets en cours
            </p>
          </div>
          <Button variant="gradient">Nouveau projet</Button>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Projets actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{projects.length}</span>
                <Badge variant="outline" className="text-xs">
                  +2 ce mois
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tâches totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {projects.reduce((acc, p) => acc + p.tasks.completed, 0)}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {projects.reduce((acc, p) => acc + p.tasks.total, 0)}
                </span>
              </div>
              <Progress 
                value={(projects.reduce((acc, p) => acc + p.tasks.completed, 0) / projects.reduce((acc, p) => acc + p.tasks.total, 0)) * 100} 
                className="mt-2 h-1"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Budget utilisé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {Math.round(projects.reduce((acc, p) => acc + p.budget.spent, 0) / 1000)}k€
                </span>
                <span className="text-sm text-muted-foreground">
                  / {Math.round(projects.reduce((acc, p) => acc + p.budget.allocated, 0) / 1000)}k€
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Membres impliqués
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {projects.reduce((acc, p) => acc + p.team.length, 0)}
                </span>
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <Avatar key={i} className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs">
                        {String.fromCharCode(65 + i)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                    +{projects.reduce((acc, p) => acc + p.team.length, 0) - 4}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <Tabs defaultValue="kanban" className="space-y-4">
          <TabsList>
            <TabsTrigger value="kanban">Vue Kanban</TabsTrigger>
            <TabsTrigger value="list">Vue Liste</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="kanban" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map(project => (
                <Card key={project.id} className="hover:shadow-lg transition-all duration-slow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={statusConfig[project.status as keyof typeof statusConfig].color}>
                            {statusConfig[project.status as keyof typeof statusConfig].label}
                          </Badge>
                          <span className={`text-xs font-medium ${priorityConfig[project.priority as keyof typeof priorityConfig].color}`}>
                            {priorityConfig[project.priority as keyof typeof priorityConfig].icon} {priorityConfig[project.priority as keyof typeof priorityConfig].label}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Voir détails</DropdownMenuItem>
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuItem>Archiver</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="line-clamp-2 mt-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{project.endDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {project.tasks.completed}/{project.tasks.total} tâches
                        </span>
                      </div>
                    </div>

                    {/* Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map((member, idx) => (
                          <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.team.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                            +{project.team.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Budget bar */}
                    <div className="pt-3 border-t">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Budget</span>
                        <span>{Math.round(project.budget.spent / 1000)}k€ / {Math.round(project.budget.allocated / 1000)}k€</span>
                      </div>
                      <Progress 
                        value={(project.budget.spent / project.budget.allocated) * 100} 
                        className="h-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Projet</th>
                        <th className="p-4 font-medium">Statut</th>
                        <th className="p-4 font-medium">Priorité</th>
                        <th className="p-4 font-medium">Équipe</th>
                        <th className="p-4 font-medium">Progression</th>
                        <th className="p-4 font-medium">Échéance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(project => (
                        <tr key={project.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{project.title}</p>
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className={statusConfig[project.status as keyof typeof statusConfig].color}>
                              {statusConfig[project.status as keyof typeof statusConfig].label}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className={`text-sm font-medium ${priorityConfig[project.priority as keyof typeof priorityConfig].color}`}>
                              {priorityConfig[project.priority as keyof typeof priorityConfig].label}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex -space-x-2">
                              {project.team.slice(0, 3).map((member, idx) => (
                                <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                                  <AvatarFallback className="text-[10px]">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Progress value={project.progress} className="w-20 h-2" />
                              <span className="text-sm">{project.progress}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{project.endDate}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vue Timeline</CardTitle>
                <CardDescription>Visualisez les projets sur une ligne de temps</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Vue timeline en cours de développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}