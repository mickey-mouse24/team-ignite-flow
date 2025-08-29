import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  // Supprimer toutes les données existantes
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.project.deleteMany();
  await prisma.initiative.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️ Données existantes supprimées');

  // Créer l'utilisateur administrateur (user@collabflow.com)
  const admin = await prisma.user.create({
    data: {
      email: 'user@collabflow.com',
      first_name: 'User',
      last_name: 'Admin',
      role: 'admin',
      department: 'Management',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      phone: '+33 1 23 45 67 89',
      location: 'Paris, France'
    }
  });

  console.log('👤 Utilisateur administrateur créé:', admin.email);

  // Créer des équipes
  const team1 = await prisma.team.create({
    data: {
      name: 'Équipe Développement',
      description: 'Équipe responsable du développement des applications',
      manager_id: admin.id
    }
  });

  const team2 = await prisma.team.create({
    data: {
      name: 'Équipe Design',
      description: 'Équipe responsable du design et de l\'UX',
      manager_id: admin.id
    }
  });

  console.log('👥 Équipes créées');

  // Créer des initiatives
  const initiative1 = await prisma.initiative.create({
    data: {
      title: 'Modernisation de l\'interface utilisateur',
      description: 'Refonte complète de l\'interface utilisateur pour améliorer l\'expérience utilisateur',
      status: 'in_progress',
      priority: 'high',
      category: 'UI/UX',
      author_id: admin.id,
      progress: 45,
      objectives: 'Améliorer l\'expérience utilisateur',
      expected_impact: 'Augmentation de la satisfaction utilisateur',
      kpi: 'Taux de satisfaction',
      owner: 'Équipe Design',
      deadline: new Date('2024-06-30'),
      team_size: '5-8 personnes',
      resources: 'Designers, développeurs frontend',
      budget: 50000
    }
  });

  const initiative2 = await prisma.initiative.create({
    data: {
      title: 'Optimisation des performances',
      description: 'Amélioration des performances de l\'application principale',
      status: 'planning',
      priority: 'medium',
      category: 'Performance',
      author_id: admin.id,
      progress: 10,
      objectives: 'Réduire le temps de chargement',
      expected_impact: 'Amélioration des performances',
      kpi: 'Temps de chargement moyen',
      owner: 'Équipe Développement',
      deadline: new Date('2024-08-31'),
      team_size: '3-5 personnes',
      resources: 'Développeurs backend',
      budget: 30000
    }
  });

  const initiative3 = await prisma.initiative.create({
    data: {
      title: 'Nouvelle fonctionnalité de reporting',
      description: 'Développement d\'un système de reporting avancé',
      status: 'completed',
      priority: 'high',
      category: 'Feature',
      author_id: admin.id,
      progress: 100,
      objectives: 'Créer un système de reporting complet',
      expected_impact: 'Meilleure visibilité des données',
      kpi: 'Utilisation du reporting',
      owner: 'Équipe Développement',
      deadline: new Date('2024-01-31'),
      team_size: '4-6 personnes',
      resources: 'Développeurs full-stack',
      budget: 40000
    }
  });

  console.log('🚀 Initiatives créées');

  // Créer des projets
  const project1 = await prisma.project.create({
    data: {
      name: 'Refonte Frontend',
      description: 'Migration vers React 18 et amélioration de l\'architecture',
      status: 'in_progress',
      priority: 'high',
      manager_id: admin.id,
      team_id: team1.id,
      initiative_id: initiative1.id,
      start_date: new Date('2024-02-01'),
      end_date: new Date('2024-07-31'),
      budget_allocated: 75000,
      budget_spent: 33750,
      progress: 45
    }
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Système de notifications',
      description: 'Implémentation d\'un système de notifications en temps réel',
      status: 'planning',
      priority: 'medium',
      manager_id: admin.id,
      team_id: team1.id,
      initiative_id: initiative2.id,
      start_date: new Date('2024-04-01'),
      end_date: new Date('2024-09-30'),
      budget_allocated: 25000,
      budget_spent: 0,
      progress: 0
    }
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Design System',
      description: 'Création d\'un système de design unifié',
      status: 'completed',
      priority: 'medium',
      manager_id: admin.id,
      team_id: team2.id,
      initiative_id: initiative3.id,
      start_date: new Date('2023-09-01'),
      end_date: new Date('2024-02-28'),
      budget_allocated: 35000,
      budget_spent: 35000,
      progress: 100
    }
  });

  console.log('📋 Projets créés');

  // Créer des commentaires
  await prisma.comment.create({
    data: {
      content: 'Excellent travail sur la première phase !',
      user_id: admin.id,
      initiative_id: initiative1.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Il faudrait revoir la priorité de ce projet.',
      user_id: admin.id,
      initiative_id: initiative2.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Projet terminé avec succès !',
      user_id: admin.id,
      initiative_id: initiative3.id
    }
  });

  console.log('💬 Commentaires créés');

  // Créer des likes
  await prisma.like.create({
    data: {
      user_id: admin.id,
      initiative_id: initiative1.id
    }
  });

  await prisma.like.create({
    data: {
      user_id: admin.id,
      initiative_id: initiative3.id
    }
  });

  console.log('👍 Likes créés');

  // Créer des notifications
  await prisma.notification.create({
    data: {
      title: 'Nouvelle initiative créée',
      message: 'L\'initiative "Modernisation de l\'interface utilisateur" a été créée',
      type: 'info',
      user_id: admin.id,
      is_read: false
    }
  });

  await prisma.notification.create({
    data: {
      title: 'Projet terminé',
      message: 'Le projet "Design System" a été marqué comme terminé',
      type: 'success',
      user_id: admin.id,
      is_read: true
    }
  });

  console.log('🔔 Notifications créées');

  console.log('✅ Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
