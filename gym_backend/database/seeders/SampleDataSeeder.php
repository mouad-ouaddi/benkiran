<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SampleDataSeeder extends Seeder
{
    public function run()
    {
        // Create sample users
        $users = [
            [
                'nom' => 'Admin',
                'prenom' => 'System',
                'email' => 'admin@gym.com',
                'mot_de_passe' => 'admin123',
                'role' => 'admin',
                'date_creation' => Carbon::now()
            ],
            [
                'nom' => 'Martin',
                'prenom' => 'Pierre',
                'email' => 'pierre.martin@email.com',
                'mot_de_passe' => 'coach123',
                'role' => 'coach',
                'date_creation' => Carbon::now()
            ],
            [
                'nom' => 'Dubois',
                'prenom' => 'Sophie',
                'email' => 'sophie.dubois@email.com',
                'mot_de_passe' => 'coach123',
                'role' => 'coach',
                'date_creation' => Carbon::now()
            ]
        ];

        // Add adherent users
        for ($i = 1; $i <= 25; $i++) {
            $users[] = [
                'nom' => 'Adherent' . $i,
                'prenom' => 'User' . $i,
                'email' => 'user' . $i . '@email.com',
                'mot_de_passe' => 'user123',
                'role' => 'adherent',
                'date_creation' => Carbon::now()
            ];
        }

        foreach ($users as $user) {
            DB::table('utilisateurs')->insert($user);
        }

        // Create coachs entries
        $coach1 = DB::table('utilisateurs')->where('email', 'pierre.martin@email.com')->first();
        $coach2 = DB::table('utilisateurs')->where('email', 'sophie.dubois@email.com')->first();

        DB::table('coachs')->insert([
            [
                'utilisateur_id' => $coach1->id,
                'specialite' => 'Musculation',
                'experience' => 5
            ],
            [
                'utilisateur_id' => $coach2->id,
                'specialite' => 'Yoga et Fitness',
                'experience' => 3
            ]
        ]);

        // Create adherents entries
        $adherentUsers = DB::table('utilisateurs')->where('role', 'adherent')->get();
        foreach ($adherentUsers as $user) {
            DB::table('adherents')->insert([
                'utilisateur_id' => $user->id
            ]);
        }

        // Create abonnements
        $abonnements = [
            [
                'nom' => 'Abonnement Mensuel',
                'prix' => 49.99,
                'duree' => 30,
                'description' => 'Accès illimité pendant 1 mois',
                'date_creation' => Carbon::now()
            ],
            [
                'nom' => 'Abonnement Trimestriel',
                'prix' => 129.99,
                'duree' => 90,
                'description' => 'Accès illimité pendant 3 mois',
                'date_creation' => Carbon::now()
            ],
            [
                'nom' => 'Abonnement Annuel',
                'prix' => 449.99,
                'duree' => 365,
                'description' => 'Accès illimité pendant 1 an',
                'date_creation' => Carbon::now()
            ]
        ];

        foreach ($abonnements as $abonnement) {
            DB::table('abonnements')->insert($abonnement);
        }        // Create cours
        $cours = [
            [
                'nom' => 'Musculation Débutant',
                'description' => 'Cours de musculation pour débutants',
                'type' => 'Musculation',
                'coach_id' => 1,
                'planning_id' => null
            ],
            [
                'nom' => 'Cardio Training',
                'description' => 'Séance de cardio intensif',
                'type' => 'Cardio',
                'coach_id' => 1,
                'planning_id' => null
            ],
            [
                'nom' => 'Yoga Détente',
                'description' => 'Séance de yoga relaxante',
                'type' => 'Yoga',
                'coach_id' => 2,
                'planning_id' => null
            ],
            [
                'nom' => 'Cross Training',
                'description' => 'Entraînement croisé haute intensité',
                'type' => 'Cross Training',
                'coach_id' => 2,
                'planning_id' => null
            ],
            [
                'nom' => 'Pilates',
                'description' => 'Cours de pilates pour renforcer le core',
                'type' => 'Pilates',
                'coach_id' => 1,
                'planning_id' => null
            ],
            [
                'nom' => 'Zumba',
                'description' => 'Cours de danse fitness énergique',
                'type' => 'Zumba',
                'coach_id' => 2,
                'planning_id' => null
            ]
        ];

        foreach ($cours as $coursItem) {
            DB::table('cours')->insert($coursItem);
        }

        // Create plannings for this week
        $today = Carbon::now();
        $startOfWeek = $today->copy()->startOfWeek();
        $planningIds = [];
        
        for ($day = 0; $day < 7; $day++) {
            $currentDay = $startOfWeek->copy()->addDays($day);
            
            // Morning sessions (9:00, 10:00)
            $planningId1 = DB::table('plannings')->insertGetId([
                'date_heure' => $currentDay->copy()->setTime(9, 0),
                'duree' => 60,
                'capacite' => 15
            ]);
            $planningIds[] = $planningId1;
            
            $planningId2 = DB::table('plannings')->insertGetId([
                'date_heure' => $currentDay->copy()->setTime(10, 0),
                'duree' => 60,
                'capacite' => 12
            ]);
            $planningIds[] = $planningId2;
            
            // Afternoon sessions (14:00, 15:00)
            $planningId3 = DB::table('plannings')->insertGetId([
                'date_heure' => $currentDay->copy()->setTime(14, 0),
                'duree' => 60,
                'capacite' => 12
            ]);
            $planningIds[] = $planningId3;
            
            $planningId4 = DB::table('plannings')->insertGetId([
                'date_heure' => $currentDay->copy()->setTime(15, 0),
                'duree' => 60,
                'capacite' => 18
            ]);
            $planningIds[] = $planningId4;
            
            // Evening sessions (18:00, 19:00)
            $planningId5 = DB::table('plannings')->insertGetId([
                'date_heure' => $currentDay->copy()->setTime(18, 0),
                'duree' => 90,
                'capacite' => 20
            ]);
            $planningIds[] = $planningId5;
            
            $planningId6 = DB::table('plannings')->insertGetId([
                'date_heure' => $currentDay->copy()->setTime(19, 0),
                'duree' => 60,
                'capacite' => 16
            ]);
            $planningIds[] = $planningId6;
        }

        // Assign some courses to planning sessions
        $coursIds = [1, 2, 3, 4, 5, 6];
        $assignedPlannings = array_slice($planningIds, 0, 6); // Assign 6 courses to first 6 planning slots
        
        for ($i = 0; $i < 6; $i++) {
            DB::table('cours')
                ->where('id', $coursIds[$i])
                ->update(['planning_id' => $assignedPlannings[$i]]);
        }

        // Create inscriptions
        $adherents = DB::table('adherents')->get();
        $abonnementIds = DB::table('abonnements')->pluck('id')->toArray();
        
        foreach ($adherents as $adherent) {
            if (rand(1, 100) <= 80) { // 80% of adherents have active subscriptions
                DB::table('inscriptions')->insert([
                    'adherent_id' => $adherent->id,
                    'abonnement_id' => $abonnementIds[array_rand($abonnementIds)],
                    'date_debut' => Carbon::now()->subDays(rand(1, 30)),
                    'date_fin' => Carbon::now()->addDays(rand(30, 365)),
                    'statut' => 'actif',
                    'date_inscription' => Carbon::now()->subDays(rand(1, 30))
                ]);
            }
        }

        // Create some reservations
        $plannings = DB::table('plannings')->get();
        foreach ($adherents as $adherent) {
            // Each adherent reserves 2-4 sessions
            $numReservations = rand(2, 4);
            $selectedPlannings = $plannings->random($numReservations);
            
            foreach ($selectedPlannings as $planning) {
                DB::table('reservations')->insert([
                    'adherent_id' => $adherent->id,                    'planning_id' => $planning->id,
                    'statut' => rand(1, 100) <= 90 ? 'réservé' : 'annulé',
                    'date_reservation' => Carbon::now()->subDays(rand(1, 7))
                ]);
            }
        }

        // Add sample reports
        $reportTitles = [
            'Équipement défectueux',
            'Problème avec mon abonnement',
            'Vestiaires sales',
            'Suggestion pour de nouveaux cours',
            'Coach en retard'
        ];

        $reportContents = [
            'J\'ai remarqué que l\'équipement X est défectueux depuis plusieurs jours. Pourriez-vous le réparer s\'il vous plaît ?',
            'Mon abonnement ne fonctionne pas correctement dans l\'application. Je ne peux pas réserver de cours.',
            'Les vestiaires étaient dans un état déplorable ce matin. Il y avait des serviettes partout et les douches n\'étaient pas propres.',
            'J\'aimerais suggérer des cours de yoga le week-end. Je pense que beaucoup de membres seraient intéressés.',
            'Le coach était en retard de 15 minutes hier pour le cours de 18h. C\'est la deuxième fois cette semaine.'
        ];

        // Get adherent IDs
        $adherentIds = DB::table('adherents')
            ->join('utilisateurs', 'adherents.utilisateur_id', '=', 'utilisateurs.id')
            ->pluck('utilisateurs.id')
            ->toArray();

        // Create reports
        for ($i = 0; $i < count($reportTitles); $i++) {
            $userId = $adherentIds[array_rand($adherentIds)];
            $hasResponse = rand(0, 1);
            
            DB::table('reports')->insert([
                'titre' => $reportTitles[$i],
                'utilisateur_id' => $userId,
                'contenu' => $reportContents[$i],
                'reponse' => $hasResponse ? 'Merci pour votre signalement. Nous avons pris note de votre demande et allons nous en occuper rapidement.' : null,
                'created_at' => Carbon::now()->subDays(rand(1, 14))
            ]);
        }
    }
}
