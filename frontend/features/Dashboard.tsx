import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award, 
  Clock, 
  CheckCircle, 
  Lightbulb,
  ArrowRight,
  BarChart3,
  Zap,
  Loader2,
  AlertTriangle
} 
from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Header } from '../components/layout/Header';
import { useStats } from '../hooks/useStats';
import { useInitiatives } from '../hooks/useInitiatives';
import { useProjects } from '../hooks/useProjects';
import { useTeam } from '../hooks/useTeam';
import UserProductivityChart from '../components/charts/UserProductivityChart';

export default function Dashboard() {
  const { stats, isLoading: statsLoading, error: statsError } = useStats();
  const { initiatives, isLoading: initiativesLoading } = useInitiatives({ limit: 5 });
  const { projects, isLoading: projectsLoading } = useProjects({ limit: 5 });
  const { users } = useTeam();

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


  const isLoading = statsLoading || initiativesLoading || projectsLoading;

  // Gestion des erreurs
  if (statsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="text-center space-y-4">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Erreur de chargement</h2>
            <p className="text-gray-600">Erreur de connexion au serveur</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="w-full py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Hero Section - Simplified */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Tableau de Bord
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vue d'ensemble simplifiée de vos initiatives et projets
          </p>
        </div>

        {/* Stats Overview - Simplified */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Initiatives</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats?.initiatives?.total || 0}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {stats?.initiatives?.inProgress || 0} en cours
                  </p>
                </div>
                <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="h-7 w-7 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Projets</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats?.projects?.total || 0}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {stats?.projects?.inProgress || 0} actifs
                  </p>
                </div>
                <div className="h-14 w-14 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Target className="h-7 w-7 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Progression</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : 
                      `${Math.round(((stats?.initiatives?.completed || 0) + (stats?.projects?.completed || 0)) / Math.max((stats?.initiatives?.total || 0) + (stats?.projects?.total || 0), 1) * 100)}%`
                    }
                  </p>
                  <p className="text-sm text-orange-600 mt-1">
                    Terminés
                  </p>
                </div>
                <div className="h-14 w-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Productivity Chart */}
        <UserProductivityChart className="bg-white/90 backdrop-blur-sm border-0 shadow-xl" />

        {/* Recent Initiatives - Simplified */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                </div>
                Initiatives Récentes
              </CardTitle>
              <Link to="/initiatives">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  Voir tout
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : initiatives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {initiatives.slice(0, 4).map((initiative) => (
                  <div key={initiative.id} className="p-5 border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 bg-gray-50/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getCategoryIcon(initiative.category)}
                        </div>
                        <Badge className={`${getStatusColor(initiative.status)} border-0 text-xs`}>
                          {getStatusIcon(initiative.status)}
                          <span className="ml-1">{initiative.status}</span>
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 text-lg">
                      {initiative.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {initiative.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{initiative.category}</span>
                      <span className="text-gray-400">{new Date(initiative.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Lightbulb className="mx-auto h-12 w-12 mb-3 text-gray-300" />
                <p className="text-lg">Aucune initiative récente</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects - Simplified */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                Projets Récents
              </CardTitle>
              <Link to="/projects">
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                  Voir tout
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(0, 4).map((project) => (
                  <div key={project.id} className="p-5 border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 bg-gray-50/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Target className="h-5 w-5 text-green-600" />
                        </div>
                        <Badge className={`${getStatusColor(project.status)} border-0 text-xs`}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1">{project.status}</span>
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 text-lg">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Progression</span>
                        <span className="font-semibold text-green-600">{project.progress || 0}%</span>
                      </div>
                      <Progress value={project.progress || 0} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-sm mt-4">
                      <span className="text-gray-500">Projet</span>
                      <span className="text-gray-400">{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Target className="mx-auto h-12 w-12 mb-3 text-gray-300" />
                <p className="text-lg">Aucun projet récent</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions - Simplified */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/initiatives">
                <Button variant="outline" className="w-full justify-start h-12 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <Lightbulb className="h-5 w-5 mr-3 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Nouvelle Initiative</div>
                    <div className="text-xs text-gray-500">Créer une idée</div>
                  </div>
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" className="w-full justify-start h-12 hover:bg-green-50 hover:border-green-200 transition-colors">
                  <Target className="h-5 w-5 mr-3 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium">Nouveau Projet</div>
                    <div className="text-xs text-gray-500">Lancer un projet</div>
                  </div>
                </Button>
              </Link>
              <Link to="/team">
                <Button variant="outline" className="w-full justify-start h-12 hover:bg-purple-50 hover:border-purple-200 transition-colors">
                  <Users className="h-5 w-5 mr-3 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium">Gérer l'Équipe</div>
                    <div className="text-xs text-gray-500">Voir les membres</div>
                  </div>
                </Button>
              </Link>
              <Link to="/search">
                <Button variant="outline" className="w-full justify-start h-12 hover:bg-orange-50 hover:border-orange-200 transition-colors">
                  <BarChart3 className="h-5 w-5 mr-3 text-orange-600" />
                  <div className="text-left">
                    <div className="font-medium">Rechercher</div>
                    <div className="text-xs text-gray-500">Explorer les données</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}