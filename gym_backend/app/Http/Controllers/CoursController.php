<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\Coach;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CoursController extends Controller
{
    /**
     * Display a listing of the courses.
     */
    public function index()
    {
        try {            $cours = Cours::with(['coach.utilisateur'])
                ->orderBy('date_debut', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $cours
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created course in storage.
     */    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:100',
            'description' => 'nullable|string',
            'type' => 'required|string|max:255',
            'coach_id' => 'required|exists:coachs,id',
            'date_debut' => 'required|date',
            'duree' => 'required|integer|min:1'
        ]);

        try {
            $cours = Cours::create([
                'nom' => $request->nom,
                'description' => $request->description,
                'type' => $request->type,
                'coach_id' => $request->coach_id,
                'date_debut' => $request->date_debut,
                'duree' => $request->duree
            ]);

            $cours->load(['coach.utilisateur']);

            return response()->json([
                'success' => true,
                'message' => 'Cours créé avec succès',
                'data' => $cours
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified course.
     */    public function show($id)
    {
        try {
            $cours = Cours::with(['coach.utilisateur'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $cours
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cours non trouvé',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified course in storage.
     */    public function update(Request $request, $id)
    {
        $request->validate([
            'nom' => 'required|string|max:100',
            'description' => 'nullable|string',
            'type' => 'required|string|max:255',
            'coach_id' => 'required|exists:coachs,id',
            'date_debut' => 'required|date',
            'duree' => 'required|integer|min:1'
        ]);

        try {
            $cours = Cours::findOrFail($id);
            
            $cours->update([
                'nom' => $request->nom,
                'description' => $request->description,
                'type' => $request->type,
                'coach_id' => $request->coach_id,
                'date_debut' => $request->date_debut,
                'duree' => $request->duree
            ]);

            $cours->load(['coach.utilisateur']);

            return response()->json([
                'success' => true,
                'message' => 'Cours mis à jour avec succès',
                'data' => $cours
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified course from storage.
     */
    public function destroy($id)
    {
        try {
            $cours = Cours::findOrFail($id);
            $cours->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cours supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all coaches for dropdown selection.
     */
    public function getCoachs()
    {
        try {
            $coachs = Coach::with('utilisateur')->get();

            return response()->json([
                'success' => true,
                'data' => $coachs
            ]);
        } catch (\Exception $e) {
            return response()->json([                'success' => false,
                'message' => 'Erreur lors de la récupération des coachs',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
