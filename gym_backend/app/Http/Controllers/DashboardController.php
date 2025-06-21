<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\Adherent;
use App\Models\Coach;
use App\Models\Cours;
use App\Models\Planning;
use App\Models\Inscription;
use App\Models\Abonnement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getStatistics()
    {
        try {
            // Get total number of adherents
            $totalAdherents = Adherent::count();

            // Get total number of courses scheduled this week
            $coursThisWeek = Planning::whereBetween('date_heure', [
                Carbon::now()->startOfWeek(),
                Carbon::now()->endOfWeek()
            ])->count();

            // Get monthly revenue from active subscriptions
            $monthlyRevenue = Inscription::whereMonth('date_debut', Carbon::now()->month)
                ->whereYear('date_debut', Carbon::now()->year)
                ->where('statut', 'actif')
                ->join('abonnements', 'inscriptions.abonnement_id', '=', 'abonnements.id')
                ->sum('abonnements.prix');

            // Calculate occupation rate (reservations vs total capacity)
            $totalCapacity = Planning::whereBetween('date_heure', [
                Carbon::now()->startOfWeek(),
                Carbon::now()->endOfWeek()
            ])->sum('capacite');

            $totalReservations = DB::table('reservations')
                ->join('plannings', 'reservations.planning_id', '=', 'plannings.id')
                ->whereBetween('plannings.date_heure', [
                    Carbon::now()->startOfWeek(),
                    Carbon::now()->endOfWeek()
                ])
                ->where('reservations.statut', 'réservé')
                ->count();

            $occupationRate = $totalCapacity > 0 ? round(($totalReservations / $totalCapacity) * 100) : 0;

            // Get user statistics by role
            $userStats = Utilisateur::select('role', DB::raw('count(*) as count'))
                ->groupBy('role')
                ->pluck('count', 'role')
                ->toArray();

            // Get recent activity data for charts
            $monthlyInscriptions = Inscription::select(
                DB::raw('MONTH(date_inscription) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->whereYear('date_inscription', Carbon::now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'totalAdherents' => $totalAdherents,
                    'coursThisWeek' => $coursThisWeek,
                    'monthlyRevenue' => number_format($monthlyRevenue, 2),
                    'occupationRate' => $occupationRate,
                    'userStats' => $userStats,
                    'monthlyInscriptions' => $monthlyInscriptions
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getDetailedStats()
    {
        try {
            // Get subscription distribution
            $subscriptionStats = Abonnement::select('nom', 'prix')
                ->withCount(['inscriptions as active_subscriptions' => function($query) {
                    $query->where('statut', 'actif');
                }])
                ->get();

            // Get coach workload
            $coachStats = Coach::select('coachs.*', 'utilisateurs.nom', 'utilisateurs.prenom')
                ->join('utilisateurs', 'coachs.utilisateur_id', '=', 'utilisateurs.id')
                ->withCount(['cours as total_courses'])
                ->get();

            // Get course types popularity
            $courseTypes = Cours::select('type', DB::raw('count(*) as count'))
                ->groupBy('type')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'subscriptionStats' => $subscriptionStats,
                    'coachStats' => $coachStats,
                    'courseTypes' => $courseTypes
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques détaillées',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
