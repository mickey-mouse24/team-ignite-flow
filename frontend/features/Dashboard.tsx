import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Lightbulb,
  ArrowRight,
  Eye,
  Heart,
  MessageCircle,
  BarChart3,
  Activity,
  Zap,
  Star,
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'initiative': return <Lightbulb className="h-4 w-4" />;
      case 'project': return <Target className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      case 'notification': return <MessageCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
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
            <p className="text-gray-600">{statsError}</p>
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
      
      <main className="w-full py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Tableau de Bord
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Vue d'ensemble de vos initiatives, projets et équipe
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Initiatives</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" /> : stats.initiatives.total}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.initiatives.inProgress} en cours
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Projets</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" /> : stats.projects.total}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.projects.inProgress} actifs
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Équipe</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" /> : stats.team.total}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.team.active} actifs
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progression</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" /> : 
                      `${Math.round((stats.initiatives.completed + stats.projects.completed) / Math.max(stats.initiatives.total + stats.projects.total, 1) * 100)}%`
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Terminés
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Initiatives */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                Initiatives Récentes
              </CardTitle>
              <Link to="/initiatives">
                <Button variant="ghost" size="sm">
                  Voir tout
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : initiatives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {initiatives.slice(0, 6).map((initiative) => (
                  <div key={initiative.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                          {getCategoryIcon(initiative.category)}
                        </div>
                        <Badge className={`${getStatusColor(initiative.status)} border`}>
                          {getStatusIcon(initiative.status)}
                          <span className="ml-1">{initiative.status}</span>
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {initiative.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {initiative.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{initiative.category}</span>
                      <span>{new Date(initiative.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Lightbulb className="mx-auto h-8 w-8 mb-2" />
                <p>Aucune initiative récente</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Projets Récents
              </CardTitle>
              <Link to="/projects">
                <Button variant="ghost" size="sm">
                  Voir tout
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.slice(0, 6).map((project) => (
                  <div key={project.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-green-100 rounded flex items-center justify-center">
                          <Target className="h-4 w-4 text-green-600" />
                        </div>
                        <Badge className={`${getStatusColor(project.status)} border`}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1">{project.status}</span>
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Progression</span>
                        <span className="font-medium">{project.progress || 0}%</span>
                      </div>
                      <Progress value={project.progress || 0} className="h-1" />
                    </div>
                                         <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                       <span>Projet</span>
                       <span>{new Date(project.created_at).toLocaleDateString()}</span>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="mx-auto h-8 w-8 mb-2" />
                <p>Aucun projet récent</p>
              </div>
            )}
          </CardContent>
        </Card>
        
         {/* Recent Activity */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Activité Récente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {activity.description} • {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                      {activity.user && (
                        <p className="text-xs text-gray-500">
                          par {activity.user.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="mx-auto h-8 w-8 mb-2" />
                  <p>Aucune activité récente</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/initiatives">
                <Button variant="outline" className="w-full justify-start">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Nouvelle Initiative
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Nouveau Projet
                </Button>
              </Link>
              <Link to="/team">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Gérer l'Équipe
                </Button>
              </Link>
              <Link to="/search">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}