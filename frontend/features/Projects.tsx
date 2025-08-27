import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Users, 
  Calendar,
  Target,
  Award,
  Lightbulb,
  ArrowRight,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  Trash2,
  MoreHorizontal,
  X,
  Save,
  AlertTriangle,
  GitBranch,
  Activity,
  Zap,
  Building,
  BarChart3,
  Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { Header } from '../components/layout/Header';
import { useProjects } from '../hooks/useProjects';
import { toast } from 'sonner';

export default function Projects() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    objectives: '',
    owner: '',
    deadline: '',
    resources: '',
    kpi: '',
    priority: 'medium',
    budget: '',
    team_size: '',
    expected_impact: ''
  });

  // Utilisation du hook useProjects pour les données dynamiques
  const { 
    projects, 
    pagination, 
    isLoading, 
    error, 
    createProject, 
    updateProject, 
    deleteProject,
    isCreating,
    isUpdating,
    isDeleting
  } = useProjects({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined
  });

  // Calcul des statistiques
  const stats = useMemo(() => {
    const total = projects.length;
    const inProgress = projects.filter(p => p.status === "in-progress").length;
    const completed = projects.filter(p => p.status === "completed").length;
    const pending = projects.filter(p => p.status === "pending").length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const avgProgress = projects.length > 0 ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / total : 0;

    return { total, inProgress, completed, pending, totalBudget, avgProgress };
  }, [projects]);

  // Gestion des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        <Header />
        <main className="w-full py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Erreur de chargement</h2>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <Header />
      
      <main className="w-full py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Projets
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gérez et suivez tous vos projets d'équipe avec une vue d'ensemble complète
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projets</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Cours</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terminés</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher un projet..."
                className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Projet
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Projects Grid */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-green-600" />
                <p className="text-gray-600">Chargement des projets...</p>
              </div>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Target className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                            {project.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{project.category}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 line-clamp-3">
                      {project.description}
                    </p>
                    
                    {/* Progression */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progression</span>
                        <span className="font-medium">{project.progress || 0}%</span>
                      </div>
                      <Progress value={project.progress || 0} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Créé le {new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-green-600 hover:text-green-700"
                        onClick={() => {
                          setSelectedProject(project);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent>
                <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Aucun projet trouvé</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
                    ? "Aucun projet ne correspond à vos critères de recherche."
                    : "Commencez par créer votre premier projet"
                  }
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un projet
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} sur {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                disabled={currentPage === pagination.pages}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {selectedProject?.name}
              </DialogTitle>
              <DialogDescription>
                Détails du projet
              </DialogDescription>
            </DialogHeader>
            
            {selectedProject && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedProject.name}</h3>
                    <p className="text-sm text-gray-600">{selectedProject.category}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700">{selectedProject.description}</p>
                </div>

                {/* Progression */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Progression</span>
                    <span className="font-medium">{selectedProject.progress || 0}%</span>
                  </div>
                  <Progress value={selectedProject.progress || 0} className="h-3" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Créé le :</span>
                    <p className="text-gray-600">{new Date(selectedProject.created_at).toLocaleDateString()}</p>
                  </div>
                  {selectedProject.owner && (
                    <div>
                      <span className="font-medium">Chef de projet :</span>
                      <p className="text-gray-600">{selectedProject.owner}</p>
                    </div>
                  )}
                  {selectedProject.deadline && (
                    <div>
                      <span className="font-medium">Échéance :</span>
                      <p className="text-gray-600">{new Date(selectedProject.deadline).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedProject.budget && (
                    <div>
                      <span className="font-medium">Budget :</span>
                      <p className="text-gray-600">{selectedProject.budget.toLocaleString()} €</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
