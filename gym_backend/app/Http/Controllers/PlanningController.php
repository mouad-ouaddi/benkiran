<?php

namespace App\Http\Controllers;

use App\Models\Planning;
use App\Models\Cours;
use App\Models\Coach;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PlanningController extends Controller
{
    /**
     * Get weekly planning for a specific week
     */
    public function getWeeklyPlanning(Request $request)
    {
        try {
            $startDate = $request->query('start_date', Carbon::now()->startOfWeek()->format('Y-m-d'));
            $endDate = Carbon::parse($startDate)->endOfWeek()->format('Y-m-d');

            $plannings = Planning::with(['cours.coach.utilisateur'])
                ->whereBetween('date_heure', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->orderBy('date_heure')
                ->get();

            // Group by day of week
            $weeklyPlanning = [];
            $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            
            foreach ($daysOfWeek as $day) {
                $weeklyPlanning[$day] = [];
            }

            foreach ($plannings as $planning) {
                $dayOfWeek = Carbon::parse($planning->date_heure)->format('l'); // Monday, Tuesday, etc.
                
                $planningData = [
                    'id' => $planning->id,
                    'date_heure' => $planning->date_heure,
                    'duree' => $planning->duree,
                    'capacite' => $planning->capacite,
                    'time' => Carbon::parse($planning->date_heure)->format('H:i'),
                    'reservations_count' => $planning->reservations()->count()
                ];

                // Add course info if exists
                if ($planning->cours) {
                    $planningData['cours_name'] = $planning->cours->nom;
                    $planningData['cours_type'] = $planning->cours->type;
                    $planningData['cours_description'] = $planning->cours->description;
                    
                    if ($planning->cours->coach && $planning->cours->coach->utilisateur) {
                        $planningData['coach_name'] = $planning->cours->coach->utilisateur->prenom . ' ' . $planning->cours->coach->utilisateur->nom;
                        $planningData['coach_specialite'] = $planning->cours->coach->specialite;
                    }
                }

                $weeklyPlanning[$dayOfWeek][] = $planningData;
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'planning' => $weeklyPlanning
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving weekly planning: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new planning session
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'date_heure' => 'required|date',
                'duree' => 'required|integer|min:15|max:240', // 15 minutes to 4 hours
                'capacite' => 'required|integer|min:1|max:50'
            ]);

            // Check for scheduling conflicts
            $conflictExists = Planning::where('date_heure', $validated['date_heure'])->exists();

            if ($conflictExists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Time slot conflict detected'
                ], 422);
            }

            $planning = Planning::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Planning session created successfully',
                'data' => $planning
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating planning session: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing planning session
     */
    public function update(Request $request, $id)
    {
        try {
            $planning = Planning::findOrFail($id);

            $validated = $request->validate([
                'date_heure' => 'sometimes|date',
                'duree' => 'sometimes|integer|min:15|max:240',
                'capacite' => 'sometimes|integer|min:1|max:50'
            ]);

            // Check for scheduling conflicts if date_heure is being updated
            if (isset($validated['date_heure'])) {
                $conflictExists = Planning::where('date_heure', $validated['date_heure'])
                    ->where('id', '!=', $id)
                    ->exists();

                if ($conflictExists) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Time slot conflict detected'
                    ], 422);
                }
            }

            $planning->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Planning session updated successfully',
                'data' => $planning
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating planning session: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a planning session
     */
    public function destroy($id)
    {
        try {
            $planning = Planning::findOrFail($id);

            // Check if there are any reservations
            $reservationsCount = $planning->reservations()->count();
            if ($reservationsCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Cannot delete planning session with {$reservationsCount} existing reservations"
                ], 422);
            }

            $planning->delete();

            return response()->json([
                'success' => true,
                'message' => 'Planning session deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting planning session: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create multiple planning sessions for a week
     */
    public function createWeeklyTemplate(Request $request)
    {
        try {
            $validated = $request->validate([
                'start_date' => 'required|date',
                'sessions' => 'required|array',
                'sessions.*.day_of_week' => 'required|integer|min:1|max:7', // 1 = Monday, 7 = Sunday
                'sessions.*.time' => 'required|date_format:H:i',
                'sessions.*.duree' => 'required|integer|min:15|max:240',
                'sessions.*.capacite' => 'required|integer|min:1|max:50'
            ]);

            $startDate = Carbon::parse($validated['start_date'])->startOfWeek();
            $createdSessions = [];

            DB::beginTransaction();

            foreach ($validated['sessions'] as $session) {
                $sessionDate = $startDate->copy()->addDays($session['day_of_week'] - 1);
                $dateTime = $sessionDate->format('Y-m-d') . ' ' . $session['time'] . ':00';

                // Check for conflicts
                $conflictExists = Planning::where('date_heure', $dateTime)->exists();
                if ($conflictExists) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Time slot conflict on {$sessionDate->format('Y-m-d')} at {$session['time']}"
                    ], 422);
                }

                $planning = Planning::create([
                    'date_heure' => $dateTime,
                    'duree' => $session['duree'],
                    'capacite' => $session['capacite']
                ]);

                $createdSessions[] = $planning;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Weekly template created successfully',
                'data' => $createdSessions
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error creating weekly template: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assign a course to a planning session
     */
    public function assignCourse(Request $request, $planningId)
    {
        try {
            $validated = $request->validate([
                'cours_id' => 'required|exists:cours,id'
            ]);

            $planning = Planning::findOrFail($planningId);
            
            // Check if course is already assigned to another planning at the same time
            $existingCours = Cours::where('planning_id', $planningId)->first();
            if ($existingCours) {
                return response()->json([
                    'success' => false,
                    'message' => 'This planning slot already has a course assigned'
                ], 422);
            }

            // Update the course to reference this planning
            $cours = Cours::findOrFail($validated['cours_id']);
            
            // Check if this course is already assigned to another planning
            if ($cours->planning_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'This course is already assigned to another planning slot'
                ], 422);
            }

            $cours->update(['planning_id' => $planningId]);

            return response()->json([
                'success' => true,
                'message' => 'Course assigned to planning successfully',
                'data' => $planning->load('cours.coach.utilisateur')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error assigning course: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available courses for planning
     */
    public function getAvailableCourses()
    {
        try {
            $cours = Cours::with(['coach.utilisateur'])
                ->whereNull('planning_id') // Only courses not assigned to any planning
                ->get();

            $formattedCours = $cours->map(function ($cours) {
                return [
                    'id' => $cours->id,
                    'nom' => $cours->nom,
                    'type' => $cours->type,
                    'description' => $cours->description,
                    'coach_name' => $cours->coach ? ($cours->coach->utilisateur->prenom . ' ' . $cours->coach->utilisateur->nom) : 'No coach assigned',
                    'coach_specialite' => $cours->coach ? $cours->coach->specialite : null
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedCours
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving courses: ' . $e->getMessage()
            ], 500);
        }
    }
}
