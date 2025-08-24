import { Header } from "@/components/layout/Header";
import { InitiativeCard } from "@/components/initiatives/InitiativeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const allInitiatives = [
  {
    title: "Amélioration du processus de recrutement",
    description: "Optimiser notre pipeline de recrutement en intégrant des outils d'IA pour le tri des CV et l'évaluation initiale des candidats.",
    author: { name: "Marie Dupont", role: "Responsable RH" },
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
    author: { name: "Thomas Martin", role: "Lead Developer" },
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
    author: { name: "Sophie Bernard", role: "Data Analyst" },
    status: "in-progress" as const,
    likes: 42,
    comments: 15,
    participants: 6,
    progress: 35,
    category: "Technologie",
    createdAt: "Il y a 3 jours"
  },
  {
    title: "Programme bien-être au travail",
    description: "Mettre en place des activités et espaces dédiés au bien-être des employés pour améliorer la qualité de vie au travail.",
    author: { name: "Lucas Petit", role: "Chargé RH" },
    status: "completed" as const,
    likes: 56,
    comments: 23,
    participants: 12,
    progress: 100,
    category: "Ressources Humaines",
    createdAt: "Il y a 2 semaines"
  },
  {
    title: "Migration vers le cloud",
    description: "Migrer l'infrastructure existante vers une solution cloud pour améliorer la scalabilité et réduire les coûts.",
    author: { name: "Alexandre Moreau", role: "DevOps Engineer" },
    status: "in-progress" as const,
    likes: 38,
    comments: 19,
    participants: 4,
    progress: 45,
    category: "Technologie",
    createdAt: "Il y a 5 jours"
  },
  {
    title: "Refonte de l'onboarding",
    description: "Créer un parcours d'intégration digitalisé et personnalisé pour les nouveaux employés.",
    author: { name: "Emma Richard", role: "Responsable formation" },
    status: "on-hold" as const,
    likes: 22,
    comments: 10,
    participants: 3,
    progress: 20,
    category: "Formation",
    createdAt: "Il y a 1 mois"
  }
];

export default function Initiatives() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredInitiatives = allInitiatives.filter(initiative => {
    const matchesSearch = initiative.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          initiative.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || initiative.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || initiative.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Initiatives</h1>
            <p className="text-muted-foreground mt-1">
              Explorez et contribuez aux initiatives de votre entreprise
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="gradient" size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle initiative
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Proposer une nouvelle initiative</DialogTitle>
                <DialogDescription>
                  Partagez votre idée pour améliorer notre entreprise
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'initiative</Label>
                  <Input id="title" placeholder="Ex: Amélioration du processus de..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rh">Ressources Humaines</SelectItem>
                      <SelectItem value="tech">Technologie</SelectItem>
                      <SelectItem value="formation">Formation</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Opérations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Décrivez votre initiative en détail..."
                    className="min-h-[150px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="objectives">Objectifs</Label>
                  <Textarea 
                    id="objectives" 
                    placeholder="Quels sont les objectifs de cette initiative?"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Annuler</Button>
                  <Button variant="gradient">Soumettre l'initiative</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une initiative..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="Ressources Humaines">Ressources Humaines</SelectItem>
              <SelectItem value="Technologie">Technologie</SelectItem>
              <SelectItem value="Formation">Formation</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="on-hold">En pause</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span className="text-2xl font-bold">{filteredInitiatives.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Initiatives totales</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-warning" />
              </div>
              <span className="text-2xl font-bold">
                {filteredInitiatives.filter(i => i.status === "pending").length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">En attente</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span className="text-2xl font-bold">
                {filteredInitiatives.filter(i => i.status === "in-progress").length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">En cours</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <span className="text-2xl font-bold">
                {filteredInitiatives.filter(i => i.status === "completed").length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Terminées</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="trending">Tendances</TabsTrigger>
            <TabsTrigger value="recent">Récentes</TabsTrigger>
            <TabsTrigger value="my-initiatives">Mes initiatives</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredInitiatives.map((initiative, index) => (
                <InitiativeCard key={index} {...initiative} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredInitiatives
                .sort((a, b) => b.likes - a.likes)
                .slice(0, 6)
                .map((initiative, index) => (
                  <InitiativeCard key={index} {...initiative} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredInitiatives.slice(0, 3).map((initiative, index) => (
                <InitiativeCard key={index} {...initiative} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="my-initiatives" className="space-y-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas encore proposé d'initiatives
              </p>
              <Button variant="gradient">Proposer ma première initiative</Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}