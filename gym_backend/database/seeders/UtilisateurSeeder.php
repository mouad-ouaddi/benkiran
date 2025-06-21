<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    public function run()
    {
        // Admin user
        DB::table('utilisateurs')->insert([
            'nom' => 'Admin',
            'prenom' => 'Super',
            'email' => 'admin@gym.com',
            'mot_de_passe' => Hash::make('admin123'),
            'role' => 'admin',
            'date_creation' => now()
        ]);

        // Coach user
        $coachUserId = DB::table('utilisateurs')->insertGetId([
            'nom' => 'Martin',
            'prenom' => 'Pierre',
            'email' => 'coach@gym.com',
            'mot_de_passe' => Hash::make('coach123'),
            'role' => 'coach',
            'date_creation' => now()
        ]);

        // Insert coach data
        DB::table('coachs')->insert([
            'utilisateur_id' => $coachUserId,
            'specialite' => 'Musculation et Cardio',
            'experience' => 5
        ]);

        // Adherent user
        $adherentUserId = DB::table('utilisateurs')->insertGetId([
            'nom' => 'Dupont',
            'prenom' => 'Marie',
            'email' => 'adherent@gym.com',
            'mot_de_passe' => Hash::make('adherent123'),
            'role' => 'adherent',
            'date_creation' => now()
        ]);

        // Insert adherent data
        DB::table('adherents')->insert([
            'utilisateur_id' => $adherentUserId
        ]);

        // Additional sample users
        $coach2UserId = DB::table('utilisateurs')->insertGetId([
            'nom' => 'Garcia',
            'prenom' => 'Sofia',
            'email' => 'sofia.garcia@gym.com',
            'mot_de_passe' => 'sofia123',
            'role' => 'coach',
            'date_creation' => now()
        ]);

        DB::table('coachs')->insert([
            'utilisateur_id' => $coach2UserId,
            'specialite' => 'Yoga et Pilates',
            'experience' => 3
        ]);

        $adherent2UserId = DB::table('utilisateurs')->insertGetId([
            'nom' => 'Bernard',
            'prenom' => 'Jean',
            'email' => 'jean.bernard@gym.com',
            'mot_de_passe' => 'jean123',
            'role' => 'adherent',
            'date_creation' => now()
        ]);

        DB::table('adherents')->insert([
            'utilisateur_id' => $adherent2UserId
        ]);
    }
}
