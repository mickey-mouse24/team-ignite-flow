import { Header } from "@/components/layout/Header";
import { OrgChart } from "@/components/team/OrgChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const mockOrgData = {
  id: "1",
  name: "Jean-Pierre Lefèvre",
  role: "Directeur Général",
  email: "jp.lefevre@company.com",
  department: "Direction",
  status: "available" as const,
  currentProjects: ["Transformation digitale", "Expansion internationale"],
  subordinates: [
    {
      id: "2",
      name: "Marie Dupont",
      role: "Responsable RH",
      email: "m.dupont@company.com",
      department: "Ressources Humaines",
      status: "busy" as const,
      currentProjects: ["Recrutement Q4", "Formation leadership"],
      subordinates: [
        {
          id: "5",
          name: "Lucas Petit",
          role: "Chargé de recrutement",
          email: "l.petit@company.com",
          department: "Ressources Humaines",
          status: "available" as const,
          currentProjects: ["Recrutement développeurs"],
        },
        {
          id: "6",
          name: "Emma Richard",
          role: "Responsable formation",
          email: "e.richard@company.com",
          department: "Ressources Humaines",
          status: "available" as const,
          currentProjects: ["Programme onboarding"],
        }
      ]
    },
    {
      id: "3",
      name: "Thomas Martin",
      role: "CTO",
      email: "t.martin@company.com",
      department: "Technologie",
      status: "available" as const,
      currentProjects: ["Migration cloud", "Refonte architecture"],
      subordinates: [
        {
          id: "7",
          name: "Sophie Bernard",
          role: "Lead Developer",
          email: "s.bernard@company.com",
          department: "Technologie",
          status: "busy" as const,
          currentProjects: ["API v2", "Dashboard analytics"],
        },
        {
          id: "8",
          name: "Alexandre Moreau",
          role: "DevOps Engineer",
          email: "a.moreau@company.com",
          department: "Technologie",
          status: "available" as const,
          currentProjects: ["CI/CD Pipeline", "Infrastructure as Code"],
        }
      ]
    },
    {
      id: "4",
      name: "Claire Rousseau",
      role: "Directrice Marketing",
      email: "c.rousseau@company.com",
      department: "Marketing",
      status: "away" as const,
      currentProjects: ["Campagne Q4", "Refonte brand"],
      subordinates: [
        {
          id: "9",
          name: "Julie Lambert",
          role: "Social Media Manager",
          email: "j.lambert@company.com",
          department: "Marketing",
          status: "available" as const,
          currentProjects: ["Stratégie réseaux sociaux"],
        }
      ]
    }
  ]
};

export default function Team() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Organigramme de l'équipe</h1>
          <p className="text-muted-foreground">
            Visualisez la structure de l'organisation et les projets en cours de chaque membre
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Structure organisationnelle</CardTitle>
                <CardDescription>Cliquez sur les chevrons pour explorer la hiérarchie</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un membre..."
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <OrgChart data={mockOrgData} />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Légende des statuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-sm">Occupé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted" />
                <span className="text-sm">Absent</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistiques d'équipe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total membres</span>
                <span className="text-sm font-medium">9</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Projets actifs</span>
                <span className="text-sm font-medium">15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Taux disponibilité</span>
                <span className="text-sm font-medium">67%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Départements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Direction</span>
                <span className="text-sm font-medium">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Technologie</span>
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">RH</span>
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Marketing</span>
                <span className="text-sm font-medium">2</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}