import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  UserPlus, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Star,
  Award,
  TrendingUp,
  MessageCircle,
  Eye,
  ArrowRight,
  Building,
  Briefcase,
  Loader2,
  AlertTriangle,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
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
import { useTeam } from '../hooks/useTeam';
import { toast } from 'sonner';

export default function Team() {
  const { 
    users, 
    teams, 
    addMember, 
    removeMember, 
    createTeam,
    isLoadingTeams,
    isLoadingUsers,
    teamsError,
    usersError
  } = useTeam();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    role: 'member',
    phone: '',
    location: ''
  });

  const [teamFormData, setTeamFormData] = useState({
    name: '',
    description: '',
    department: ''
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  }, []);

  const handleTeamInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setTeamFormData(prev => ({
      ...prev,
      [id]: value
    }));
  }, []);

  const handleSelectChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleTeamSelectChange = useCallback((field: string, value: string) => {
    setTeamFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setIsCreateTeamDialogOpen(false);
  }, []);

  // Filtrage des utilisateurs
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = selectedDepartment === "all" || user.department === selectedDepartment;
      const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [users, searchQuery, selectedDepartment, selectedStatus]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim()) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      // Simuler l'ajout d'un membre (à adapter selon votre API)
      toast.success("Membre ajouté avec succès !");
      setIsDialogOpen(false);
      
      // Reset du formulaire
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        department: '',
        role: 'member',
        phone: '',
        location: ''
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Une erreur est survenue lors de l'ajout du membre");
    }
  }, [formData]);

  const handleCreateTeam = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (!teamFormData.name.trim() || !teamFormData.department.trim()) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      createTeam(teamFormData);
      setIsCreateTeamDialogOpen(false);
      
      // Reset du formulaire
      setTeamFormData({
        name: '',
        description: '',
        department: ''
      });

      toast.success("Équipe créée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Une erreur est survenue lors de la création de l'équipe");
    }
  }, [teamFormData, createTeam]);

  const handleRemoveMember = useCallback((userId: number, teamId: number) => {
    removeTeamMember(teamId, userId);
    toast.success("Membre retiré de l'équipe");
  }, [removeTeamMember]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'member': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Gestion des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="w-full py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Notre Équipe
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les talents qui font de notre entreprise un succès
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Membres</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : users.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {users.filter(u => u.status === 'active').length} actifs
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Équipes</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : teams.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Organisées par département
                  </p>
                </div>
                <div className="h-12 w-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Building className="h-6 w-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Managers</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : users.filter(u => u.role === 'manager').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Leaders d'équipe
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Départements</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : 
                      new Set(users.map(u => u.department)).size
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Domaines d'expertise
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-green-600" />
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
                placeholder="Rechercher un membre..."
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
          
          <div className="flex gap-2">
            <Dialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
                  <Building className="h-4 w-4 mr-2" />
                  Nouvelle Équipe
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Building className="h-6 w-6 text-purple-600" />
                    Créer une nouvelle équipe
                  </DialogTitle>
                  <DialogDescription>
                    Créez une nouvelle équipe pour organiser vos projets
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateTeam} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nom de l'équipe *
                    </Label>
                    <Input 
                      id="name" 
                      placeholder="Ex: Équipe Développement" 
                      value={teamFormData.name}
                      onChange={handleTeamInputChange}
                      className="bg-white/80"
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium">
                      Département *
                    </Label>
                    <Select value={teamFormData.department} onValueChange={(value) => handleTeamSelectChange('department', value)} required>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Sélectionnez un département" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">💻 IT</SelectItem>
                        <SelectItem value="Marketing">📢 Marketing</SelectItem>
                        <SelectItem value="Sales">💰 Sales</SelectItem>
                        <SelectItem value="HR">👥 RH</SelectItem>
                        <SelectItem value="Finance">💰 Finance</SelectItem>
                        <SelectItem value="Operations">⚙️ Opérations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description
                    </Label>
                    <Input 
                      id="description" 
                      placeholder="Description de l'équipe..." 
                      value={teamFormData.description}
                      onChange={handleTeamInputChange}
                      className="bg-white/80"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleDialogClose}
                      className="bg-white/80"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Créer l'équipe
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter Membre
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <UserPlus className="h-6 w-6 text-purple-600" />
                    Ajouter un nouveau membre
                  </DialogTitle>
                  <DialogDescription>
                    Intégrez un nouveau talent à votre équipe
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first_name" className="text-sm font-medium">
                        Prénom *
                      </Label>
                      <Input 
                        id="first_name" 
                        placeholder="Prénom" 
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="bg-white/80"
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last_name" className="text-sm font-medium">
                        Nom *
                      </Label>
                      <Input 
                        id="last_name" 
                        placeholder="Nom" 
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="bg-white/80"
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="email@exemple.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-white/80"
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-medium">
                        Département
                      </Label>
                      <Select value={formData.department} onValueChange={(value) => handleSelectChange('department', value)}>
                        <SelectTrigger className="bg-white/80">
                          <SelectValue placeholder="Sélectionnez un département" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IT">💻 IT</SelectItem>
                          <SelectItem value="Marketing">📢 Marketing</SelectItem>
                          <SelectItem value="Sales">💰 Sales</SelectItem>
                          <SelectItem value="HR">👥 RH</SelectItem>
                          <SelectItem value="Finance">💰 Finance</SelectItem>
                          <SelectItem value="Operations">⚙️ Opérations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium">
                        Rôle
                      </Label>
                      <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                        <SelectTrigger className="bg-white/80">
                          <SelectValue placeholder="Sélectionnez un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">👤 Membre</SelectItem>
                          <SelectItem value="manager">👨‍💼 Manager</SelectItem>
                          <SelectItem value="admin">👑 Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Téléphone
                      </Label>
                      <Input 
                        id="phone" 
                        placeholder="+33 1 23 45 67 89" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-white/80"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium">
                        Localisation
                      </Label>
                      <Input 
                        id="location" 
                        placeholder="Paris, France" 
                        value={formData.location}
                        onChange={handleInputChange}
                        className="bg-white/80"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleDialogClose}
                      className="bg-white/80"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Ajouter le membre
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-600" />
                <p className="text-gray-600">Chargement de l'équipe...</p>
              </div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {getInitials(user.first_name, user.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {user.first_name} {user.last_name}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir profil
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={`${getStatusColor(user.status)} border`}>
                        {user.status}
                      </Badge>
                      <Badge className={`${getRoleColor(user.role)} border`}>
                        {user.role}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="h-4 w-4" />
                        <span>{user.department || 'Non assigné'}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      {user.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{user.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Membre depuis {new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Contacter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent>
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Aucun membre trouvé</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedDepartment !== "all" || selectedStatus !== "all"
                    ? "Aucun membre ne correspond à vos critères de recherche."
                    : "Commencez par ajouter votre premier membre d'équipe"
                  }
                </p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter un membre
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}