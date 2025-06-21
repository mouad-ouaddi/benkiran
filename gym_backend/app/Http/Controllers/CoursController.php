<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\Coach;
use Illuminate\Http\Request;

class CoursController extends Controller
{
    /**
     * Get all courses
     */
    public function index()
    {
        try {
            $cours = Cours::with(['coach.utilisateur', 'planning'])->get();

            $formattedCours = $cours->map(function ($cours) {
                return [
                    'id' => $cours->id,
                    'nom' => $cours->nom,
                    'type' => $cours->type,
                    'description' => $cours->description,
                    'coach_name' => $cours->coach ? ($cours->coach->utilisateur->prenom . ' ' . $cours->coach->utilisateur->nom) : 'No coach assigned',
                    'coach_specialite' => $cours->coach ? $cours->coach->specialite : null,
                    'coach_id' => $cours->coach_id,
                    'planning_id' => $cours->planning_id,
                    'has_planning' => $cours->planning_id ? true : false
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

    /**
     * Create a new course
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:100',
                'description' => 'nullable|string',
                'type' => 'required|string|max:255',
                'coach_id' => 'required|exists:coachs,id'
            ]);

            $cours = Cours::create($validated);
            $cours->load(['coach.utilisateur']);

            return response()->json([
                'success' => true,
                'message' => 'Course created successfully',
                'data' => $cours
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating course: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific course
     */
    public function show($id)
    {
        try {
            $cours = Cours::with(['coach.utilisateur', 'planning'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $cours
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update a course
     */
    public function update(Request $request, $id)
    {
        try {
            $cours = Cours::findOrFail($id);

            $validated = $request->validate([
                'nom' => 'sometimes|string|max:100',
                'description' => 'sometimes|nullable|string',
                'type' => 'sometimes|string|max:255',
                'coach_id' => 'sometimes|exists:coachs,id'
            ]);

            $cours->update($validated);
            $cours->load(['coach.utilisateur']);

            return response()->json([
                'success' => true,
                'message' => 'Course updated successfully',
                'data' => $cours
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating course: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a course
     */
    public function destroy($id)
    {
        try {
            $cours = Cours::findOrFail($id);

            // Check if course is assigned to any planning
            if ($cours->planning_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete course that is assigned to a planning session'
                ], 422);
            }

            $cours->delete();

            return response()->json([
                'success' => true,
                'message' => 'Course deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting course: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available coaches for courses
     */
    public function getAvailableCoaches()
    {
        try {
            $coaches = Coach::with('utilisateur')->get();

            $formattedCoaches = $coaches->map(function ($coach) {
                return [
                    'id' => $coach->id,
                    'name' => $coach->utilisateur->prenom . ' ' . $coach->utilisateur->nom,
                    'specialite' => $coach->specialite,
                    'experience' => $coach->experience
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedCoaches
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving coaches: ' . $e->getMessage()
            ], 500);
        }
    }
}
