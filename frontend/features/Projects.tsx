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
  Loader2,
  Upload,
  File,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  FileX
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
import { Project } from '../types';

export default function Projects() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
    budget: '',
    deadline: ''
  });

  // Validation en temps réel
  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Le nom du projet est obligatoire';
        else if (value.length < 3) error = 'Le nom doit contenir au moins 3 caractères';
        else if (value.length > 100) error = 'Le nom ne peut pas dépasser 100 caractères';
        break;
      case 'description':
        if (!value.trim()) error = 'La description est obligatoire';
        else if (value.length < 20) error = 'La description doit être plus détaillée (min. 20 caractères)';
        else if (value.length > 1000) error = 'La description ne peut pas dépasser 1000 caractères';
        break;
      case 'budget':
        if (value && (isNaN(Number(value)) || Number(value) < 0)) error = 'Le budget doit être un nombre positif';
        else if (value && Number(value) > 10000000) error = 'Le budget semble trop élevé';
        break;
      case 'deadline':
        if (value && new Date(value) <= new Date()) error = 'La date d\'échéance doit être dans le futur';
        break;
    }
    
    setFormErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const isFormValid = () => {
    return formData.name.trim() && 
           formData.description.trim() && 
           !formErrors.name && 
           !formErrors.description && 
           !formErrors.budget && 
           !formErrors.deadline;
  };

  // Fonctions de gestion des fichiers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain', 'text/csv', 'application/zip', 'application/x-rar-compressed'
      ];
      
      if (file.size > maxSize) {
        toast.error(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
        return false;
      }
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Le type de fichier ${file.name} n'est pas supporté`);
        return false;
      }
      
      return true;
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type === 'application/pdf') return <FileText className="h-4 w-4" />;
    if (file.type.includes('word') || file.type.includes('document')) return <FileText className="h-4 w-4" />;
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) return <FileText className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (file.type.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (file.type.includes('zip') || file.type.includes('rar')) return <Archive className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Fonctions de drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain', 'text/csv', 'application/zip', 'application/x-rar-compressed'
      ];
      
      if (file.size > maxSize) {
        toast.error(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
        return false;
      }
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Le type de fichier ${file.name} n'est pas supporté`);
        return false;
      }
      
      return true;
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

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
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    priority: selectedCategory !== "all" ? selectedCategory : undefined
  });

  // Calcul des statistiques
  const stats = useMemo(() => {
    const total = projects.length;
    const inProgress = projects.filter(p => p.status === "in-progress").length;
    const completed = projects.filter(p => p.status === "completed").length;
    const planning = projects.filter(p => p.status === "planning").length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const avgProgress = projects.length > 0 ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / total : 0;

    return { total, inProgress, completed, planning, totalBudget, avgProgress };
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
                  <p className="text-3xl font-bold text-gray-900">{stats.planning}</p>
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
            <div className="flex items-center gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="planning">Planification</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="on-hold">En pause</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                          <p className="text-sm text-gray-600">{project.status}</p>
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
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          project.status === 'completed' ? 'default' :
                          project.status === 'in-progress' ? 'secondary' :
                          project.status === 'planning' ? 'outline' : 'destructive'
                        }>
                          {project.status === 'completed' ? 'Terminé' :
                           project.status === 'in-progress' ? 'En cours' :
                           project.status === 'planning' ? 'Planification' :
                           project.status === 'on-hold' ? 'En pause' : 'Annulé'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1">
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
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProject(project);
                                setIsViewDialogOpen(false);
                                setIsEditDialogOpen(true);
                                setFormData({
                                  name: project.name,
                                  description: project.description,
                                  category: '',
                                  objectives: '',
                                  owner: project.manager_name || '',
                                  deadline: project.end_date ? project.end_date.split('T')[0] : '',
                                  resources: '',
                                  kpi: '',
                                  priority: project.priority || 'medium',
                                  budget: project.budget?.toString() || '',
                                  team_size: '',
                                  expected_impact: ''
                                });
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
                                  deleteProject(project.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-3xl font-bold flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                Créer un nouveau projet
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                Configurez votre projet avec tous les détails nécessaires pour assurer son succès
              </DialogDescription>
              
              {/* Indicateur de progression */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progression du formulaire</span>
                  <span>{Math.round(((formData.name ? 1 : 0) + (formData.description && formData.description.length >= 20 ? 1 : 0) + (formData.category ? 1 : 0) + (formData.deadline ? 1 : 0) + (formData.budget ? 1 : 0)) / 5 * 100)}%</span>
                </div>
                <Progress 
                  value={((formData.name ? 1 : 0) + (formData.description && formData.description.length >= 20 ? 1 : 0) + (formData.category ? 1 : 0) + (formData.deadline ? 1 : 0) + (formData.budget ? 1 : 0)) / 5 * 100} 
                  className="h-2"
                />
              </div>
            </DialogHeader>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (formData.name && formData.description) {
                setIsUploading(true);
                try {
                  const startDate = new Date();
                  const endDate = formData.deadline ? new Date(formData.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                  
                  // Simuler l'upload des fichiers
                  if (uploadedFiles.length > 0) {
                    toast.info(`Upload de ${uploadedFiles.length} fichier(s) en cours...`);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation
                  }
                  
                  createProject({
                    name: formData.name,
                    description: formData.description,
                    status: 'planning',
                    priority: formData.priority,
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    budget: parseInt(formData.budget) || 0,
                    manager_id: 1, // ID utilisateur connecté
                    team_id: 1 // ID équipe par défaut
                  });
                  
                  setFormData({
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
                  setUploadedFiles([]);
                  setIsCreateDialogOpen(false);
                  
                  if (uploadedFiles.length > 0) {
                    toast.success(`Projet créé avec ${uploadedFiles.length} fichier(s) uploadé(s) !`);
                  }
                } catch (error) {
                  toast.error('Erreur lors de la création du projet');
                } finally {
                  setIsUploading(false);
                }
              }
            }} className="space-y-8">
              
              {/* Section 1: Informations de base */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Informations de base</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Nom du projet *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      placeholder="Ex: Refonte du site web corporate"
                      className={`h-12 text-base ${formErrors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                      required
                    />
                    {formErrors.name ? (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {formErrors.name}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">Choisissez un nom clair et descriptif</p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Catégorie
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Développement</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="research">Recherche</SelectItem>
                        <SelectItem value="operations">Opérations</SelectItem>
                        <SelectItem value="sales">Ventes</SelectItem>
                        <SelectItem value="hr">Ressources Humaines</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description du projet *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="Décrivez en détail les objectifs, la portée et les livrables attendus du projet..."
                    className={`min-h-[120px] text-base resize-none ${formErrors.description ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                  {formErrors.description ? (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {formErrors.description}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">Une description claire aide l'équipe à comprendre les enjeux ({formData.description.length}/1000 caractères)</p>
                  )}
                </div>
              </div>

              {/* Section 2: Planning et Budget */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Planning et Budget</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                      Priorité
                    </Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            Faible
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                            Moyenne
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                            Haute
                          </div>
                        </SelectItem>
                        <SelectItem value="critical">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            Critique
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="deadline" className="text-sm font-medium text-gray-700">
                      Date d'échéance
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleFieldChange('deadline', e.target.value)}
                      className={`h-12 ${formErrors.deadline ? 'border-red-500 focus:border-red-500' : ''}`}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {formErrors.deadline && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {formErrors.deadline}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="budget" className="text-sm font-medium text-gray-700">
                      Budget alloué (€)
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleFieldChange('budget', e.target.value)}
                      placeholder="50000"
                      className={`h-12 ${formErrors.budget ? 'border-red-500 focus:border-red-500' : ''}`}
                      min="0"
                      step="1000"
                    />
                    {formErrors.budget && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {formErrors.budget}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Objectifs et Ressources */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Objectifs et Ressources</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="objectives" className="text-sm font-medium text-gray-700">
                      Objectifs principaux
                    </Label>
                    <Textarea
                      id="objectives"
                      value={formData.objectives}
                      onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                      placeholder="• Améliorer l'expérience utilisateur&#10;• Augmenter les conversions de 25%&#10;• Réduire le temps de chargement"
                      rows={4}
                      className="text-base resize-none"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="resources" className="text-sm font-medium text-gray-700">
                      Ressources nécessaires
                    </Label>
                    <Textarea
                      id="resources"
                      value={formData.resources}
                      onChange={(e) => setFormData(prev => ({ ...prev, resources: e.target.value }))}
                      placeholder="• 2 développeurs frontend&#10;• 1 designer UX/UI&#10;• Serveurs de test&#10;• Licences logicielles"
                      rows={4}
                      className="text-base resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="kpi" className="text-sm font-medium text-gray-700">
                      Indicateurs de succès (KPI)
                    </Label>
                    <Textarea
                      id="kpi"
                      value={formData.kpi}
                      onChange={(e) => setFormData(prev => ({ ...prev, kpi: e.target.value }))}
                      placeholder="• Temps de chargement < 2s&#10;• Taux de conversion +25%&#10;• Score de satisfaction > 4.5/5"
                      rows={3}
                      className="text-base resize-none"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="expected_impact" className="text-sm font-medium text-gray-700">
                      Impact attendu
                    </Label>
                    <Textarea
                      id="expected_impact"
                      value={formData.expected_impact}
                      onChange={(e) => setFormData(prev => ({ ...prev, expected_impact: e.target.value }))}
                      placeholder="Amélioration significative de l'image de marque et augmentation du chiffre d'affaires..."
                      rows={3}
                      className="text-base resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Fichiers et Documents */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Upload className="h-4 w-4 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Fichiers et Documents</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Zone de drop */}
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                      isDragOver 
                        ? 'border-green-500 bg-green-50 scale-105' 
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip,.rar"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-900">
                          Glissez-déposez vos fichiers ici
                        </p>
                        <p className="text-sm text-gray-500">
                          ou cliquez pour sélectionner des fichiers
                        </p>
                        <p className="text-xs text-gray-400">
                          Formats supportés: Images, PDF, Documents, Excel, TXT, CSV, Archives (max 10MB par fichier)
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Liste des fichiers uploadés */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Fichiers sélectionnés ({uploadedFiles.length})</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                {getFileIcon(file)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FileX className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setFormData({
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
                    setUploadedFiles([]);
                    setIsDragOver(false);
                  }}
                  className="px-6 py-3 h-12"
                >
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || isUploading || !isFormValid()}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating || isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {isUploading ? 'Upload en cours...' : 'Création en cours...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Créer le projet {uploadedFiles.length > 0 && `(${uploadedFiles.length} fichier${uploadedFiles.length > 1 ? 's' : ''})`}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

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
                    <Badge variant="outline">{selectedProject.status}</Badge>
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
                  {selectedProject.manager_name && (
                    <div>
                      <span className="font-medium">Chef de projet :</span>
                      <p className="text-gray-600">{selectedProject.manager_name}</p>
                    </div>
                  )}
                  {selectedProject.end_date && (
                    <div>
                      <span className="font-medium">Échéance :</span>
                      <p className="text-gray-600">{new Date(selectedProject.end_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedProject.budget && (
                    <div>
                      <span className="font-medium">Budget :</span>
                      <p className="text-gray-600">{selectedProject.budget.toLocaleString()} €</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedProject(selectedProject);
                      setIsViewDialogOpen(false);
                      setIsEditDialogOpen(true);
                      setFormData({
                        name: selectedProject.name,
                        description: selectedProject.description,
                        category: '',
                        objectives: '',
                        owner: selectedProject.manager_name || '',
                        deadline: selectedProject.end_date ? selectedProject.end_date.split('T')[0] : '',
                        resources: '',
                        kpi: '',
                        priority: selectedProject.priority || 'medium',
                        budget: selectedProject.budget?.toString() || '',
                        team_size: '',
                        expected_impact: ''
                      });
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (selectedProject) {
                              deleteProject(selectedProject.id);
                              setIsViewDialogOpen(false);
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Edit className="h-6 w-6 text-blue-600" />
                Modifier le projet
              </DialogTitle>
              <DialogDescription>
                Modifiez les informations du projet
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (selectedProject && formData.name && formData.description) {
                updateProject({
                  id: selectedProject.id,
                  updateData: {
                    name: formData.name,
                    description: formData.description,
                    priority: formData.priority,
                    end_date: formData.deadline || selectedProject.end_date,
                    budget: parseInt(formData.budget) || selectedProject.budget
                  }
                });
                setIsEditDialogOpen(false);
              }
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nom du projet *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Refonte du site web"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priorité</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="critical">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez les objectifs et la portée du projet..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-budget">Budget (€)</Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="Ex: 50000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-deadline">Date d'échéance</Label>
                  <Input
                    id="edit-deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating || !formData.name || !formData.description}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
