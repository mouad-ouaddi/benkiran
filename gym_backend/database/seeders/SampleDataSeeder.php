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
        }

        // Create cours
        $cours = [
            [
                'nom' => 'Musculation Débutant',
                'description' => 'Cours de musculation pour débutants',
                'type' => 'Musculation',
                'coach_id' => 1
            ],
            [
                'nom' => 'Cardio Training',
                'description' => 'Séance de cardio intensif',
                'type' => 'Cardio',
                'coach_id' => 1
            ],
            [
                'nom' => 'Yoga Détente',
                'description' => 'Séance de yoga relaxante',
                'type' => 'Yoga',
                'coach_id' => 2
            ],
            [
                'nom' => 'Cross Training',
                'description' => 'Entraînement croisé haute intensité',
                'type' => 'Autre',
                'coach_id' => 2
            ]
        ];

        foreach ($cours as $coursItem) {
            DB::table('cours')->insert($coursItem);
        }

        // Create plannings for this week
        $today = Carbon::now();
        $startOfWeek = $today->copy()->startOfWeek();
        
        for ($day = 0; $day < 7; $day++) {
            $currentDay = $startOfWeek->copy()->addDays($day);
            
            // Morning sessions
            DB::table('plannings')->insert([
                'cours_id' => rand(1, 4),
                'date_heure' => $currentDay->copy()->setTime(9, 0),
                'duree' => 60,
                'capacite' => 15
            ]);
            
            // Afternoon sessions
            DB::table('plannings')->insert([
                'cours_id' => rand(1, 4),
                'date_heure' => $currentDay->copy()->setTime(14, 0),
                'duree' => 60,
                'capacite' => 12
            ]);
            
            // Evening sessions
            DB::table('plannings')->insert([
                'cours_id' => rand(1, 4),
                'date_heure' => $currentDay->copy()->setTime(18, 0),
                'duree' => 90,
                'capacite' => 20
            ]);
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
                    'adherent_id' => $adherent->id,
                    'planning_id' => $planning->id,
                    'statut' => rand(1, 100) <= 90 ? 'réservé' : 'annulé',
                    'date_reservation' => Carbon::now()->subDays(rand(1, 7))
                ]);
            }
        }
    }
}
