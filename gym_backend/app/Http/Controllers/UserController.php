<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\Adherent;
use App\Models\Coach;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Get all users with their details
     */
    public function index()
    {
        try {
            $users = Utilisateur::with(['adherent', 'coach'])->get();
              $formattedUsers = $users->map(function ($user) {
                $userData = [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'role' => $user->role,
                    'date_creation' => $user->date_creation,
                    'abonnement_type' => $this->getAbonnementType($user),
                    'date_debut' => $this->getDateDebut($user),
                    'date_fin' => $this->getDateFin($user)
                ];

                // Add coach-specific data if user is a coach
                if ($user->role === 'coach' && $user->coach) {
                    $userData['specialite'] = $user->coach->specialite;
                    $userData['experience'] = $user->coach->experience;
                }

                return $userData;
            });

            return response()->json([
                'success' => true,
                'data' => $formattedUsers
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching users: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new user
     */
    public function store(Request $request)
    {        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:utilisateurs',
            'mot_de_passe' => 'required|string|min:6',
            'role' => 'required|in:admin,coach,adherent',
            'specialite' => 'required_if:role,coach|string|max:255',
            'experience' => 'nullable|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }        try {
            $user = Utilisateur::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
                'mot_de_passe' => $request->mot_de_passe,
                'role' => $request->role,
                'date_creation' => now()
            ]);            // Create role-specific record
            if ($request->role === 'adherent') {
                Adherent::create(['utilisateur_id' => $user->id]);
            } elseif ($request->role === 'coach') {
                Coach::create([
                    'utilisateur_id' => $user->id,
                    'specialite' => $request->specialite,
                    'experience' => $request->experience ?? 0
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing user
     */
    public function update(Request $request, $id)
    {        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|required|string|max:255',
            'prenom' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:utilisateurs,email,' . $id,
            'mot_de_passe' => 'sometimes|string|min:6',
            'role' => 'sometimes|required|in:admin,coach,adherent',
            'specialite' => 'required_if:role,coach|string|max:255',
            'experience' => 'nullable|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'erreurs de validation',
                'errors' => $validator->errors()
            ], 422);
        }        try {
            $user = Utilisateur::findOrFail($id);
              $updateData = $request->only(['nom', 'prenom', 'email', 'role']);
            
            if ($request->has('mot_de_passe')) {
                $updateData['mot_de_passe'] = $request->mot_de_passe;
            }

            $user->update($updateData);

            // Update coach-specific data if user is a coach
            if ($user->role === 'coach' && $user->coach) {
                $coachData = [];
                if ($request->has('specialite')) {
                    $coachData['specialite'] = $request->specialite;
                }
                if ($request->has('experience')) {
                    $coachData['experience'] = $request->experience;
                }
                if (!empty($coachData)) {
                    $user->coach->update($coachData);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a user
     */
    public function destroy($id)
    {
        try {
            $user = Utilisateur::findOrFail($id);
            
            // Delete role-specific records first
            if ($user->adherent) {
                $user->adherent->delete();
            }
            if ($user->coach) {
                $user->coach->delete();
            }
            
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper method to get subscription type
     */
    private function getAbonnementType($user)
    {
        if ($user->role === 'adherent' && $user->adherent) {
            // Add logic to get subscription type from inscriptions or abonnements
            return 'Basic'; // Placeholder
        }
        return $user->role;
    }

    /**
     * Helper method to get start date
     */
    private function getDateDebut($user)
    {
        if ($user->role === 'adherent' && $user->adherent) {
            // Add logic to get start date from inscriptions
            return now()->format('Y-m-d'); // Placeholder
        }
        return $user->date_creation;
    }

    /**
     * Helper method to get end date
     */
    private function getDateFin($user)
    {
        if ($user->role === 'adherent' && $user->adherent) {
            // Add logic to get end date from inscriptions
            return now()->addYear()->format('Y-m-d'); // Placeholder
        }
        return null;
    }
}