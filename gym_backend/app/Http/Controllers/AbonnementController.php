<?php

namespace App\Http\Controllers;

use App\Models\Abonnement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AbonnementController extends Controller
{
    /**
     * Display a listing of the abonnements.
     */    public function index(): JsonResponse
    {
        try {
            $abonnements = Abonnement::orderBy('id', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'data' => $abonnements,
                'message' => 'Abonnements retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching abonnements: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created abonnement in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'nom' => 'required|string|max:255',
                'prix' => 'required|numeric|min:0',
                'duree' => 'required|integer|min:1',
                'description' => 'required|string'
            ]);

            $abonnement = Abonnement::create($validatedData);

            return response()->json([
                'success' => true,
                'data' => $abonnement,
                'message' => 'Abonnement created successfully'
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating abonnement: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified abonnement.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $abonnement = Abonnement::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $abonnement,
                'message' => 'Abonnement retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Abonnement not found'
            ], 404);
        }
    }

    /**
     * Update the specified abonnement in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $abonnement = Abonnement::findOrFail($id);
            
            $validatedData = $request->validate([
                'nom' => 'required|string|max:255',
                'prix' => 'required|numeric|min:0',
                'duree' => 'required|integer|min:1',
                'description' => 'required|string'
            ]);

            $abonnement->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => $abonnement,
                'message' => 'Abonnement updated successfully'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating abonnement: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified abonnement from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $abonnement = Abonnement::findOrFail($id);
            
            // Check if abonnement has active subscriptions
            if ($abonnement->inscriptions()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete abonnement with active subscriptions'
                ], 422);
            }
            
            $abonnement->delete();

            return response()->json([
                'success' => true,
                'message' => 'Abonnement deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting abonnement: ' . $e->getMessage()
            ], 500);
        }
    }
}
