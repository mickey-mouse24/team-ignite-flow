import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { InitiativeCard } from "@/components/initiatives/InitiativeCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Clock, 
  ArrowRight,
  Lightbulb,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const mockInitiatives = [
  {
    title: "Amélioration du processus de recrutement",
    description: "Optimiser notre pipeline de recrutement en intégrant des outils d'IA pour le tri des CV et l'évaluation initiale des candidats.",
    author: {
      name: "Marie Dupont",
      role: "Responsable RH",
      avatar: undefined
    },
    status: "in-progress" as const,
    likes: 24,
    comments: 8,
    participants: 5,
    progress: 65,
    category: "Ressources Humaines",
    createdAt: "Il y a 2 jours"
  },
  {
    title: "Mise en place d'un système de mentorat",
    description: "Créer un programme de mentorat pour favoriser le développement professionnel et le partage de connaissances entre les équipes.",
    author: {
      name: "Thomas Martin",
      role: "Lead Developer",
      avatar: undefined
    },
    status: "pending" as const,
    likes: 18,
    comments: 12,
    participants: 8,
    progress: 0,
    category: "Formation",
    createdAt: "Il y a 1 semaine"
  },
  {
    title: "Dashboard analytique temps réel",
    description: "Développer un tableau de bord centralisé pour visualiser les KPIs de tous les départements en temps réel.",
    author: {
      name: "Sophie Bernard",
      role: "Data Analyst",
      avatar: undefined
    },
    status: "in-progress" as const,
    likes: 42,
    comments: 15,
    participants: 6,
    progress: 35,
    category: "Technologie",
    createdAt: "Il y a 3 jours"
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-primary p-8 text-primary-foreground">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl font-bold mb-2">Bienvenue sur CollabFlow</h1>
            <p className="text-primary-foreground/90 mb-4">
              Suivez les initiatives, collaborez avec votre équipe et transformez vos idées en projets concrets.
            </p>
            <Button variant="secondary" size="lg" className="gap-2">
              Proposer une initiative
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-accent opacity-20 blur-3xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Initiatives actives"
            value="24"
            description="8 nouvelles cette semaine"
            icon={Lightbulb}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Projets en cours"
            value="18"
            description="6 à livrer ce mois"
            icon={Briefcase}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Participants actifs"
            value="142"
            description="Sur 180 employés"
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Taux de complétion"
            value="78%"
            description="Moyenne mensuelle"
            icon={CheckCircle}
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="recent">Récentes</TabsTrigger>
            <TabsTrigger value="trending">Tendances</TabsTrigger>
            <TabsTrigger value="my-projects">Mes projets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Initiatives récentes</h2>
                <p className="text-muted-foreground">Découvrez les dernières propositions de vos collègues</p>
              </div>
              <Button variant="outline">Voir tout</Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockInitiatives.map((initiative, index) => (
                <InitiativeCard key={index} {...initiative} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Projets populaires</h2>
                <p className="text-muted-foreground">Les initiatives qui génèrent le plus d'engagement</p>
              </div>
              <Button variant="outline">Voir tout</Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockInitiatives.slice().reverse().map((initiative, index) => (
                <InitiativeCard key={index} {...initiative} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="my-projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes projets</CardTitle>
                <CardDescription>Vous n'avez pas encore de projets assignés</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-4">
                  Commencez par explorer les initiatives existantes ou créez la vôtre
                </p>
                <div className="flex gap-2">
                  <Button variant="outline">Explorer</Button>
                  <Button variant="gradient">Créer une initiative</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Suivez l'évolution des projets en temps réel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  user: "Marie Dupont", 
                  action: "a commenté sur", 
                  target: "Dashboard analytique", 
                  time: "Il y a 5 minutes" 
                },
                { 
                  user: "Thomas Martin", 
                  action: "a approuvé", 
                  target: "Système de mentorat", 
                  time: "Il y a 1 heure" 
                },
                { 
                  user: "Sophie Bernard", 
                  action: "a mis à jour le statut de", 
                  target: "Migration cloud", 
                  time: "Il y a 2 heures" 
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 last:pb-0 border-b last:border-0">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>
                      {" "}{activity.action}{" "}
                      <span className="font-medium text-primary">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}