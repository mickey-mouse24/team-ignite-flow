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
  Edit,
  Trash2,
  MoreHorizontal,
  X,
  Save,
  AlertTriangle
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
import { useInitiatives } from '../hooks/useInitiatives';
import { toast } from 'sonner';
import { Initiative } from '../types';

export default function Initiatives() {
  const { initiatives, createInitiative, updateInitiative, deleteInitiative, isLoading } = useInitiatives({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    objectives: '',
    owner: '',
    deadline: '',
    resources: '',
    kpi: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    budget: '',
    team_size: '',
    expected_impact: '',
    progress: '0'
  });



  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  }, []);

  const handlePriorityChange = useCallback((value: string) => {
    setFormData(prev => ({
      ...prev,
      priority: value as 'low' | 'medium' | 'high' | 'critical'
    }));
  }, []);

  const handleSelectChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Fonction de validation réutilisable
  const validateInitiativeData = useCallback((data: typeof formData) => {
    if (!data.title.trim()) {
      toast.error("Le titre est obligatoire");
      return false;
    }
    
    if (!data.description.trim()) {
      toast.error("La description est obligatoire");
      return false;
    }
    
    if (!data.category.trim()) {
      toast.error("La catégorie est obligatoire");
      return false;
    }

    // Validation de la catégorie
    const validCategories = [
      'Ressources Humaines',
      'Technologie', 
      'Formation',
      'Marketing',
      'Innovation',
      'Commercialisation'
    ];
    
    if (!validCategories.includes(data.category)) {
      toast.error("Catégorie invalide");
      return false;
    }

    // Validation de la longueur des champs
    if (data.title.trim().length > 100) {
      toast.error("Le titre ne peut pas dépasser 100 caractères");
      return false;
    }

    if (data.description.trim().length > 1000) {
      toast.error("La description ne peut pas dépasser 1000 caractères");
      return false;
    }

    // Validation de la date limite si renseignée
    if (data.deadline) {
      const deadlineDate = new Date(data.deadline);
      if (isNaN(deadlineDate.getTime())) {
        toast.error("Date limite invalide");
        return false;
      }
      if (deadlineDate < new Date()) {
        toast.error("La date limite ne peut pas être dans le passé");
        return false;
      }
    }

    // Validation du budget si renseigné
    if (data.budget && (isNaN(parseFloat(data.budget)) || parseFloat(data.budget) < 0)) {
      toast.error("Le budget doit être un nombre positif");
      return false;
    }

    // Validation du progrès
    const progress = parseInt(data.progress);
    if (isNaN(progress) || progress < 0 || progress > 100) {
      toast.error("Le progrès doit être un nombre entre 0 et 100");
      return false;
    }

    return true;
  }, []);

  // Fonction pour réinitialiser le formulaire
  const resetFormData = useCallback(() => {
    setFormData({
      title: '',
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
      expected_impact: '',
      progress: '0'
    });
  }, []);

  // Fonctions séparées pour chaque dialog
  const handleCreateDialogClose = useCallback(() => {
    setIsCreateDialogOpen(false);
    resetFormData();
  }, [resetFormData]);

  const handleViewDialogClose = useCallback(() => {
    setIsViewDialogOpen(false);
    setSelectedInitiative(null);
  }, []);

  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false);
    setSelectedInitiative(null);
    resetFormData();
  }, [resetFormData]);

  // Fonction générale pour fermer toutes les dialogs (gardée pour compatibilité)
  const handleDialogClose = useCallback(() => {
    setIsCreateDialogOpen(false);
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedInitiative(null);
    resetFormData();
  }, [resetFormData]);

  // Affichage de toutes les initiatives sans filtrage avec protection contre les valeurs nulles
  const filteredInitiatives = useMemo(() => {
    return initiatives || [];
  }, [initiatives]);

  // Pagination
  const paginatedInitiatives = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInitiatives.slice(startIndex, endIndex);
  }, [filteredInitiatives, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredInitiatives.length / itemsPerPage);

  const handleCreateSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Validation des données
      if (!validateInitiativeData(formData)) {
        return;
      }



      createInitiative({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        objectives: formData.objectives.trim() || undefined,
        expected_impact: formData.expected_impact.trim() || undefined,
        kpi: formData.kpi.trim() || undefined,
        owner: formData.owner.trim() || undefined,
        deadline: formData.deadline || undefined,
        team_size: formData.team_size || undefined,
        resources: formData.resources.trim() || undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        priority: formData.priority,
        progress: parseInt(formData.progress)
      });
      
      setIsCreateDialogOpen(false);
      
      // Reset du formulaire
      setFormData({
        title: '',
        description: '',
        category: '',
        objectives: '',
        owner: '',
        deadline: '',
        resources: '',
        kpi: '',
        priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
        budget: '',
        team_size: '',
        expected_impact: '',
        progress: '0'
      });

      toast.success("Initiative créée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Une erreur est survenue lors de la création de l'initiative");
    }
  }, [formData, createInitiative]);

  const handleEditSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedInitiative) return;
    
    try {
      // Validation des données
      if (!validateInitiativeData(formData)) {
        return;
      }

      updateInitiative({
        id: selectedInitiative.id,
        updateData: {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category.trim(),
          objectives: formData.objectives.trim() || undefined,
          expected_impact: formData.expected_impact.trim() || undefined,
          kpi: formData.kpi.trim() || undefined,
          owner: formData.owner.trim() || undefined,
          deadline: formData.deadline || undefined,
          team_size: formData.team_size || undefined,
          resources: formData.resources.trim() || undefined,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
          priority: formData.priority,
          progress: parseInt(formData.progress)
        }
      });
      
      setIsEditDialogOpen(false);
      setSelectedInitiative(null);
      
      // Reset du formulaire
      setFormData({
        title: '',
        description: '',
        category: '',
        objectives: '',
        owner: '',
        deadline: '',
        resources: '',
        kpi: '',
        priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
        budget: '',
        team_size: '',
        expected_impact: '',
        progress: '0'
      });

      toast.success("Initiative modifiée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast.error("Une erreur est survenue lors de la modification de l'initiative");
    }
  }, [formData, selectedInitiative, updateInitiative]);

  const handleDelete = useCallback(async () => {
    if (!selectedInitiative) return;
    
    try {
      deleteInitiative(selectedInitiative.id);
      setIsViewDialogOpen(false);
      setSelectedInitiative(null);
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  }, [selectedInitiative, deleteInitiative]);

  const handleView = useCallback((initiative: Initiative) => {
    setSelectedInitiative(initiative);
    setIsViewDialogOpen(true);
  }, []);

  const handleEdit = useCallback((initiative: Initiative) => {
    try {
      setSelectedInitiative(initiative);
      setFormData({
        title: initiative.title || '',
        description: initiative.description || '',
        category: initiative.category || '',
        objectives: initiative.objectives || '',
        owner: initiative.owner || '',
        deadline: initiative.deadline || '',
        resources: initiative.resources || '',
        kpi: initiative.kpi || '',
        priority: initiative.priority || 'medium',
        budget: initiative.budget ? initiative.budget.toString() : '',
        team_size: initiative.team_size ? initiative.team_size.toString() : '',
        expected_impact: initiative.expected_impact || '',
        progress: (initiative.progress !== undefined && initiative.progress !== null) ? initiative.progress.toString() : '0'
      });
      setIsEditDialogOpen(true);
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du formulaire d\'édition:', error);
      toast.error('Impossible d\'ouvrir le formulaire d\'édition');
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'on-hold': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <TrendingUp className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'on-hold': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Ressources Humaines': return <Users className="h-4 w-4" />;
      case 'Technologie': return <TrendingUp className="h-4 w-4" />;
      case 'Formation': return <Award className="h-4 w-4" />;
      case 'Marketing': return <Target className="h-4 w-4" />;
      case 'Innovation': return <Lightbulb className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  // Protection contre les erreurs qui causent un écran blanc
  if (!initiatives && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="w-full py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Erreur de chargement</h2>
            <p className="text-gray-600">Impossible de charger les initiatives</p>
            <Button onClick={() => window.location.reload()}>
              Recharger la page
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="w-full py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Initiatives & Innovation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez et contribuez aux initiatives qui façonnent l'avenir de notre entreprise
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Initiatives</p>
                  <p className="text-3xl font-bold text-gray-900">{filteredInitiatives.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Cours</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {filteredInitiatives.filter(i => i.status === "in-progress").length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {filteredInitiatives.filter(i => i.status === "pending").length}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Terminées</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {filteredInitiatives.filter(i => i.status === "completed").length}
                  </p>
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
                placeholder="Rechercher une initiative..."
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
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Initiative
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-blue-600" />
                    Proposer une nouvelle initiative
                  </DialogTitle>
                  <DialogDescription>
                    Partagez votre idée innovante pour améliorer l'entreprise et contribuer à notre croissance
                  </DialogDescription>
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <strong>Note :</strong> Seuls les champs marqués d'un * sont obligatoires et seront sauvegardés. Les autres champs sont pour votre organisation personnelle.
                  </div>
                </DialogHeader>

              <form onSubmit={handleCreateSubmit} className="space-y-8">
                {/* Section Informations de base */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Informations de base</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Titre de l'initiative *
                      </Label>
                      <Input 
                        id="title" 
                        placeholder="Ex: Optimisation du processus de recrutement" 
                        value={formData.title}
                        onChange={handleInputChange}
                        className="bg-white/80"
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Catégorie *
                      </Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={handleCategoryChange}
                        required
                      >
                        <SelectTrigger className="bg-white/80">
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ressources Humaines">👥 Ressources Humaines</SelectItem>
                          <SelectItem value="Technologie">💻 Technologie</SelectItem>
                          <SelectItem value="Formation">🎓 Formation</SelectItem>
                          <SelectItem value="Marketing">📢 Marketing</SelectItem>
                          <SelectItem value="Innovation">💡 Innovation</SelectItem>
                          <SelectItem value="Commercialisation">💰 Commercialisation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description détaillée *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez votre initiative en détail, son contexte, ses objectifs et son impact attendu..."
                      className="min-h-[120px] bg-white/80 resize-none"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Section Objectifs et Impact */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <Award className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Objectifs et Impact</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="objectives" className="text-sm font-medium">
                        Objectifs spécifiques
                      </Label>
                      <Textarea
                        id="objectives"
                        placeholder="Listez les objectifs concrets de cette initiative..."
                        className="min-h-[100px] bg-white/80 resize-none"
                        value={formData.objectives}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expected_impact" className="text-sm font-medium">
                        Impact attendu
                      </Label>
                      <Textarea
                        id="expected_impact"
                        placeholder="Décrivez l'impact positif attendu sur l'entreprise..."
                        className="min-h-[100px] bg-white/80 resize-none"
                        value={formData.expected_impact}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="progress" className="text-sm font-medium">
                        Progression (%)
                      </Label>
                      <Input
                        id="progress"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0"
                        className="bg-white/80"
                        value={formData.progress}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-gray-500">
                        Indiquez le pourcentage d'avancement de l'initiative (0-100%)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kpi" className="text-sm font-medium">
                      Indicateurs de performance (KPIs)
                    </Label>
                    <Input
                      id="kpi"
                      placeholder="Ex: Réduction de 30% du temps de recrutement"
                      className="bg-white/80"
                      value={formData.kpi}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Section Planification */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold">Planification</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="owner" className="text-sm font-medium">
                        Responsable de l'initiative
                      </Label>
                      <Input
                        id="owner"
                        placeholder="Votre nom ou équipe responsable"
                        className="bg-white/80"
                        value={formData.owner}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="text-sm font-medium">
                        Date limite souhaitée
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        className="bg-white/80"
                        value={formData.deadline}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="team_size" className="text-sm font-medium">
                        Taille d'équipe estimée
                      </Label>
                      <Select value={formData.team_size} onValueChange={(value) => handleSelectChange('team_size', value)}>
                        <SelectTrigger className="bg-white/80">
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1-2 personnes</SelectItem>
                          <SelectItem value="3-5">3-5 personnes</SelectItem>
                          <SelectItem value="6-10">6-10 personnes</SelectItem>
                          <SelectItem value="10+">Plus de 10 personnes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Section Ressources */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold">Ressources et Priorité</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="resources" className="text-sm font-medium">
                        Ressources nécessaires
                      </Label>
                      <Textarea
                        id="resources"
                        placeholder="Décrivez les ressources nécessaires (budget, équipements, formations...)"
                        className="min-h-[100px] bg-white/80 resize-none"
                        value={formData.resources}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="budget" className="text-sm font-medium">
                          Budget estimé (FCFA)
                        </Label>
                        <Input
                          id="budget"
                          type="number"
                          placeholder="0"
                          className="bg-white/80"
                          value={formData.budget}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority" className="text-sm font-medium">
                          Niveau de priorité
                        </Label>
                        <Select value={formData.priority} onValueChange={handlePriorityChange}>
                          <SelectTrigger className="bg-white/80">
                            <SelectValue placeholder="Sélectionnez la priorité" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">🟢 Faible</SelectItem>
                            <SelectItem value="medium">🟡 Moyenne</SelectItem>
                            <SelectItem value="high">🔴 Élevée</SelectItem>
                            <SelectItem value="critical">⚫ Critique</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <Button type="button" variant="outline" onClick={handleCreateDialogClose} className="flex-1">
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Créer l'initiative
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Initiatives Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Toutes les initiatives ({filteredInitiatives.length})
            </h2>
          </div>

          {filteredInitiatives.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune initiative</h3>
                <p className="text-gray-600 mb-6">Soyez le premier à proposer une initiative !</p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer la première initiative
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedInitiatives.map((initiative, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          {getCategoryIcon(initiative.category)}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {initiative.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{initiative.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(initiative.status)} border`}>
                          {getStatusIcon(initiative.status)}
                          <span className="ml-1">{initiative.status}</span>
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleView(initiative)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(initiative)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action ne peut pas être annulée. Cette initiative sera définitivement supprimée.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => {
                                      setSelectedInitiative(initiative);
                                      handleDelete();
                                    }}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 line-clamp-3">
                      {initiative.description}
                    </p>
                    
                    {/* Affichage des informations supplémentaires si disponibles */}
                    {(initiative.objectives || initiative.expected_impact || initiative.kpi || initiative.owner || initiative.deadline || initiative.budget) && (
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        {initiative.objectives && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Objectifs :</span> {initiative.objectives.length > 50 ? `${initiative.objectives.substring(0, 50)}...` : initiative.objectives}
                          </div>
                        )}
                        {initiative.owner && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Responsable :</span> {initiative.owner}
                          </div>
                        )}
                        {initiative.deadline && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Échéance :</span> {new Date(initiative.deadline).toLocaleDateString()}
                          </div>
                        )}
                        {initiative.budget && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Budget :</span> {initiative.budget.toLocaleString()} FCFA
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Barre de progression */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">Progression</span>
                        <span className="text-gray-900 font-semibold">
                          {(initiative.progress !== undefined && initiative.progress !== null) ? initiative.progress : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={(initiative.progress !== undefined && initiative.progress !== null) ? initiative.progress : 0} 
                        className="h-2" 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Créée le {new Date(initiative.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => handleView(initiative)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {selectedInitiative?.title}
              </DialogTitle>
              <DialogDescription>
                Détails de l'initiative
              </DialogDescription>
            </DialogHeader>
            
            {selectedInitiative && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    {getCategoryIcon(selectedInitiative.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedInitiative.title}</h3>
                    <p className="text-sm text-gray-600">{selectedInitiative.category}</p>
                  </div>
                  <Badge className={`${getStatusColor(selectedInitiative.status)} border ml-auto`}>
                    {getStatusIcon(selectedInitiative.status)}
                    <span className="ml-1">{selectedInitiative.status}</span>
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700">{selectedInitiative.description}</p>
                </div>

                {/* Informations détaillées */}
                <div className="space-y-4">
                  {selectedInitiative.objectives && (
                    <div>
                      <h4 className="font-semibold mb-2">Objectifs</h4>
                      <p className="text-gray-700">{selectedInitiative.objectives}</p>
                    </div>
                  )}

                  {selectedInitiative.expected_impact && (
                    <div>
                      <h4 className="font-semibold mb-2">Impact attendu</h4>
                      <p className="text-gray-700">{selectedInitiative.expected_impact}</p>
                    </div>
                  )}

                  {selectedInitiative.kpi && (
                    <div>
                      <h4 className="font-semibold mb-2">Indicateurs de performance</h4>
                      <p className="text-gray-700">{selectedInitiative.kpi}</p>
                    </div>
                  )}

                  {selectedInitiative.resources && (
                    <div>
                      <h4 className="font-semibold mb-2">Ressources nécessaires</h4>
                      <p className="text-gray-700">{selectedInitiative.resources}</p>
                    </div>
                  )}
                </div>
                
                {/* Barre de progression dans la modal */}
                <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Progression de l'initiative</span>
                    <span className="text-lg font-bold text-gray-900">
                      {(selectedInitiative.progress !== undefined && selectedInitiative.progress !== null) ? selectedInitiative.progress : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={(selectedInitiative.progress !== undefined && selectedInitiative.progress !== null) ? selectedInitiative.progress : 0} 
                    className="h-3" 
                  />
                  <p className="text-sm text-gray-600">
                    {(() => {
                      const progress = (selectedInitiative.progress !== undefined && selectedInitiative.progress !== null) ? selectedInitiative.progress : 0;
                      if (progress === 0) return "Initiative non démarrée";
                      if (progress > 0 && progress < 25) return "Initiative en phase de démarrage";
                      if (progress >= 25 && progress < 50) return "Initiative en cours de développement";
                      if (progress >= 50 && progress < 75) return "Initiative en bonne voie";
                      if (progress >= 75 && progress < 100) return "Initiative presque terminée";
                      if (progress === 100) return "Initiative terminée";
                      return "Initiative en cours";
                    })()}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Créé le :</span>
                    <p className="text-gray-600">{new Date(selectedInitiative.created_at).toLocaleDateString()}</p>
                  </div>
                  {selectedInitiative.owner && (
                    <div>
                      <span className="font-medium">Responsable :</span>
                      <p className="text-gray-600">{selectedInitiative.owner}</p>
                    </div>
                  )}
                  {selectedInitiative.deadline && (
                    <div>
                      <span className="font-medium">Échéance :</span>
                      <p className="text-gray-600">{new Date(selectedInitiative.deadline).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedInitiative.team_size && (
                    <div>
                      <span className="font-medium">Taille d'équipe :</span>
                      <p className="text-gray-600">{selectedInitiative.team_size}</p>
                    </div>
                  )}
                  {selectedInitiative.budget && (
                    <div>
                      <span className="font-medium">Budget :</span>
                      <p className="text-gray-600">{selectedInitiative.budget.toLocaleString()} FCFA</p>
                    </div>
                  )}
                  {selectedInitiative.priority && (
                    <div>
                      <span className="font-medium">Priorité :</span>
                      <p className="text-gray-600 capitalize">{selectedInitiative.priority}</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleEdit(selectedInitiative)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-1">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. Cette initiative sera définitivement supprimée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
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
          <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Edit className="h-6 w-6 text-blue-600" />
                Modifier l'initiative
              </DialogTitle>
              <DialogDescription>
                Modifiez les détails de l'initiative pour l'améliorer
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="space-y-8">
              {/* Section Informations de base */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Informations de base</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Titre de l'initiative *
                    </Label>
                    <Input 
                      id="title" 
                      placeholder="Ex: Optimisation du processus de recrutement" 
                      value={formData.title}
                      onChange={handleInputChange}
                      className="bg-white/80"
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Catégorie *
                    </Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange} required>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ressources Humaines">👥 Ressources Humaines</SelectItem>
                        <SelectItem value="Technologie">💻 Technologie</SelectItem>
                        <SelectItem value="Formation">🎓 Formation</SelectItem>
                        <SelectItem value="Marketing">📢 Marketing</SelectItem>
                        <SelectItem value="Innovation">💡 Innovation</SelectItem>
                        <SelectItem value="Commercialisation">💰 Commercialisation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description détaillée *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre initiative en détail, son contexte, ses objectifs et son impact attendu..."
                    className="min-h-[120px] bg-white/80 resize-none"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Section Objectifs et Impact */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Award className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Objectifs et Impact</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="objectives" className="text-sm font-medium">
                      Objectifs spécifiques
                    </Label>
                    <Textarea
                      id="objectives"
                      placeholder="Listez les objectifs concrets de cette initiative..."
                      className="min-h-[100px] bg-white/80 resize-none"
                      value={formData.objectives}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expected_impact" className="text-sm font-medium">
                      Impact attendu
                    </Label>
                    <Textarea
                      id="expected_impact"
                      placeholder="Décrivez l'impact positif attendu sur l'entreprise..."
                      className="min-h-[100px] bg-white/80 resize-none"
                      value={formData.expected_impact}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="progress" className="text-sm font-medium">
                    Progression (%)
                  </Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    className="bg-white/80"
                    value={formData.progress}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500">
                    Indiquez le pourcentage d'avancement de l'initiative (0-100%)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpi" className="text-sm font-medium">
                    Indicateurs de performance (KPIs)
                  </Label>
                  <Input
                    id="kpi"
                    placeholder="Ex: Réduction de 30% du temps de recrutement"
                    className="bg-white/80"
                    value={formData.kpi}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Section Planification */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Planification</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="owner" className="text-sm font-medium">
                      Responsable de l'initiative
                    </Label>
                    <Input
                      id="owner"
                      placeholder="Votre nom ou équipe responsable"
                      className="bg-white/80"
                      value={formData.owner}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-sm font-medium">
                      Date limite souhaitée
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      className="bg-white/80"
                      value={formData.deadline}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team_size" className="text-sm font-medium">
                      Taille d'équipe estimée
                    </Label>
                    <Select value={formData.team_size} onValueChange={(value) => handleSelectChange('team_size', value)}>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 personnes</SelectItem>
                        <SelectItem value="3-5">3-5 personnes</SelectItem>
                        <SelectItem value="6-10">6-10 personnes</SelectItem>
                        <SelectItem value="10+">Plus de 10 personnes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Section Ressources */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold">Ressources et Priorité</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="resources" className="text-sm font-medium">
                      Ressources nécessaires
                    </Label>
                    <Textarea
                      id="resources"
                      placeholder="Décrivez les ressources nécessaires (budget, équipements, formations...)"
                      className="min-h-[100px] bg-white/80 resize-none"
                      value={formData.resources}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-sm font-medium">
                        Budget estimé (FCFA)
                      </Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="0"
                        className="bg-white/80"
                        value={formData.budget}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-sm font-medium">
                        Niveau de priorité
                      </Label>
                      <Select value={formData.priority} onValueChange={handlePriorityChange}>
                        <SelectTrigger className="bg-white/80">
                          <SelectValue placeholder="Sélectionnez la priorité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">🟢 Faible</SelectItem>
                          <SelectItem value="medium">🟡 Moyenne</SelectItem>
                          <SelectItem value="high">🔴 Élevée</SelectItem>
                          <SelectItem value="critical">⚫ Critique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={handleEditDialogClose} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}