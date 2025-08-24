import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Lightbulb, 
  Users, 
  TrendingUp, 
  MessageSquare,
  Shield,
  Zap,
  Target,
  Award
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl">CollabFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Se connecter</Button>
            </Link>
            <Link to="/login">
              <Button variant="gradient">Commencer</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Transformez vos idées en projets concrets
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              CollabFlow est la plateforme collaborative qui permet à votre équipe de proposer, 
              suivre et réaliser des initiatives innovantes ensemble.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="xl" variant="gradient" className="gap-2">
                  Démarrer gratuitement
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="xl" variant="outline">
                  Voir la démo
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-secondary opacity-30" />
      </section>

      {/* Features Grid */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Une plateforme complète pour la collaboration
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tous les outils dont vous avez besoin pour transformer vos idées en succès
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-slow hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Initiatives collaboratives</h3>
              <p className="text-sm text-muted-foreground">
                Proposez et votez pour les meilleures idées de votre équipe
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-slow hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-gradient-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Suivi en temps réel</h3>
              <p className="text-sm text-muted-foreground">
                Visualisez l'avancement de tous les projets d'un coup d'œil
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-slow hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-gradient-success/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Organigramme interactif</h3>
              <p className="text-sm text-muted-foreground">
                Découvrez qui travaille sur quoi dans votre organisation
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-slow hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Chat intégré</h3>
              <p className="text-sm text-muted-foreground">
                Communiquez directement sur chaque projet et initiative
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-secondary/30 py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Pourquoi choisir CollabFlow?
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Sécurité entreprise</h3>
                    <p className="text-sm text-muted-foreground">
                      Authentification sécurisée avec gestion des rôles et permissions
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Notifications intelligentes</h3>
                    <p className="text-sm text-muted-foreground">
                      Restez informé des évolutions importantes sans être submergé
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Target className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Alignement stratégique</h3>
                    <p className="text-sm text-muted-foreground">
                      Assurez-vous que chaque initiative contribue aux objectifs globaux
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Reconnaissance des contributions</h3>
                    <p className="text-sm text-muted-foreground">
                      Valorisez l'engagement de chaque membre de l'équipe
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-3xl" />
              <Card className="relative">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="text-5xl font-bold text-primary">78%</div>
                    <p className="text-lg font-semibold">Augmentation de l'engagement</p>
                    <p className="text-muted-foreground">
                      Les entreprises utilisant CollabFlow voient leur taux de participation 
                      aux initiatives internes augmenter de 78% en moyenne
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à transformer votre façon de collaborer?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Rejoignez des milliers d'équipes qui utilisent déjà CollabFlow pour 
              concrétiser leurs meilleures idées
            </p>
            <Link to="/login">
              <Button size="xl" variant="secondary" className="gap-2">
                Essayer gratuitement
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">C</span>
              </div>
              <span className="font-semibold">CollabFlow</span>
              <span className="text-muted-foreground text-sm">© 2024</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-foreground transition-colors">
                Conditions d'utilisation
              </Link>
              <Link to="#" className="hover:text-foreground transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="#" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
